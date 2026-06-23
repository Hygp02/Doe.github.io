import { describe, it, expect, beforeEach } from 'vitest'
import { listPontos } from '../../src/controllers/pontos.controller.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('GET /pontos?busca=&tipo= (contrato)', () => {
  beforeEach(() => {
    seed()
  })

  it('deve filtrar por bairro via query param busca', () => {
    const result = listPontos({ busca: 'Cambona' })
    expect(result.status).toBe(200)
    const pontos = result.body as Array<{ bairro: string }>
    expect(pontos.length).toBe(1)
    expect(pontos[0].bairro).toBe('Cambona')
  })

  it('deve filtrar por nome via query param busca', () => {
    const result = listPontos({ busca: 'APAE' })
    expect(result.status).toBe(200)
    const pontos = result.body as Array<{ nome: string }>
    expect(pontos.length).toBe(1)
    expect(pontos[0].nome).toContain('APAE')
  })

  it('deve filtrar por tipo de doacao via query param tipo', () => {
    const result = listPontos({ tipo: 'alimentos' })
    expect(result.status).toBe(200)
    const pontos = result.body as Array<{ tiposDoacao: string[] }>
    expect(pontos.length).toBeGreaterThan(0)
    for (const p of pontos) {
      expect(p.tiposDoacao).toContain('alimentos')
    }
  })

  it('deve combinar busca e tipo', () => {
    const result = listPontos({ busca: 'Tabuleiro', tipo: 'roupas' })
    expect(result.status).toBe(200)
    const pontos = result.body as Array<{ bairro: string; tiposDoacao: string[] }>
    expect(pontos.length).toBeGreaterThanOrEqual(1)
    expect(pontos[0].bairro).toContain('Tabuleiro')
    expect(pontos[0].tiposDoacao).toContain('roupas')
  })

  it('deve retornar lista vazia para busca sem resultados', () => {
    const result = listPontos({ busca: 'xyz nao existe' })
    expect(result.status).toBe(200)
    const pontos = result.body as Array<unknown>
    expect(pontos).toHaveLength(0)
  })

  it('deve retornar lista vazia para tipo sem resultados quando nao houver inativos', () => {
    const result = listPontos({ tipo: 'moveis', incluirInativos: 'false' })
    expect(result.status).toBe(200)
    const pontos = result.body as Array<unknown>
    expect(pontos.length).toBe(0)
  })

  it('busca vazia sem tipo deve retornar todos os ativos', () => {
    const result = listPontos({})
    expect(result.status).toBe(200)
    const pontos = result.body as Array<unknown>
    expect(pontos.length).toBe(10)
  })
})
