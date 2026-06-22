<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getResumo, listarAtivos } from '@/services/pontos.service'
import type { PontoColeta, ResumoSistema } from '@/types/ponto-coleta'
import PontoCard from '@/components/PontoCard.vue'

const resumo = ref<ResumoSistema | null>(null)
const destaques = ref<PontoColeta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const [resumoData, pontosData] = await Promise.all([getResumo(), listarAtivos()])
    resumo.value = resumoData
    destaques.value = pontosData.slice(0, 3)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar dados.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-10">
    <section class="text-center space-y-4 px-2">
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Mapa Solidário Maceió</h1>
      <p class="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
        Encontre pontos de coleta de doações em Maceió. Descubra onde doar alimentos, roupas, itens
        de higiene, brinquedos, livros e móveis.
      </p>
      <RouterLink
        to="/pontos"
        class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Ver pontos de coleta
      </RouterLink>
    </section>

    <section v-if="loading" class="text-center py-8">
      <p class="text-muted-foreground">Carregando...</p>
    </section>

    <section v-else-if="error" class="text-center py-8">
      <p class="text-destructive">{{ error }}</p>
    </section>

    <template v-else-if="resumo">
      <section class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-primary">{{ resumo.totalPontosAtivos }}</p>
          <p class="text-sm text-muted-foreground">Pontos de coleta ativos</p>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-primary">{{ resumo.totalTiposDoacao }}</p>
          <p class="text-sm text-muted-foreground">Tipos de doação aceitos</p>
        </div>
        <div
          class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-center sm:col-span-2 lg:col-span-1"
        >
          <p class="text-sm text-muted-foreground mb-2">Categorias disponíveis</p>
          <div class="flex flex-wrap justify-center gap-1.5">
            <span
              v-for="tipo in resumo.tiposDisponiveis"
              :key="tipo"
              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground"
            >
              {{ tipo }}
            </span>
          </div>
        </div>
      </section>

      <section v-if="destaques.length" class="space-y-4">
        <h2 class="text-xl font-semibold">Pontos em destaque</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PontoCard v-for="ponto in destaques" :key="ponto.id" :ponto="ponto" />
        </div>
      </section>
    </template>
  </div>
</template>
