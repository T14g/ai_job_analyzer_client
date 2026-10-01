import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RouteButton } from "@/components/layout/RouteButton";

const entries = [
  {
    href: "/vagas",
    title: "Vagas",
    description: "Busca vagas na Gupy e lista título e link já persistidos.",
  },
  {
    href: "/avaliar",
    title: "Avaliar",
    description: "Envia os títulos para a IA e devolve os que combinam com a área, com o link salvo.",
  },
  {
    href: "/tendencias",
    title: "Tendências",
    description: "Mostra volume, empresas e termos a partir das mesmas vagas.",
  },
];

export default function Home() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Job Analyzer
        </Typography>
        <Typography color="text.secondary">
          As três telas leem a mesma base de vagas extraídas da Gupy.
        </Typography>
      </div>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {entries.map((entry) => (
          <Card key={entry.href} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {entry.title}
              </Typography>
              <Typography color="text.secondary">{entry.description}</Typography>
            </CardContent>
            <CardActions>
              <RouteButton href={entry.href}>Abrir</RouteButton>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
