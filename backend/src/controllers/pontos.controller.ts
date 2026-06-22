import type { PontoColeta, PontoColetaInput, ErrorResponse, ResumoSistema } from '../types/ponto-coleta.js'
import * as repository from '../services/pontos.repository.js'

export function ok<T>(data: T) {
  return { status: 200, body: data }
}

export function created<T>(data: T) {
  return { status: 201, body: data }
}

export function noContent() {
  return { status: 204, body: null }
}

export function badRequest(message: string) {
  const body: ErrorResponse = { message }
  return { status: 400, body }
}

export function notFound(message: string) {
  const body: ErrorResponse = { message }
  return { status: 404, body }
}

function validateInput(input: PontoColetaInput): string | null {
  if (!input.nome || !input.nome.trim()) return 'Nome e obrigatorio.'
  if (!input.endereco || !input.endereco.trim()) return 'Endereco e obrigatorio.'
  if (!input.bairro || !input.bairro.trim()) return 'Bairro e obrigatorio.'
  if (!input.tiposDoacao || input.tiposDoacao.length === 0) return 'Ao menos um tipo de doacao e obrigatorio.'
  return null
}

export function listPontos(query: { busca?: string; tipo?: string; incluirInativos?: string }) {
  const includeInativos = query.incluirInativos === 'true'
  const busca = query.busca
  const tipo = query.tipo

  if (busca || tipo) {
    return ok(repository.search(busca ?? '', tipo, includeInativos))
  }

  return ok(repository.findAll(includeInativos))
}

export function getPontoById(id: string) {
  const ponto = repository.findById(id)
  if (!ponto) return notFound('Ponto de coleta nao encontrado.')
  return ok(ponto)
}

export function createPonto(input: PontoColetaInput) {
  const error = validateInput(input)
  if (error) return badRequest(error)

  const ponto = repository.create(input)
  return created(ponto)
}

export function updatePonto(id: string, input: PontoColetaInput) {
  const error = validateInput(input)
  if (error) return badRequest(error)

  const ponto = repository.update(id, input)
  if (!ponto) return notFound('Ponto de coleta nao encontrado.')
  return ok(ponto)
}

export function deletePonto(id: string) {
  const removed = repository.remove(id)
  if (!removed) return notFound('Ponto de coleta nao encontrado.')
  return noContent()
}

export function getResumo(): ResumoSistema {
  const ativos = repository.findAll(false) as PontoColeta[]
  const tiposSet = new Set<string>()
  for (const ponto of ativos) {
    for (const tipo of ponto.tiposDoacao) {
      tiposSet.add(tipo)
    }
  }
  return {
    totalPontosAtivos: ativos.length,
    totalTiposDoacao: tiposSet.size,
    tiposDisponiveis: [...tiposSet] as ResumoSistema['tiposDisponiveis'],
  }
}
