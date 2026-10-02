"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import { listJobs, searchJobs } from "@/lib/api/client";
import type { Job } from "@/types/job";

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const searchingRef = useRef(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listJobs();
      if (!searchingRef.current) {
        setJobs(data.jobs);
      }
    } catch (cause) {
      setJobs([]);
      setError(cause instanceof Error ? cause.message : "Não foi possível listar as vagas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    const log = logRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }, [statuses]);

  async function handleSearch() {
    searchingRef.current = true;
    setSearching(true);
    setError(null);
    setStatuses([]);
    setJobs([]);
    try {
      const data = await searchJobs((message) => {
        setStatuses((current) => [...current, message]);
      });
      setJobs(data.jobs);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível buscar as vagas.");
    } finally {
      searchingRef.current = false;
      setSearching(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Vagas
      </Typography>
      <Typography color="text.secondary">
        A busca pede para a API extrair as vagas da Gupy e gravar título e link.
      </Typography>
      <div>
        <Button variant="contained" onClick={handleSearch} disabled={searching}>
          Buscar vagas
        </Button>
      </div>
      {searching || statuses.length > 0 ? (
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
          {searching ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: statuses.length ? 1.5 : 0 }}>
              <CircularProgress size={18} />
              <Typography variant="body2">Buscando vagas na Gupy</Typography>
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
      {loading && !searching ? <Typography>Carregando vagas salvas...</Typography> : null}
      {!loading && !searching && jobs.length === 0 && !error ? (
        <Typography>Nenhuma vaga persistida ainda.</Typography>
      ) : null}
      {!searching && jobs.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
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
