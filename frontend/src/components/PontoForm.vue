<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PontoColetaInput, StatusPontoColeta, TipoDoacao } from '@/types/ponto-coleta'

const TIPOS_DOACAO: TipoDoacao[] = [
  'alimentos',
  'roupas',
  'higiene',
  'brinquedos',
  'livros',
  'moveis',
]

const props = defineProps<{
  initialData?: Partial<PontoColetaInput>
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: PontoColetaInput]
}>()

const nome = ref(props.initialData?.nome ?? '')
const descricao = ref(props.initialData?.descricao ?? '')
const endereco = ref(props.initialData?.endereco ?? '')
const bairro = ref(props.initialData?.bairro ?? '')
const tiposDoacao = ref<TipoDoacao[]>(props.initialData?.tiposDoacao ?? [])
const horarioFuncionamento = ref(props.initialData?.horarioFuncionamento ?? '')
const telefone = ref(props.initialData?.telefone ?? '')
const status = ref<StatusPontoColeta>(props.initialData?.status ?? 'ativo')
const observacoes = ref(props.initialData?.observacoes ?? '')

const errors = ref<Record<string, string>>({})

watch(
  () => props.initialData,
  (data) => {
    if (data) {
      nome.value = data.nome ?? ''
      descricao.value = data.descricao ?? ''
      endereco.value = data.endereco ?? ''
      bairro.value = data.bairro ?? ''
      tiposDoacao.value = data.tiposDoacao ?? []
      horarioFuncionamento.value = data.horarioFuncionamento ?? ''
      telefone.value = data.telefone ?? ''
      status.value = data.status ?? 'ativo'
      observacoes.value = data.observacoes ?? ''
    }
  },
)

function toggleTipo(tipo: TipoDoacao) {
  const index = tiposDoacao.value.indexOf(tipo)
  if (index === -1) {
    tiposDoacao.value.push(tipo)
  } else {
    tiposDoacao.value.splice(index, 1)
  }
}

function validate(): boolean {
  errors.value = {}
  if (!nome.value.trim()) errors.value.nome = 'Nome e obrigatorio.'
  if (!endereco.value.trim()) errors.value.endereco = 'Endereco e obrigatorio.'
  if (!bairro.value.trim()) errors.value.bairro = 'Bairro e obrigatorio.'
  if (tiposDoacao.value.length === 0) errors.value.tiposDoacao = 'Selecione ao menos um tipo de doacao.'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    nome: nome.value.trim(),
    descricao: descricao.value.trim(),
    endereco: endereco.value.trim(),
    bairro: bairro.value.trim(),
    cidade: 'Maceio',
    tiposDoacao: tiposDoacao.value,
    horarioFuncionamento: horarioFuncionamento.value.trim(),
    telefone: telefone.value.trim(),
    status: status.value,
    observacoes: observacoes.value.trim(),
  })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-sm font-medium" for="nome">Nome *</label>
      <input
        id="nome"
        v-model="nome"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="{ 'border-destructive': errors.nome }"
        aria-label="Nome do ponto de coleta"
        aria-required="true"
        :aria-invalid="!!errors.nome"
        :aria-describedby="errors.nome ? 'nome-error' : undefined"
      />
      <p v-if="errors.nome" id="nome-error" role="alert" class="text-sm text-destructive">{{ errors.nome }}</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="descricao">Descricao</label>
      <textarea
        id="descricao"
        v-model="descricao"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Descricao do ponto"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="endereco">Endereco *</label>
      <input
        id="endereco"
        v-model="endereco"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="{ 'border-destructive': errors.endereco }"
        aria-label="Endereco do ponto"
        aria-required="true"
        :aria-invalid="!!errors.endereco"
        :aria-describedby="errors.endereco ? 'endereco-error' : undefined"
      />
      <p v-if="errors.endereco" id="endereco-error" role="alert" class="text-sm text-destructive">{{ errors.endereco }}</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="bairro">Bairro *</label>
      <input
        id="bairro"
        v-model="bairro"
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="{ 'border-destructive': errors.bairro }"
        aria-label="Bairro do ponto"
        aria-required="true"
        :aria-invalid="!!errors.bairro"
        :aria-describedby="errors.bairro ? 'bairro-error' : undefined"
      />
      <p v-if="errors.bairro" id="bairro-error" role="alert" class="text-sm text-destructive">{{ errors.bairro }}</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Tipos de doacao *</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tipo in TIPOS_DOACAO"
          :key="tipo"
          type="button"
          class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors"
          :class="
            tiposDoacao.includes(tipo)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground hover:bg-accent'
          "
          :aria-pressed="tiposDoacao.includes(tipo)"
          @click="toggleTipo(tipo)"
        >
          {{ tipo }}
        </button>
      </div>
      <p v-if="errors.tiposDoacao" id="tiposDoacao-error" role="alert" class="text-sm text-destructive">{{ errors.tiposDoacao }}</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="horario">Horario de funcionamento</label>
      <input
        id="horario"
        v-model="horarioFuncionamento"
        type="text"
        placeholder="Ex: Segunda a sexta, das 8h as 17h"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Horario de funcionamento"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="telefone">Telefone</label>
      <input
        id="telefone"
        v-model="telefone"
        type="text"
        placeholder="Ex: (82) 3333-0000"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Telefone de contato"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="status">Status</label>
      <select
        id="status"
        v-model="status"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Status do ponto"
      >
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium" for="observacoes">Observacoes</label>
      <textarea
        id="observacoes"
        v-model="observacoes"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Observacoes"
      />
    </div>

    <button
      type="submit"
      class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      :disabled="loading"
    >
      {{ loading ? 'Salvando...' : 'Salvar' }}
    </button>
  </form>
</template>
