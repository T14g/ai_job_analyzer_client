"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeTrends, getTrends } from "@/lib/api/client";
import type { TrendArea, TrendsAnalysis } from "@/types/job";

function AreaList({ title, areas }: { title: string; areas: TrendArea[] }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {areas.length === 0 ? (
        <Typography color="text.secondary">Sem dados.</Typography>
      ) : (
        areas.map((area, index) => (
          <Card key={`${area.name}-${index}`}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {index + 1}. {area.name}
              </Typography>
              {area.volume ? (
                <Typography sx={{ color: "#0b6e4f", fontWeight: 650, mb: area.trend ? 1 : 0 }}>
                  {area.volume}
                </Typography>
              ) : null}
              {area.trend ? <Typography>{area.trend}</Typography> : null}
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}

export function TrendsPage() {
  const [analysis, setAnalysis] = useState<TrendsAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const analyzingRef = useRef(false);

  const loadTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrends();
      if (!analyzingRef.current) {
        setAnalysis(data.analysis);
      }
    } catch (cause) {
      setAnalysis(null);
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar as tendências.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrends();
  }, [loadTrends]);

  useEffect(() => {
    const log = logRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }, [statuses]);

  async function handleAnalyze() {
    analyzingRef.current = true;
    setAnalyzing(true);
    setError(null);
    setStatuses([]);
    setAnalysis(null);
    try {
      const data = await analyzeTrends((message) => {
        setStatuses((current) => [...current, message]);
      });
      setAnalysis(data.analysis);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível analisar as tendências.");
    } finally {
      analyzingRef.current = false;
      setAnalyzing(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Tendências
      </Typography>
      <Typography color="text.secondary">
        A análise lê o JSON de vagas mais recente, consulta a OpenAI em dois passos e grava o resultado.
      </Typography>
      <div>
        <Button variant="contained" onClick={handleAnalyze} disabled={analyzing}>
          Analisar tendências
        </Button>
      </div>
      {analyzing || statuses.length > 0 ? (
        <Box
          ref={logRef}
          sx={{
            maxHeight: 240,
            overflow: "auto",
            p: 2,
            borderRadius: 1,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
        >
          {analyzing ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: statuses.length ? 1.5 : 0 }}>
              <CircularProgress size={18} />
              <Typography variant="body2">Analisando tendências de mercado</Typography>
            </Stack>
          ) : null}
          <Stack spacing={0.5}>
            {statuses.map((status, index) => (
              <Typography
                key={`${index}-${status}`}
                variant="body2"
                color={index === statuses.length - 1 ? "text.primary" : "text.secondary"}
              >
                {status}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}
      {error ? <Alert severity="warning">{error}</Alert> : null}
      {loading && !analyzing ? <Typography>Carregando tendências salvas...</Typography> : null}
      {!loading && !analyzing && !analysis && !error ? (
        <Typography>Nenhuma tendência persistida ainda.</Typography>
      ) : null}
      {!analyzing && analysis ? (
        <Stack spacing={2}>
          <Typography color="text.secondary">
            {analysis.totalJobs} vagas · {analysis.uniqueTitles} títulos únicos · {analysis.sourceFile}
          </Typography>
          {analysis.warnings.map((warning) => (
            <Alert key={warning} severity="warning">
              {warning}
            </Alert>
          ))}
          <AreaList title="Onde há mais vagas" areas={analysis.market} />
          <AreaList title="Tendências de desenvolvimento" areas={analysis.development} />
          <Typography variant="body2" color="text.secondary">
            {analysis.model} · entrada {analysis.inputTokens} · saída {analysis.outputTokens}
            {analysis.cachedTokens ? ` · cache ${analysis.cachedTokens}` : ""} · US${" "}
            {analysis.costUsd.toFixed(6)}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}
