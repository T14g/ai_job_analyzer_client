import type {
  EvaluateResponse,
  JobsResponse,
  TrendsResponse,
} from "@/types/job";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let detail = `A API respondeu com status ${response.status}.`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (typeof body.detail === "string") {
        detail = body.detail;
      }
    } catch {
      // A resposta de erro nem sempre vem em JSON.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export function listJobs() {
  return request<JobsResponse>("/jobs");
}

export async function searchJobs(onStatus: (message: string) => void): Promise<JobsResponse> {
  const response = await fetch(`${API_URL}/jobs/search`, { method: "POST" });

  if (!response.ok || !response.body) {
    throw new Error(`A API respondeu com status ${response.status}.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: JobsResponse | null = null;

  const handleEvent = (raw: string) => {
    let eventName = "message";
    const dataLines: string[] = [];

    for (const line of raw.split("\n")) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      }
      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length === 0) {
      return;
    }

    const data = JSON.parse(dataLines.join("\n")) as unknown;

    if (eventName === "status" && typeof data === "string") {
      onStatus(data);
    }

    if (eventName === "done") {
      result = data as JobsResponse;
    }

    if (eventName === "error") {
      const detail = (data as { detail?: string }).detail;
      throw new Error(detail ?? "Não foi possível buscar as vagas.");
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (part.trim()) {
        handleEvent(part);
      }
    }
  }

  if (buffer.trim()) {
    handleEvent(buffer);
  }

  if (!result) {
    throw new Error("A busca terminou sem devolver as vagas.");
  }

  return result;
}

export function evaluateJobs(area: string) {
  return request<EvaluateResponse>("/evaluate", {
    method: "POST",
    body: JSON.stringify({ area }),
  });
}

export function getTrends() {
  return request<TrendsResponse>("/trends");
}
