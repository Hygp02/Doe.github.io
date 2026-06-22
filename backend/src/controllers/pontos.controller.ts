import type { PontoColeta, PontoColetaInput, ErrorResponse } from '../types/ponto-coleta.js'
import * as service from '../services/pontos.service.js'

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
    return ok(service.buscarPontos(busca ?? '', tipo, includeInativos))
  }

  return ok(includeInativos ? service.repository.findAll(true) : service.listarAtivos())
}

export function getPontoById(id: string) {
  const ponto = service.repository.findById(id)
  if (!ponto) return notFound('Ponto de coleta nao encontrado.')
  return ok(ponto)
}

export function createPonto(input: PontoColetaInput) {
  const error = validateInput(input)
  if (error) return badRequest(error)

  const ponto = service.repository.create(input)
  return created(ponto)
}

export function updatePonto(id: string, input: PontoColetaInput) {
  const error = validateInput(input)
  if (error) return badRequest(error)

  const ponto = service.repository.update(id, input)
  if (!ponto) return notFound('Ponto de coleta nao encontrado.')
  return ok(ponto)
}

export function deletePonto(id: string) {
  const removed = service.repository.remove(id)
  if (!removed) return notFound('Ponto de coleta nao encontrado.')
  return noContent()
}

export function getResumo() {
  return service.getResumo()
}
