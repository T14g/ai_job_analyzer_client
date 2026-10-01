"use client";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { getTrends } from "@/lib/api/client";
import type { TrendCount, TrendsResponse } from "@/types/job";

function CountTable({ title, rows, label }: { title: string; rows: TrendCount[]; label: string }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {rows.length === 0 ? (
        <Typography color="text.secondary">Sem dados.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{label}</TableCell>
              <TableCell align="right">Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}

export function TrendsPage() {
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getTrends()
      .then((data) => {
        if (active) {
          setTrends(data);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar as tendências.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Tendências
        </Typography>
        <Typography color="text.secondary">
          Volume por dia, empresas e termos mais comuns nos títulos das vagas persistidas.
        </Typography>
      </div>
      {error ? <Alert severity="warning">{error}</Alert> : null}
      {!trends && !error ? <Typography>Carregando tendências...</Typography> : null}
      {trends ? (
        <>
          <Typography>Total de vagas: {trends.totalJobs}</Typography>
          <CountTable title="Volume por dia" rows={trends.byDay} label="Dia" />
          <CountTable title="Empresas" rows={trends.byCompany} label="Empresa" />
          <CountTable title="Termos nos títulos" rows={trends.topTerms} label="Termo" />
        </>
      ) : null}
    </Stack>
  );
}
