<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { buscar } from '@/services/pontos.service'
import type { PontoColeta } from '@/types/ponto-coleta'
import PontoCard from '@/components/PontoCard.vue'
import PontoFilters from '@/components/PontoFilters.vue'

const pontos = ref<PontoColeta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const busca = ref('')
const tipo = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function carregarPontos() {
  loading.value = true
  error.value = null
  try {
    pontos.value = await buscar({ busca: busca.value || undefined, tipo: tipo.value || undefined })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar pontos de coleta.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarPontos()
})

watch([busca, tipo], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    carregarPontos()
  }, 300)
})

function handleLimpar() {
  carregarPontos()
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Pontos de Coleta</h1>
      <p class="text-muted-foreground">
        Confira os locais disponíveis para realizar doações em Maceió.
      </p>
    </div>

    <PontoFilters v-model:busca="busca" v-model:tipo="tipo" @limpar="handleLimpar" />

    <section v-if="loading" class="text-center py-8">
      <p class="text-muted-foreground">Carregando pontos de coleta...</p>
    </section>

    <section v-else-if="error" class="text-center py-8">
      <p class="text-destructive">{{ error }}</p>
    </section>

    <section v-else-if="pontos.length === 0" class="text-center py-12">
      <p class="text-lg text-muted-foreground">Nenhum ponto de coleta encontrado.</p>
      <p class="text-sm text-muted-foreground mt-1">
        Tente ajustar os termos de busca ou limpar os filtros.
      </p>
    </section>

    <section v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <PontoCard v-for="ponto in pontos" :key="ponto.id" :ponto="ponto" />
    </section>
  </div>
</template>
