import * as repository from './pontos.repository.js'
import type { PontoColeta, PontoColetaInput, ResumoSistema, TipoDoacao } from '../types/ponto-coleta.js'

export function listarAtivos(): PontoColeta[] {
  return repository.findAll(false)
}

export function buscarPontos(query: string, tipo?: string, includeInativos = false): PontoColeta[] {
  return repository.search(query, tipo, includeInativos)
}

export function buscarPorId(id: string): PontoColeta | undefined {
  return repository.findById(id)
}

export function listarTodos(): PontoColeta[] {
  return repository.findAll(true)
}

function validar(input: PontoColetaInput): string | null {
  if (!input.nome || !input.nome.trim()) return 'Nome e obrigatorio.'
  if (!input.endereco || !input.endereco.trim()) return 'Endereco e obrigatorio.'
  if (!input.bairro || !input.bairro.trim()) return 'Bairro e obrigatorio.'
  if (!input.tiposDoacao || input.tiposDoacao.length === 0) return 'Ao menos um tipo de doacao e obrigatorio.'
  return null
}

export function criarPonto(input: PontoColetaInput): PontoColeta | { error: string } {
  const error = validar(input)
  if (error) return { error }
  return repository.create(input)
}

export function atualizarPonto(id: string, input: PontoColetaInput): PontoColeta | { error: string } | undefined {
  const error = validar(input)
  if (error) return { error }
  return repository.update(id, input)
}

export function removerPonto(id: string): boolean {
  return repository.remove(id)
}

export function getResumo(): ResumoSistema {
  const ativos = repository.findAll(false)
  const tiposSet = new Set<string>()
  for (const ponto of ativos) {
    for (const tipo of ponto.tiposDoacao) {
      tiposSet.add(tipo)
    }
  }
  return {
    totalPontosAtivos: ativos.length,
    totalTiposDoacao: tiposSet.size,
    tiposDisponiveis: [...tiposSet] as TipoDoacao[],
  }
}

export { repository }
