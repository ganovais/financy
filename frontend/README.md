# Financy — Front-end

Aplicação React para gerenciamento de finanças pessoais, consumindo a API GraphQL do diretório `../backend`.

## Stack

- **React 19 + Vite 8 + TypeScript**
- **GraphQL** via `graphql-request`, com operações tipadas geradas pelo **GraphQL Code Generator** a partir do schema do back-end
- **TanStack Query** para cache, invalidação e estados de carregamento
- **React Router 8**, **Tailwind CSS 4**, componentes shadcn adaptados, **React Hook Form + Zod**

## Como rodar

```bash
pnpm install
cp .env.example .env   # VITE_BACKEND_URL aponta para a API (padrão http://localhost:4000)
pnpm dev               # http://localhost:5173
```

A API precisa estar no ar (`pnpm dev` em `../backend`). Com o seed do back-end, entre com `conta@teste.com` / `12345678`.

## Variáveis de ambiente

| Chave              | Descrição                                   |
| ------------------ | ------------------------------------------- |
| `VITE_BACKEND_URL` | Origem da API, ex.: `http://localhost:4000` |

## Rotas

- `/` — tela de login quando deslogado, dashboard quando logado
- `/login`, `/cadastro` — autenticação
- `/dashboard`, `/transacoes`, `/categorias`, `/perfil` — área autenticada

## Tipagem das operações GraphQL

As operações ficam em `src/lib/graphql/operations.ts` e os tipos gerados em `src/gql/`. Depois de alterar uma operação (ou o schema do back-end), rode:

```bash
pnpm codegen
```
