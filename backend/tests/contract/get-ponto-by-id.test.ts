import { describe, it, expect, beforeEach } from 'vitest'
import { listPontos, getPontoById } from '../../src/controllers/pontos.controller.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('GET /pontos/{id} (contrato)', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar status 200 e o ponto quando encontrado', () => {
    const result = getPontoById('pc-001')
    expect(result.status).toBe(200)
    expect(result.body).toHaveProperty('id', 'pc-001')
  })

  it('deve retornar nome, endereco e bairro do ponto', () => {
    const result = getPontoById('pc-001')
    const ponto = result.body as Record<string, unknown>
    expect(ponto.nome).toBe('Centro Comunitario Ponta Verde')
    expect(ponto.endereco).toBe('Rua Jose Pontes de Magalhaes, 120')
    expect(ponto.bairro).toBe('Ponta Verde')
  })

  it('deve retornar status 404 para id inexistente', () => {
    const result = getPontoById('pc-999')
    expect(result.status).toBe(404)
    const body = result.body as { message: string }
    expect(body.message).toContain('nao encontrado')
  })

  it('deve retornar todos os campos esperados do ponto', () => {
    const result = getPontoById('pc-002')
    const ponto = result.body as Record<string, unknown>
    expect(ponto).toHaveProperty('id')
    expect(ponto).toHaveProperty('nome')
    expect(ponto).toHaveProperty('descricao')
    expect(ponto).toHaveProperty('endereco')
    expect(ponto).toHaveProperty('bairro')
    expect(ponto).toHaveProperty('cidade')
    expect(ponto).toHaveProperty('tiposDoacao')
    expect(ponto).toHaveProperty('horarioFuncionamento')
    expect(ponto).toHaveProperty('telefone')
    expect(ponto).toHaveProperty('status')
    expect(ponto).toHaveProperty('observacoes')
  })

  it('deve retornar ponto inativo quando acessado diretamente por id', () => {
    const result = getPontoById('pc-004')
    expect(result.status).toBe(200)
    const ponto = result.body as { status: string }
    expect(ponto.status).toBe('inativo')
  })
})
