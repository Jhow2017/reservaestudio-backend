# Histórico de setup (projeto legado)

Este documento registra os passos que foram feitos para colocar o backend para rodar localmente.

## Contexto

O projeto foi recebido pronto e, no primeiro `yarn start`, apareceram erros de Prisma/TypeScript e depois erros de infraestrutura (banco fora do ar ou sem tabelas).

## O que de fato resolveu

1. Gerar o Prisma Client novamente:

```bash
yarn prisma generate
```

2. Subir o banco PostgreSQL com Docker:

```bash
docker compose up -d postgres
```

3. Aplicar migrações no banco:

```bash
npx prisma migrate deploy
```

4. Subir a API:

```bash
yarn start
```

## install

`yarn prisma generate`

## Erros encontrados no caminho

- `P1001`: não conseguia conectar no banco (`stageflow-postgres:5432`), porque o banco não estava acessível do contexto atual.
- `The table public.users does not exist`: banco subiu, mas faltava aplicar migrações.

## Checklist rápido para nova máquina

1. `yarn install`
2. `docker compose up -d postgres`
3. `yarn prisma generate`
4. `npx prisma migrate deploy`
5. `yarn start`

## Observações

- Se a API roda fora do Docker, normalmente a URL local usa `localhost` (porta mapeada).
- Se API e banco rodam no mesmo `docker compose`, pode usar o nome do serviço como host (ex.: `stageflow-postgres`).
