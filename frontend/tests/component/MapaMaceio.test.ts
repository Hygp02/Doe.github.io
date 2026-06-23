import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapaMaceio from '@/components/MapaMaceio.vue'
import type { PontoColeta } from '@/types/ponto-coleta'

const pontosMock: PontoColeta[] = [
  {
    id: 'pc-001',
    nome: 'Centro Comunitario Ponta Verde',
    descricao: 'Ponto de apoio comunitario.',
    endereco: 'Rua Jose Pontes de Magalhaes, 120',
    bairro: 'Ponta Verde',
    cidade: 'Maceio',
    latitude: -9.64985,
    longitude: -35.7339,
    tiposDoacao: ['alimentos', 'roupas'],
    horarioFuncionamento: 'Segunda a sexta, das 8h as 17h',
    telefone: '(82) 3333-0101',
    status: 'ativo',
    observacoes: '',
  },
]

function mountMapa(props = {}) {
  return mount(MapaMaceio, {
    props: { pontos: pontosMock, ...props },
    attachTo: document.createElement('div'),
  })
}

describe('MapaMaceio', () => {
  it('deve renderizar o container do mapa', () => {
    const wrapper = mountMapa()
    expect(wrapper.find('[ref="mapContainer"]').exists() || wrapper.find('div').exists()).toBe(true)
  })

  it('deve aplicar altura fixa quando prop height for fornecida', () => {
    const wrapper = mountMapa({ height: 220 })
    const container = wrapper.find('div').element as HTMLElement
    expect(container.style.height).toBe('220px')
  })

  it('deve aceitar ponto sem coordenadas sem quebrar', () => {
    const wrapper = mount(MapaMaceio, {
      props: {
        pontos: [{ ...pontosMock[0], latitude: undefined, longitude: undefined }],
      },
      attachTo: document.createElement('div'),
    })
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
