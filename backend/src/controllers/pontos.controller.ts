import type { PontoColetaInput, ErrorResponse } from '../types/ponto-coleta.js'
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

export function listPontos(query: { busca?: string; tipo?: string; incluirInativos?: string }) {
  const includeInativos = query.incluirInativos === 'true'
  const busca = query.busca
  const tipo = query.tipo

  if (busca || tipo) {
    return ok(service.buscarPontos(busca ?? '', tipo, includeInativos))
  }

  return ok(includeInativos ? service.listarTodos() : service.listarAtivos())
}

export function getPontoById(id: string) {
  const ponto = service.buscarPorId(id)
  if (!ponto) return notFound('Ponto de coleta nao encontrado.')
  return ok(ponto)
}

export function createPonto(input: PontoColetaInput) {
  const result = service.criarPonto(input)
  if ('error' in result) return badRequest(result.error)
  return created(result)
}

export function updatePonto(id: string, input: PontoColetaInput) {
  const result = service.atualizarPonto(id, input)
  if (!result) return notFound('Ponto de coleta nao encontrado.')
  if ('error' in result) return badRequest(result.error)
  return ok(result)
}

export function deletePonto(id: string) {
  const removed = service.removerPonto(id)
  if (!removed) return notFound('Ponto de coleta nao encontrado.')
  return noContent()
}

export function getResumo() {
  return service.getResumo()
}
