import { describe, it, expect, beforeEach } from 'vitest'
import { listPontos, getResumo } from '../../src/controllers/pontos.controller.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('GET /pontos (contrato)', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar status 200 e lista de pontos ativos', () => {
    const result = listPontos({})
    expect(result.status).toBe(200)
    expect(Array.isArray(result.body)).toBe(true)
    for (const ponto of result.body as never[]) {
      expect(ponto.status).toBe('ativo')
    }
  })

  it('deve retornar apenas pontos ativos por padrao', () => {
    const result = listPontos({})
    const pontos = result.body as Array<{ status: string }>
    expect(pontos.length).toBe(10)
    expect(pontos.every((p) => p.status === 'ativo')).toBe(true)
  })

  it('deve retornar pontos inativos quando incluirInativos=true', () => {
    const result = listPontos({ incluirInativos: 'true' })
    const pontos = result.body as Array<{ status: string }>
    expect(pontos.length).toBe(11)
    expect(pontos.some((p) => p.status === 'inativo')).toBe(true)
  })

  it('cada ponto deve conter os campos obrigatorios', () => {
    const result = listPontos({})
    const ponto = (result.body as Array<Record<string, unknown>>)[0]
    expect(ponto).toHaveProperty('id')
    expect(ponto).toHaveProperty('nome')
    expect(ponto).toHaveProperty('endereco')
    expect(ponto).toHaveProperty('bairro')
    expect(ponto).toHaveProperty('cidade')
    expect(ponto).toHaveProperty('tiposDoacao')
    expect(ponto).toHaveProperty('status')
    expect(ponto.cidade).toBe('Maceio')
  })

  it('GET /resumo deve retornar dados do sistema', () => {
    const resumo = getResumo()
    expect(resumo).toHaveProperty('totalPontosAtivos')
    expect(resumo).toHaveProperty('totalTiposDoacao')
    expect(resumo).toHaveProperty('tiposDisponiveis')
    expect(resumo.totalPontosAtivos).toBe(10)
  })
})
