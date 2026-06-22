# Mapa Solidário Maceió

Protótipo web para visualização e gerenciamento simulado de pontos de coleta de doações em Maceió.

## Escopo

- Frontend em Vue.js + TypeScript.
- UI baseada em shadcn-vue.
- Backend em Node.js + TypeScript.
- Dados mockados, sem banco de dados real.
- Área administrativa simulada, sem autenticação real.

## Estrutura inicial

```text
backend/
frontend/
specs/001-mapa-solidario-maceio/
```

## Execução prevista

Instale as dependências:

```bash
npm install
```

Execute backend e frontend em modo desenvolvimento:

```bash
npm run dev
```

Ou execute separadamente:

```bash
npm run dev:backend
npm run dev:frontend
```

## Scripts

- `npm run dev`: inicia backend e frontend em paralelo.
- `npm run build`: compila backend e frontend.
- `npm run lint`: executa lint nos dois projetos.
- `npm run format`: formata os arquivos com Prettier.

## Observações do protótipo

Este projeto é um MVP acadêmico. Os dados serão mockados ou mantidos temporariamente em memória, podendo ser reiniciados ao recarregar a aplicação ou reiniciar o servidor.
