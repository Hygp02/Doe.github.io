import { describe, it, expect, beforeEach } from 'vitest'
import * as service from '../../src/services/pontos.service.js'
import { seed } from '../../src/services/pontos.repository.js'

describe('Admin - criarPonto', () => {
  beforeEach(() => {
    seed()
  })

  it('deve criar ponto com dados validos', () => {
    const result = service.criarPonto({
      nome: 'Novo Ponto',
      endereco: 'Rua Nova, 10',
      bairro: 'Centro',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect('id' in result).toBe(true)
    if ('id' in result) {
      expect(result.nome).toBe('Novo Ponto')
    }
  })

  it('deve rejeitar criacao sem nome', () => {
    const result = service.criarPonto({
      nome: '',
      endereco: 'Rua Nova, 10',
      bairro: 'Centro',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect('error' in result).toBe(true)
    if ('error' in result) {
      expect(result.error).toContain('Nome')
    }
  })

  it('deve rejeitar criacao sem endereco', () => {
    const result = service.criarPonto({
      nome: 'Novo Ponto',
      endereco: '',
      bairro: 'Centro',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect('error' in result).toBe(true)
  })

  it('deve rejeitar criacao sem bairro', () => {
    const result = service.criarPonto({
      nome: 'Novo Ponto',
      endereco: 'Rua Nova, 10',
      bairro: '',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect('error' in result).toBe(true)
  })

  it('deve rejeitar criacao sem tipo de doacao', () => {
    const result = service.criarPonto({
      nome: 'Novo Ponto',
      endereco: 'Rua Nova, 10',
      bairro: 'Centro',
      cidade: 'Maceio',
      tiposDoacao: [],
      status: 'ativo',
    })
    expect('error' in result).toBe(true)
  })
})

describe('Admin - atualizarPonto', () => {
  beforeEach(() => {
    seed()
  })

  it('deve atualizar ponto existente', () => {
    const result = service.atualizarPonto('pc-001', {
      nome: 'Nome Atualizado',
      endereco: 'Rua Atualizada, 1',
      bairro: 'Novo Bairro',
      cidade: 'Maceio',
      tiposDoacao: ['roupas'],
      status: 'ativo',
    })
    if (result && 'id' in result) {
      expect(result.nome).toBe('Nome Atualizado')
      expect(result.bairro).toBe('Novo Bairro')
    }
  })

  it('deve retornar undefined para id inexistente', () => {
    const result = service.atualizarPonto('pc-999', {
      nome: 'Nome',
      endereco: 'Rua, 1',
      bairro: 'Bairro',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect(result).toBeUndefined()
  })

  it('deve rejeitar atualizacao com dados invalidos', () => {
    const result = service.atualizarPonto('pc-001', {
      nome: '',
      endereco: 'Rua, 1',
      bairro: 'Bairro',
      cidade: 'Maceio',
      tiposDoacao: ['alimentos'],
      status: 'ativo',
    })
    expect(result && 'error' in result).toBe(true)
  })
})

describe('Admin - removerPonto', () => {
  beforeEach(() => {
    seed()
  })

  it('deve remover ponto existente', () => {
    const result = service.removerPonto('pc-001')
    expect(result).toBe(true)
    const encontrado = service.buscarPorId('pc-001')
    expect(encontrado).toBeUndefined()
  })

  it('deve retornar false para id inexistente', () => {
    const result = service.removerPonto('pc-999')
    expect(result).toBe(false)
  })
})
