<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { listarTodos, remover } from '@/services/pontos.service'
import type { PontoColeta } from '@/types/ponto-coleta'

const router = useRouter()

const pontos = ref<PontoColeta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deleting = ref<string | null>(null)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

async function carregar() {
  loading.value = true
  error.value = null
  try {
    pontos.value = await listarTodos()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar pontos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregar()
})

async function handleDelete(id: string) {
  if (!confirm('Deseja remover este ponto de coleta? Esta acao nao pode ser desfeita.')) return
  deleting.value = id
  feedback.value = null
  try {
    await remover(id)
    pontos.value = pontos.value.filter((p) => p.id !== id)
    feedback.value = { type: 'success', message: 'Ponto removido com sucesso.' }
  } catch (e) {
    feedback.value = {
      type: 'error',
      message: e instanceof Error ? e.message : 'Erro ao remover ponto.',
    }
  } finally {
    deleting.value = null
  }
}

function navigateToCreate() {
  router.push('/admin/novo')
}

function navigateToEdit(id: string) {
  router.push(`/admin/editar/${id}`)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Administracao</h1>
        <p class="text-muted-foreground">Gerencie os pontos de coleta.</p>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="navigateToCreate"
      >
        Novo ponto
      </button>
    </div>

    <div
      class="rounded-lg border bg-accent/50 p-4 text-sm text-muted-foreground"
    >
      <strong>Atencao:</strong> Os dados sao mockados e alteracoes serao perdidas ao reiniciar o servidor.
    </div>

    <div
      v-if="feedback"
      class="rounded-md p-3 text-sm"
      :class="feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-destructive/10 text-destructive border border-destructive/20'"
    >
      {{ feedback.message }}
    </div>

    <section v-if="loading" class="text-center py-8">
      <p class="text-muted-foreground">Carregando...</p>
    </section>

    <section v-else-if="error" class="text-center py-8">
      <p class="text-destructive">{{ error }}</p>
    </section>

    <section v-else class="rounded-lg border">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="px-4 py-3 text-left font-medium">Nome</th>
              <th class="px-4 py-3 text-left font-medium">Bairro</th>
              <th class="px-4 py-3 text-left font-medium">Status</th>
              <th class="px-4 py-3 text-left font-medium">Tipos</th>
              <th class="px-4 py-3 text-right font-medium">Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ponto in pontos"
              :key="ponto.id"
              class="border-b last:border-0 hover:bg-muted/30"
            >
              <td class="px-4 py-3 font-medium">{{ ponto.nome }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ ponto.bairro }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="ponto.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'"
                >
                  {{ ponto.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-muted-foreground">
                {{ ponto.tiposDoacao.join(', ') }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    class="inline-flex items-center justify-center rounded-md border border-input bg-background h-8 px-3 text-xs font-medium hover:bg-accent transition-colors"
                    @click="navigateToEdit(ponto.id)"
                  >
                    Editar
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-md border border-destructive bg-background h-8 px-3 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    :disabled="deleting === ponto.id"
                    @click="handleDelete(ponto.id)"
                  >
                    {{ deleting === ponto.id ? '...' : 'Remover' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="pontos.length === 0" class="p-8 text-center text-muted-foreground">
          Nenhum ponto cadastrado.
        </div>
      </div>
    </section>
  </div>
</template>
