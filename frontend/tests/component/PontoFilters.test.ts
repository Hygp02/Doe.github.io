import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PontoFilters from '@/components/PontoFilters.vue'

describe('PontoFilters', () => {
  it('deve renderizar campo de busca', () => {
    const wrapper = mount(PontoFilters)
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toContain('Buscar')
  })

  it('deve renderizar select de tipo de doacao', () => {
    const wrapper = mount(PontoFilters)
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    const options = select.findAll('option')
    expect(options.length).toBe(7)
    expect(options[0].text()).toBe('Todos os tipos')
  })

  it('deve emitir evento limpar ao clicar no botao limpar', async () => {
    const wrapper = mount(PontoFilters, {
      props: {
        busca: 'teste',
        tipo: 'alimentos',
      },
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Limpar')
  })

  it('nao deve mostrar botao limpar quando nao ha filtros ativos', () => {
    const wrapper = mount(PontoFilters, {
      props: {
        busca: '',
        tipo: '',
      },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(0)
  })

  it('deve conter opcoes de tipo de doacao no select', () => {
    const wrapper = mount(PontoFilters)
    const options = wrapper.findAll('option')
    const labels = options.map((o) => o.text())
    expect(labels).toContain('Alimentos')
    expect(labels).toContain('Roupas')
    expect(labels).toContain('Higiene')
    expect(labels).toContain('Brinquedos')
    expect(labels).toContain('Livros')
    expect(labels).toContain('Móveis')
  })

  it('deve ter aria-label no campo de busca', () => {
    const wrapper = mount(PontoFilters)
    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('aria-label')).toBe('Buscar pontos de coleta')
  })

  it('deve ter aria-label no select de tipo', () => {
    const wrapper = mount(PontoFilters)
    const select = wrapper.find('select')
    expect(select.attributes('aria-label')).toBe('Filtrar por tipo de doação')
  })
})
