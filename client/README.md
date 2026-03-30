# Client (React + Vite + shadcn/ui)

## Rodando local sem Docker

```bash
cp .env.example .env
npm install
npm run dev
```

## Firebase (Auth + Firestore)

Preencha as variaveis no arquivo `.env` com os dados do seu projeto Firebase:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

No Console do Firebase, habilite:

- Authentication > Sign-in method > Email/Password
- Firestore Database (modo de desenvolvimento para MVP)

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
