export type StatusPontoColeta = 'ativo' | 'inativo'

export type TipoDoacao =
  | 'alimentos'
  | 'roupas'
  | 'higiene'
  | 'brinquedos'
  | 'livros'
  | 'moveis'

export interface PontoColeta {
  id: string
  nome: string
  descricao: string
  endereco: string
  bairro: string
  cidade: 'Maceio'
  tiposDoacao: TipoDoacao[]
  horarioFuncionamento: string
  telefone: string
  status: StatusPontoColeta
  observacoes: string
}

export interface PontoColetaInput {
  nome: string
  descricao?: string
  endereco: string
  bairro: string
  cidade: 'Maceio'
  tiposDoacao: TipoDoacao[]
  horarioFuncionamento?: string
  telefone?: string
  status: StatusPontoColeta
  observacoes?: string
}

export interface ErrorResponse {
  message: string
}

export interface ResumoSistema {
  totalPontosAtivos: number
  totalTiposDoacao: number
  tiposDisponiveis: TipoDoacao[]
}
