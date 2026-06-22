<script setup lang="ts">
import { ref } from 'vue'
import type { TipoDoacao } from '@/types/ponto-coleta'

const TIPOS_DOACAO: { value: string; label: string }[] = [
  { value: '', label: 'Todos os tipos' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'higiene', label: 'Higiene' },
  { value: 'brinquedos', label: 'Brinquedos' },
  { value: 'livros', label: 'Livros' },
  { value: 'moveis', label: 'Móveis' },
]

const busca = defineModel<string>('busca', { default: '' })
const tipo = defineModel<string>('tipo', { default: '' })

const emit = defineEmits<{
  limpar: []
}>()

function handleLimpar() {
  busca.value = ''
  tipo.value = ''
  emit('limpar')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleLimpar()
  }
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3" role="search" aria-label="Filtros de busca">
    <div class="flex-1">
      <input
        v-model="busca"
        type="text"
        placeholder="Buscar por nome, bairro ou tipo de doação..."
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Buscar pontos de coleta"
        @keydown.escape="handleKeydown"
      />
    </div>
    <div class="flex gap-2">
      <select
        v-model="tipo"
        class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Filtrar por tipo de doação"
      >
        <option
          v-for="opcao in TIPOS_DOACAO"
          :key="opcao.value"
          :value="opcao.value"
        >
          {{ opcao.label }}
        </option>
      </select>
      <button
        v-if="busca || tipo"
        class="inline-flex items-center justify-center rounded-md border border-input bg-background h-10 px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Limpar filtros"
        @click="handleLimpar"
      >
        Limpar
      </button>
    </div>
  </div>
</template>
