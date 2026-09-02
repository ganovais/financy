# Financy — Back-end

API GraphQL para gerenciamento de finanças pessoais: autenticação de usuários e CRUD de transações e categorias, com cada usuário acessando apenas os próprios dados.

## Stack

- **Node.js + TypeScript** (ESM, executado com tsx)
- **GraphQL Yoga 5** sobre `node:http`
- **Prisma 7** + **SQLite** via driver adapter `better-sqlite3`
- **jose** (JWT HS256) e **argon2id** para hash de senha
- **zod** para validação de variáveis de ambiente e inputs

## Como rodar

```bash
pnpm install
cp .env.example .env   # preencha JWT_SECRET com 32+ caracteres
pnpm db:migrate        # cria o banco e aplica as migrations
pnpm db:seed           # opcional: conta demo conta@teste.com / 12345678
pnpm dev               # http://localhost:4000/graphql (GraphiQL incluso)
```

## Variáveis de ambiente

| Chave          | Descrição                                        |
| -------------- | ------------------------------------------------ |
| `JWT_SECRET`   | Segredo do JWT (mínimo 32 caracteres)            |
| `DATABASE_URL` | Ex.: `file:./prisma/dev.db`                      |
| `PORT`         | Porta do servidor (padrão `4000`)                |
| `CORS_ORIGIN`  | Origens permitidas, separadas por vírgula        |

## API

Autenticação via header `Authorization: Bearer <token>`.

- **Mutations**: `register`, `login`, `updateProfile`, `createCategory`, `updateCategory`, `deleteCategory`, `createTransaction`, `updateTransaction`, `deleteTransaction`
- **Queries**: `me`, `categories`, `transactions`

Datas de transação trafegam como `yyyy-MM-dd` e valores monetários como centavos inteiros (`amountInCents`). `Category.transactionCount` já vem agregado e `Transaction.category` vem incluído — a listagem completa do dashboard sai em uma única query. Excluir uma categoria remove as transações dela (cascade).

Erros de negócio retornam `extensions.code`: `UNAUTHENTICATED`, `INVALID_CREDENTIALS`, `EMAIL_TAKEN`, `NOT_FOUND`, `BAD_USER_INPUT`.
