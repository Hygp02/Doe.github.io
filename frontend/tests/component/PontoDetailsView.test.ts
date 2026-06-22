import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PontoDetailsView from '@/pages/PontoDetailsView.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/pontos/:id', component: {} },
    { path: '/pontos', component: {} },
  ],
})

async function mountDetails() {
  await router.push('/pontos/pc-001')
  return mount(PontoDetailsView, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: true,
      },
    },
  })
}

describe('PontoDetailsView', () => {
  it('deve renderizar a pagina de detalhes', async () => {
    const wrapper = await mountDetails()
    expect(wrapper.html()).toBeTruthy()
  })

  it('deve exibir link de voltar', async () => {
    const wrapper = await mountDetails()
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
