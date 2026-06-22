import { pontosColetaMock } from '../mocks/pontos.mock.js'
import type { PontoColeta, PontoColetaInput } from '../types/ponto-coleta.js'

let pontos: PontoColeta[] = structuredClone(pontosColetaMock)

export function seed(): void {
  pontos = structuredClone(pontosColetaMock)
}

export function reset(): void {
  seed()
}

export function findAll(includeInativos = false): PontoColeta[] {
  const result = includeInativos ? pontos : pontos.filter((p) => p.status === 'ativo')
  return structuredClone(result)
}

export function findById(id: string): PontoColeta | undefined {
  const ponto = pontos.find((p) => p.id === id)
  return ponto ? structuredClone(ponto) : undefined
}

export function search(query: string, tipo?: string, includeInativos = false): PontoColeta[] {
  let result = includeInativos ? pontos : pontos.filter((p) => p.status === 'ativo')
  const q = query?.toLowerCase().trim() ?? ''

  if (q) {
    result = result.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.bairro.toLowerCase().includes(q) ||
        p.tiposDoacao.some((t) => t.toLowerCase().includes(q)),
    )
  }

  if (tipo) {
    result = result.filter((p) => p.tiposDoacao.includes(tipo as never))
  }

  return structuredClone(result)
}

let nextId = 5

export function create(input: PontoColetaInput): PontoColeta {
  const id = `pc-${String(nextId++).padStart(3, '0')}`
  const ponto: PontoColeta = {
    id,
    nome: input.nome,
    descricao: input.descricao ?? '',
    endereco: input.endereco,
    bairro: input.bairro,
    cidade: 'Maceio',
    tiposDoacao: input.tiposDoacao,
    horarioFuncionamento: input.horarioFuncionamento ?? '',
    telefone: input.telefone ?? '',
    status: input.status,
    observacoes: input.observacoes ?? '',
  }
  pontos.push(ponto)
  return structuredClone(ponto)
}

export function update(id: string, input: PontoColetaInput): PontoColeta | undefined {
  const index = pontos.findIndex((p) => p.id === id)
  if (index === -1) return undefined

  pontos[index] = {
    ...pontos[index],
    nome: input.nome,
    descricao: input.descricao ?? '',
    endereco: input.endereco,
    bairro: input.bairro,
    cidade: 'Maceio',
    tiposDoacao: input.tiposDoacao,
    horarioFuncionamento: input.horarioFuncionamento ?? '',
    telefone: input.telefone ?? '',
    status: input.status,
    observacoes: input.observacoes ?? '',
  }

  return structuredClone(pontos[index])
}

export function remove(id: string): boolean {
  const index = pontos.findIndex((p) => p.id === id)
  if (index === -1) return false
  pontos.splice(index, 1)
  return true
}
