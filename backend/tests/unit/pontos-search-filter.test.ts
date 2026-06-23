import { describe, it, expect, beforeEach } from 'vitest'
import * as service from '../../src/services/pontos.service.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('buscarPontos', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar pontos que correspondem ao nome pesquisado', () => {
    const result = service.buscarPontos('APAE')
    expect(result.length).toBe(1)
    expect(result[0].nome).toContain('APAE')
  })

  it('deve retornar pontos que correspondem ao bairro pesquisado', () => {
    const result = service.buscarPontos('Centro')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.some((p) => p.bairro === 'Centro')).toBe(true)
  })

  it('deve retornar pontos que correspondem ao tipo de doacao pesquisado', () => {
    const result = service.buscarPontos('brinquedos')
    expect(result.length).toBeGreaterThanOrEqual(1)
    for (const ponto of result) {
      expect(ponto.tiposDoacao).toContain('brinquedos')
    }
  })

  it('deve filtrar por tipo de doacao', () => {
    const result = service.buscarPontos('', 'alimentos')
    expect(result.length).toBeGreaterThan(0)
    for (const ponto of result) {
      expect(ponto.tiposDoacao).toContain('alimentos')
    }
  })

  it('deve combinar busca por texto e filtro por tipo', () => {
    const result = service.buscarPontos('', 'roupas')
    expect(result.length).toBeGreaterThanOrEqual(2)
    for (const ponto of result) {
      expect(ponto.tiposDoacao).toContain('roupas')
    }
  })

  it('deve retornar lista vazia quando nenhum ponto corresponde', () => {
    const result = service.buscarPontos('bairro inexistente')
    expect(result).toHaveLength(0)
  })

  it('deve ignorar pontos inativos por padrao na busca', () => {
    const result = service.buscarPontos('Ponto Inativo de Exemplo')
    expect(result).toHaveLength(0)
  })

  it('deve incluir inativos quando solicitado', () => {
    const result = service.buscarPontos('Ponto Inativo de Exemplo', undefined, true)
    expect(result.length).toBe(1)
    expect(result[0].status).toBe('inativo')
  })

  it('busca deve ser case insensitive', () => {
    const result = service.buscarPontos('apae')
    expect(result.length).toBe(1)
    expect(result[0].nome.toLowerCase()).toContain('apae')
  })

  it('deve buscar por partes do nome', () => {
    const result = service.buscarPontos('Acal')
    expect(result.length).toBe(1)
    expect(result[0].nome).toContain('Acal')
  })
})
