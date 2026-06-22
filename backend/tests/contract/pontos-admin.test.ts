import { describe, it, expect, beforeEach } from 'vitest'
import { createPonto, updatePonto, deletePonto } from '../../src/controllers/pontos.controller.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('POST /pontos (contrato)', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar 201 ao criar ponto valido', () => {
    const result = createPonto({
      nome: 'Teste',
      endereco: 'Rua X',
      bairro: 'Centro',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect(result.status).toBe(201)
    expect(result.body).toHaveProperty('id')
  })

  it('deve retornar 400 quando faltam campos obrigatorios', () => {
    const result = createPonto({
      nome: '',
      endereco: '',
      bairro: '',
      cidade: 'Maceio',
      tiposDoacao: [],
      status: 'ativo',
    })
    expect(result.status).toBe(400)
  })

  it('deve retornar 400 sem tiposDoacao', () => {
    const result = createPonto({
      nome: 'A',
      endereco: 'B',
      bairro: 'C',
      cidade: 'Maceio',
      tiposDoacao: [],
      status: 'ativo',
    })
    expect(result.status).toBe(400)
  })
})

describe('PUT /pontos/{id} (contrato)', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar 200 ao atualizar ponto existente', () => {
    const result = updatePonto('pc-001', {
      nome: 'Atualizado',
      endereco: 'Rua Nova',
      bairro: 'Novo Bairro',
      cidade: 'Maceio',
      tiposDoacao: ['roupas'],
      status: 'inativo',
    })
    expect(result.status).toBe(200)
    const body = result.body as { nome: string }
    expect(body.nome).toBe('Atualizado')
  })

  it('deve retornar 404 para id inexistente', () => {
    const result = updatePonto('pc-999', {
      nome: 'A',
      endereco: 'B',
      bairro: 'C',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect(result.status).toBe(404)
  })

  it('deve retornar 400 para dados invalidos', () => {
    const result = updatePonto('pc-001', {
      nome: '',
      endereco: 'B',
      bairro: 'C',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect(result.status).toBe(400)
  })
})

describe('DELETE /pontos/{id} (contrato)', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar 204 ao remover ponto existente', () => {
    const result = deletePonto('pc-001')
    expect(result.status).toBe(204)
    expect(result.body).toBeNull()
  })

  it('deve retornar 404 para id inexistente', () => {
    const result = deletePonto('pc-999')
    expect(result.status).toBe(404)
  })
})
