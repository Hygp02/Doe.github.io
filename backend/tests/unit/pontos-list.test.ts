import { describe, it, expect, beforeEach } from 'vitest'
import * as service from '../../src/services/pontos.service.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('listarAtivos', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar apenas pontos com status ativo', () => {
    const pontos = service.listarAtivos()
    expect(pontos.length).toBeGreaterThan(0)
    for (const ponto of pontos) {
      expect(ponto.status).toBe('ativo')
    }
  })

  it('nao deve retornar pontos com status inativo', () => {
    const pontos = service.listarAtivos()
    const inativos = pontos.filter((p) => p.status === 'inativo')
    expect(inativos.length).toBe(0)
  })

  it('deve retornar uma copia dos dados, nao a referencia original', () => {
    const pontosA = service.listarAtivos()
    const pontosB = service.listarAtivos()
    expect(pontosA).not.toBe(pontosB)
    expect(pontosA).toEqual(pontosB)
  })
})

describe('getResumo', () => {
  beforeEach(() => {
    seed()
  })

  it('deve retornar total de pontos ativos', () => {
    const resumo = service.getResumo()
    expect(resumo.totalPontosAtivos).toBeGreaterThan(0)
    expect(resumo.totalPontosAtivos).toBe(10)
  })

  it('deve retornar tipos de doacao disponiveis', () => {
    const resumo = service.getResumo()
    expect(resumo.tiposDisponiveis.length).toBeGreaterThan(0)
    expect(resumo.totalTiposDoacao).toBe(resumo.tiposDisponiveis.length)
  })

  it('deve incluir apenas tipos dos pontos ativos', () => {
    const resumo = service.getResumo()
    expect(resumo.totalTiposDoacao).toBe(5)
    expect(resumo.tiposDisponiveis).toContain('alimentos')
    expect(resumo.tiposDisponiveis).toContain('roupas')
    expect(resumo.tiposDisponiveis).toContain('higiene')
    expect(resumo.tiposDisponiveis).toContain('brinquedos')
    expect(resumo.tiposDisponiveis).toContain('livros')
  })
})
