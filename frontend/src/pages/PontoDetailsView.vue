<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buscarPorId } from '@/services/pontos.service'
import type { PontoColeta } from '@/types/ponto-coleta'

const route = useRoute()
const router = useRouter()

const ponto = ref<PontoColeta | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const notFound = ref(false)

onMounted(async () => {
  try {
    ponto.value = await buscarPorId(route.params.id as string)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao carregar detalhes.'
    if (msg.includes('nao encontrado')) {
      notFound.value = true
    } else {
      error.value = msg
    }
  } finally {
    loading.value = false
  }
})

function voltar() {
  router.push('/pontos')
}
</script>

<template>
  <div class="space-y-6">
    <button
      class="inline-flex items-center text-sm text-primary hover:underline"
      @click="voltar"
    >
      &larr; Voltar para listagem
    </button>

    <section v-if="loading" class="text-center py-8">
      <p class="text-muted-foreground">Carregando detalhes...</p>
    </section>

    <section v-else-if="notFound" class="text-center py-12 space-y-4">
      <p class="text-lg text-muted-foreground">Ponto de coleta nao encontrado.</p>
      <p class="text-sm text-muted-foreground">O ponto solicitado nao existe ou foi removido.</p>
      <button
        class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="voltar"
      >
        Voltar para listagem
      </button>
    </section>

    <section v-else-if="error" class="text-center py-8">
      <p class="text-destructive">{{ error }}</p>
    </section>

    <section v-else-if="ponto" class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold">{{ ponto.nome }}</h1>
        <span
          class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium mt-1"
          :class="ponto.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'"
        >
          {{ ponto.status === 'ativo' ? 'Ativo' : 'Inativo' }}
        </span>
      </div>

      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="p-6 space-y-4">
          <div v-if="ponto.descricao">
            <h3 class="text-sm font-medium text-muted-foreground">Descricao</h3>
            <p>{{ ponto.descricao }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">Endereco</h3>
              <p>{{ ponto.endereco }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">Bairro</h3>
              <p>{{ ponto.bairro }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">Cidade</h3>
              <p>{{ ponto.cidade }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">Telefone</h3>
              <p>{{ ponto.telefone || 'Nao informado' }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-muted-foreground">Tipos de doacao aceitos</h3>
            <div class="flex flex-wrap gap-1.5 mt-1">
              <span
                v-for="tipo in ponto.tiposDoacao"
                :key="tipo"
                class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground"
              >
                {{ tipo }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-muted-foreground">Horario de funcionamento</h3>
            <p>{{ ponto.horarioFuncionamento || 'Nao informado' }}</p>
          </div>

          <div v-if="ponto.observacoes">
            <h3 class="text-sm font-medium text-muted-foreground">Observacoes</h3>
            <p>{{ ponto.observacoes }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
