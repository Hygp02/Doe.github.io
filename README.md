# Mapa Solidário Maceió

Protótipo web para visualização e gerenciamento simulado de pontos de coleta de doações em Maceió.

## Escopo

- Frontend em Vue.js 3 + TypeScript com Vite.
- UI baseada em shadcn-vue + Tailwind CSS.
- Backend em Node.js + TypeScript com Express.
- Dados mockados em memória, sem banco de dados real.
- Área administrativa simulada, sem autenticação real.

## Estrutura

```text
backend/
├── src/
│   ├── controllers/
│   ├── mocks/
│   ├── routes/
│   ├── services/
│   └── types/
└── tests/
    ├── contract/
    └── unit/

frontend/
├── src/
│   ├── components/
│   │   └── ui/          (shadcn-vue)
│   ├── mocks/
│   ├── pages/
│   ├── router/
│   ├── services/
│   └── types/
└── tests/
    └── component/

specs/001-mapa-solidario-maceio/
```

## Pré-requisitos

- Node.js >= 20.19.0
- npm (gerenciador de pacotes)

## Instalação

```bash
npm install
```

## Execução

Iniciar backend e frontend em paralelo:

```bash
npm run dev
```

Ou separadamente:

```bash
npm run dev:backend   # API em http://localhost:3000
npm run dev:frontend  # UI em http://localhost:5173
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia backend e frontend em paralelo |
| `npm run dev:backend` | Inicia apenas o backend |
| `npm run dev:frontend` | Inicia apenas o frontend |
| `npm run build` | Compila backend e frontend |
| `npm run lint` | Executa lint nos dois projetos |
| `npm run format` | Formata com Prettier |
| `npm run test` | Executa testes (raiz) |

### Testes

Backend (51 testes em 7 suites):

```bash
npm run test --workspace @mapa-solidario/backend
```

Frontend (21 testes em 4 suites):

```bash
npm run test --workspace @mapa-solidario/frontend
```

**Total: 72 testes, todos passando.**

| Suite | Tipo | Testes |
|-------|------|--------|
| `pontos-list.test.ts` | Unitário backend | 6 |
| `pontos-search-filter.test.ts` | Unitário backend | 10 |
| `pontos-admin.test.ts` | Unitário backend | 10 |
| `get-pontos.test.ts` | Contrato backend | 5 |
| `get-pontos-query.test.ts` | Contrato backend | 7 |
| `get-ponto-by-id.test.ts` | Contrato backend | 5 |
| `pontos-admin.test.ts` | Contrato backend | 8 |
| `PontoCard.test.ts` | Componente frontend | 5 |
| `PontoFilters.test.ts` | Componente frontend | 7 |
| `PontoDetailsView.test.ts` | Componente frontend | 2 |
| `PontoForm.test.ts` | Componente frontend | 7 |

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/pontos` | Lista pontos ativos. `?incluirInativos=true` para admin. `?busca=` e `?tipo=` para filtro. |
| `GET` | `/pontos/:id` | Detalhes de um ponto |
| `POST` | `/pontos` | Cria ponto (body JSON conforme `PontoColetaInput`) |
| `PUT` | `/pontos/:id` | Atualiza ponto |
| `DELETE` | `/pontos/:id` | Remove ponto |
| `GET` | `/resumo` | Resumo do sistema (total ativos, tipos) |
| `GET` | `/health` | Status da API |

## Rotas do Frontend

| Rota | Descrição |
|------|-----------|
| `/` | Home com resumo e destaques |
| `/pontos` | Listagem pública com busca e filtros |
| `/pontos/:id` | Detalhes do ponto de coleta |
| `/admin` | Administração (tabela com CRUD) |
| `/admin/novo` | Formulário de cadastro |
| `/admin/editar/:id` | Formulário de edição |

## Limitações do Protótipo

- **Dados mockados**: Os dados são carregados em memória ao iniciar o servidor backend. Alterações feitas via área administrativa são perdidas ao reiniciar o servidor.
- **Sem autenticação**: A área administrativa é acessível sem login.
- **Sem banco de dados**: Não há persistência em disco ou banco de dados.
- **Sem mapa**: O protótipo não inclui integração com mapa real ou geolocalização.
- **Sem integrações externas**: Não há envio de emails, notificações ou validação externa.
- **Escopo Maceió**: A cidade padrão é fixa como "Maceio".
- **Dados fictícios**: Os pontos de coleta são exemplos fictícios para demonstração.

## Validação Rápida

Consulte o guia de validação em `specs/001-mapa-solidario-maceio/quickstart.md`.
