# Mapa Solidário Maceió

Aplicação web para encontrar pontos de coleta de doações em Maceió. O projeto
exibe ONGs e instituições sociais em um mapa, permite filtrar por tipo de
doação e inclui uma área administrativa simulada para demonstrar cadastro,
edição e remoção de pontos.

## Funcionalidades

- Listagem pública de pontos de coleta ativos.
- Busca por nome, bairro ou tipo de doação.
- Filtros por categoria: alimentos, roupas, higiene, brinquedos, livros e móveis.
- Filtros sincronizados com a URL para permitir compartilhamento da busca.
- Página de detalhes de cada ponto com endereço, telefone, horários e observações.
- Ações rápidas para copiar endereço, ligar e abrir o endereço no mapa externo.
- Mapa interativo de Maceió com Leaflet e OpenStreetMap.
- Home com resumo dos pontos ativos e tipos de doação disponíveis.
- Área administrativa simulada para listar, criar, editar e remover pontos.
- Estados visuais de carregamento, erro, vazio e feedback de ações.
- Layout responsivo para desktop e mobile.
- Página 404 para rotas inexistentes.

## Dados

Os pontos exibidos são mockados no próprio frontend. As alterações feitas na
área administrativa ficam apenas em memória e são perdidas ao recarregar a
página.

Os dados iniciais usam ONGs reais de Maceió/AL como referência, obtidas a
partir do cadastro público do site
[ongsbrasil.com.br](https://www.ongsbrasil.com.br/default.asp?Pag=1&Destino=Instituicoes&Estado=AL&Cidade=Maceio).
As coordenadas foram associadas aos endereços para exibição no mapa.

Recomenda-se confirmar diretamente com a instituição o endereço, telefone e as
necessidades atuais antes de realizar qualquer doação.

## Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Tailwind CSS
- shadcn-vue
- Leaflet
- Vitest

## Estrutura

```text
frontend/
├── src/
│   ├── components/   # componentes de UI e componentes do domínio
│   ├── composables/  # lógica reutilizável de estado e filtros
│   ├── constants/    # tipos e constantes da aplicação
│   ├── lib/          # helpers utilitários
│   ├── mocks/        # dados mockados dos pontos de coleta
│   ├── pages/        # telas da aplicação
│   ├── router/       # rotas do Vue Router
│   ├── services/     # operações em memória sobre os mocks
│   └── types/        # tipos TypeScript
└── tests/
    ├── component/
    └── unit/
```

## Pré-requisitos

- Node.js >= 24.0.0
- npm

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev:frontend
```

A aplicação fica disponível em:

```text
http://localhost:5173
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev:frontend` | Inicia o frontend em modo desenvolvimento |
| `npm run build --workspace @mapa-solidario/frontend` | Gera o build de produção do frontend |
| `npm run test --workspace @mapa-solidario/frontend` | Executa os testes do frontend |
| `npm run lint --workspace @mapa-solidario/frontend` | Executa lint no frontend |
| `npm run format` | Formata o projeto com Prettier |

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home com resumo e destaques |
| `/pontos` | Listagem pública com busca e filtros |
| `/pontos/:id` | Detalhes do ponto de coleta |
| `/admin` | Administração simulada dos pontos |
| `/admin/novo` | Cadastro simulado de ponto |
| `/admin/editar/:id` | Edição simulada de ponto |
| `/*` | Página 404 |

## Limitações

- Não há backend em produção.
- Não há banco de dados.
- Não há autenticação na área administrativa.
- Cadastros, edições e remoções não persistem após recarregar a página.
- Não há envio de emails, notificações ou integrações externas.
- O escopo geográfico é fixo em Maceió.

## Deploy na Vercel

O deploy publica apenas o frontend estático. Configure o projeto na Vercel com:

```text
Root Directory: .
Build Command: npm run build --workspace @mapa-solidario/frontend
Output Directory: frontend/dist
```

O arquivo `frontend/index.html` é a entrada do Vite. Em produção, a Vercel
serve o resultado gerado em `frontend/dist`.
