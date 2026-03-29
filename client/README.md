# Client (React + Vite + shadcn/ui)

## Rodando local sem Docker

```bash
npm install
npm run dev
```

## Containers

O projeto possui dois modos em container:

- `dev`: Vite com HMR (atualizacao em tempo real).
- `prod`: simulacao de producao com Nginx servindo `dist`, enquanto um container faz rebuild continuo (`vite build --watch`).

### 1) Desenvolvimento com HMR

```bash
docker compose --profile dev up --build
```

App disponivel em `http://localhost:5173`.

### 2) Simulacao de producao com atualizacao continua

```bash
docker compose --profile prod up --build
```

App disponivel em `http://localhost:8080`.

Nesse modo:
- `client-build-watch` recompila o `dist` sempre que houver alteracao no codigo.
- `client-prod` (Nginx) serve esse build como em ambiente de producao.
