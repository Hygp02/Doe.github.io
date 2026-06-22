import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PontoForm from '@/components/PontoForm.vue'

function mountForm(initialData = {}) {
  return mount(PontoForm, {
    props: {
      initialData,
    },
  })
}

describe('PontoForm', () => {
  it('deve renderizar campo de nome', () => {
    const wrapper = mountForm()
    const input = wrapper.find('#nome')
    expect(input.exists()).toBe(true)
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('deve renderizar campo de endereco', () => {
    const wrapper = mountForm()
    const input = wrapper.find('#endereco')
    expect(input.exists()).toBe(true)
  })

  it('deve renderizar campo de bairro', () => {
    const wrapper = mountForm()
    const input = wrapper.find('#bairro')
    expect(input.exists()).toBe(true)
  })

  it('deve renderizar botoes de tipo de doacao', () => {
    const wrapper = mountForm()
    const buttons = wrapper.findAll('button[aria-pressed]')
    expect(buttons.length).toBe(6)
  })

  it('deve mostrar erro ao submeter sem campos obrigatorios', async () => {
    const wrapper = mountForm()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Nome e obrigatorio.')
    expect(wrapper.text()).toContain('Endereco e obrigatorio.')
    expect(wrapper.text()).toContain('Bairro e obrigatorio.')
    expect(wrapper.text()).toContain('Selecione ao menos um tipo de doacao.')
  })

  it('deve emitir submit com dados validos', async () => {
    const wrapper = mountForm()
    const nomeInput = wrapper.find('#nome')
    await nomeInput.setValue('Ponto Teste')
    await wrapper.find('#endereco').setValue('Rua A')
    await wrapper.find('#bairro').setValue('Centro')
    const tipoBtn = wrapper.find('button[aria-pressed="false"]')
    await tipoBtn.trigger('click')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submit')).toBeTruthy()
    const submitData = wrapper.emitted('submit')![0][0] as Record<string, unknown>
    expect(submitData.nome).toBe('Ponto Teste')
    expect(submitData.endereco).toBe('Rua A')
    expect(submitData.bairro).toBe('Centro')
    expect(Array.isArray(submitData.tiposDoacao)).toBe(true)
    expect((submitData.tiposDoacao as string[]).length).toBe(1)
  })

  it('deve preencher campos com dados iniciais', () => {
    const wrapper = mountForm({
      nome: 'Ponto X',
      endereco: 'Rua Y',
      bairro: 'Bairro Z',
      tiposDoacao: ['alimentos', 'roupas'],
      status: 'inativo',
    })
    const nomeInput = wrapper.find('#nome').element as HTMLInputElement
    expect(nomeInput.value).toBe('Ponto X')
  })
})
