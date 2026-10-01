"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState, type FormEvent } from "react";
import { evaluateJobs } from "@/lib/api/client";
import type { EvaluateMatch } from "@/types/job";

export function EvaluatePage() {
  const [area, setArea] = useState("front-end");
  const [matches, setMatches] = useState<EvaluateMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluatedArea, setEvaluatedArea] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = area.trim();
    if (!trimmed) {
      setError("Informe a área para avaliar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await evaluateJobs(trimmed);
      setMatches(data.matches);
      setEvaluatedArea(data.area);
    } catch (cause) {
      setMatches([]);
      setEvaluatedArea(null);
      setError(cause instanceof Error ? cause.message : "Não foi possível avaliar os títulos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Avaliar
      </Typography>
      <Typography color="text.secondary">
        A IA recebe só os títulos persistidos. O resultado volta com o link que já estava salvo.
      </Typography>
      <Stack component="form" direction={{ xs: "column", sm: "row" }} spacing={2} onSubmit={handleSubmit}>
        <TextField
          label="Área"
          value={area}
          onChange={(event) => setArea(event.target.value)}
          placeholder="front-end"
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Avaliando..." : "Avaliar títulos"}
        </Button>
      </Stack>
      {error ? <Alert severity="warning">{error}</Alert> : null}
      {evaluatedArea && matches.length === 0 ? (
        <Typography>Nenhum título de {evaluatedArea} foi encontrado.</Typography>
      ) : null}
      {matches.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((job) => (
              <TableRow key={job.url}>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>
                  <Link href={job.url} target="_blank" rel="noopener noreferrer">
                    Abrir vaga
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </Stack>
  );
}
