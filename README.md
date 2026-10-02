# AI Job Analyzer — client

Front-end do AI Job Analyzer. É um app Next.js com TypeScript e Material UI. As telas falam com a API em `http://localhost:8000`.

## Telas

- `/` apresenta o sistema e os atalhos.
- `/vagas` dispara a coleta na Gupy, mostra o andamento e lista empresa, título e link.
- `/avaliar` envia uma área (por exemplo, front-end) e mostra os títulos que a API devolver, com o link já salvo.
- `/tendencias` mostra volume, empresas e termos a partir das vagas persistidas.

A avaliação e as tendências dependem de rotas que a API ainda vai ganhar. A busca de vagas já funciona com o server no ar.

## Como rodar

Na pasta `client`:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

A URL da API é `http://localhost:8000`. Para apontar para outro endereço, crie um `.env.local` com:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Estrutura

- `src/app` — rotas.
- `src/components/layout` — barra e navegação.
- `src/features` — telas de vagas, avaliação e tendências.
- `src/lib/api` — chamadas HTTP.
- `src/theme` — tema do Material UI.
- `src/types` — contratos compartilhados.
