<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buscarPorId, criar, atualizar } from '@/services/pontos.service'
import type { PontoColeta, PontoColetaInput } from '@/types/ponto-coleta'
import PontoForm from '@/components/PontoForm.vue'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEditing.value ? 'Editar ponto de coleta' : 'Novo ponto de coleta'))

const ponto = ref<PontoColeta | null>(null)
const pageLoading = ref(false)
const formLoading = ref(false)
const error = ref<string | null>(null)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

onMounted(async () => {
  if (isEditing.value) {
    pageLoading.value = true
    try {
      ponto.value = await buscarPorId(route.params.id as string)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar ponto.'
    } finally {
      pageLoading.value = false
    }
  }
})

async function handleSubmit(data: PontoColetaInput) {
  formLoading.value = true
  feedback.value = null
  try {
    if (isEditing.value) {
      await atualizar(route.params.id as string, data)
      feedback.value = { type: 'success', message: 'Ponto atualizado com sucesso.' }
    } else {
      await criar(data)
      feedback.value = { type: 'success', message: 'Ponto criado com sucesso.' }
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    }
  } catch (e) {
    feedback.value = {
      type: 'error',
      message: e instanceof Error ? e.message : 'Erro ao salvar ponto.',
    }
  } finally {
    formLoading.value = false
  }
}

function voltar() {
  router.push('/admin')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        class="inline-flex items-center text-sm text-primary hover:underline"
        @click="voltar"
      >
        &larr; Voltar
      </button>
      <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
    </div>

    <section v-if="pageLoading" class="text-center py-8">
      <p class="text-muted-foreground">Carregando...</p>
    </section>

    <section v-else-if="error" class="text-center py-8">
      <p class="text-destructive">{{ error }}</p>
    </section>

    <section v-else>
      <div
        v-if="feedback"
        class="rounded-md p-3 text-sm mb-4"
        :class="feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-destructive/10 text-destructive border border-destructive/20'"
      >
        {{ feedback.message }}
      </div>

      <PontoForm
        :initial-data="ponto ?? undefined"
        :loading="formLoading"
        @submit="handleSubmit"
      />
    </section>
  </div>
</template>
