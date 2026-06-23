<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Search, Heart, ShieldAlert, PiggyBank, Info } from 'lucide-vue-next'
import { getResumo, listarAtivos } from '@/services/pontos.service'
import type { PontoColeta, ResumoSistema } from '@/types/ponto-coleta'
import PontoCard from '@/components/PontoCard.vue'
import AppLoading from '@/components/AppLoading.vue'
import AppError from '@/components/AppError.vue'
import MapaMaceio from '@/components/MapaMaceio.vue'

const router = useRouter()

const resumo = ref<ResumoSistema | null>(null)
const destaques = ref<PontoColeta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

function verDetalhes(id: string) {
  router.push(`/pontos/${id}`)
}

async function carregar() {
  loading.value = true
  error.value = null
  try {
    const [resumoData, pontosData] = await Promise.all([getResumo(), listarAtivos()])
    resumo.value = resumoData
    destaques.value = pontosData.slice(0, 3)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar dados.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregar()
})
</script>

<template>
  <div class="space-y-12 sm:space-y-16">
    <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground px-6 py-12 sm:py-16 text-center shadow-lg">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div class="relative z-10 max-w-3xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur">
          <MapPin
            class="h-4 w-4"
            aria-hidden="true"
          />
          Maceió, Alagoas
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance">
          Encontre onde doar em Maceió
        </h1>
        <p class="text-base sm:text-lg text-primary-foreground/90 max-w-2xl mx-auto text-balance">
          Descubra pontos de coleta de doações na cidade. Alimentos, roupas, itens de higiene, brinquedos, livros e móveis.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            as-child
            size="lg"
            variant="secondary"
            class="gap-2 w-full sm:w-auto"
          >
            <RouterLink to="/pontos">
              <Search
                class="h-4 w-4"
                aria-hidden="true"
              />
              Ver pontos de coleta
            </RouterLink>
          </Button>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5 animate-fade-in-up">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="rounded-full bg-blue-100 p-2 text-blue-700 shrink-0">
          <Info
            class="h-5 w-5"
            aria-hidden="true"
          />
        </div>
        <div>
          <p class="text-sm font-medium text-blue-900">
            ONGs reais de Maceió
          </p>
          <p class="text-sm text-blue-800/80 leading-relaxed">
            Os pontos de coleta exibidos são organizações sociais reais cadastradas em Maceió/AL.
            Os dados foram obtidos a partir do site
            <a
              href="https://www.ongsbrasil.com.br/default.asp?Pag=1&Destino=Instituicoes&Estado=AL&Cidade=Maceio"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:text-blue-900"
            >ongsbrasil.com.br</a>.
            Recomendamos confirmar diretamente com a ONG antes de realizar a doação.
          </p>
        </div>
      </div>
    </section>

    <AppLoading
      v-if="loading"
      message="Carregando informações..."
    />

    <AppError
      v-else-if="error"
      :message="error"
      @retry="carregar"
    />

    <template v-else-if="resumo">
      <section class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
        <Card class="border-l-4 border-l-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <CardContent class="p-5">
            <p class="text-3xl sm:text-4xl font-bold text-primary">
              {{ resumo.totalPontosAtivos }}
            </p>
            <p class="text-sm text-muted-foreground mt-1">
              Pontos de coleta ativos
            </p>
          </CardContent>
        </Card>
        <Card class="border-l-4 border-l-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <CardContent class="p-5">
            <p class="text-3xl sm:text-4xl font-bold text-primary">
              {{ resumo.totalTiposDoacao }}
            </p>
            <p class="text-sm text-muted-foreground mt-1">
              Tipos de doação aceitos
            </p>
          </CardContent>
        </Card>
        <Card class="border-l-4 border-l-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 sm:col-span-2 lg:col-span-1">
          <CardContent class="p-5">
            <p class="text-sm text-muted-foreground mb-2">
              Categorias disponíveis
            </p>
            <div class="flex flex-wrap gap-1.5">
              <Badge
                v-for="tipo in resumo.tiposDisponiveis"
                :key="tipo"
                variant="secondary"
              >
                {{ tipo }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section class="space-y-5 animate-fade-in-up">
        <div class="flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold">
            Mapa dos pontos de coleta
          </h2>
          <p class="text-sm text-muted-foreground hidden sm:block">
            Clique em um pin para ver os detalhes
          </p>
        </div>
        <MapaMaceio
          :pontos="destaques"
          :interactive="true"
          @select="verDetalhes"
        />
        <p class="text-xs text-center text-muted-foreground sm:hidden">
          Toque em um pin para ver os detalhes
        </p>
      </section>

      <section
        v-if="destaques.length"
        class="space-y-5 animate-fade-in-up"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold">
            Pontos em destaque
          </h2>
          <Button
            as-child
            variant="ghost"
            class="text-primary"
          >
            <RouterLink to="/pontos">
              Ver todos
            </RouterLink>
          </Button>
        </div>
        <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <PontoCard
            v-for="(ponto, index) in destaques"
            :key="ponto.id"
            :ponto="ponto"
            :style="{ animationDelay: `${index * 100}ms` }"
            class="animate-fade-in-up"
          />
        </div>
      </section>

      <section class="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-6 sm:p-8 animate-fade-in-up">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div class="rounded-full bg-primary/10 p-3 text-primary">
            <PiggyBank
              class="h-6 w-6"
              aria-hidden="true"
            />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold">
              Você sabia que a sua doação pode deixar seu IRRF mais barato?
            </h2>
            <p class="text-muted-foreground text-sm mt-1">
              Pessoas físicas podem deduzir doações para entidades sem fins lucrativos no Imposto de Renda. Consulte um contador e veja como transformar solidariedade em benefício fiscal.
            </p>
          </div>
          <Button
            as-child
            variant="outline"
            class="border-primary/20 hover:bg-primary/5"
          >
            <RouterLink to="/pontos">
              Encontrar pontos
            </RouterLink>
          </Button>
        </div>
      </section>

      <section class="rounded-2xl bg-muted/40 border p-6 sm:p-8 animate-fade-in-up">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div class="rounded-full bg-primary/10 p-3 text-primary">
            <Heart
              class="h-6 w-6"
              aria-hidden="true"
            />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold">
              Quer divulgar um ponto de coleta?
            </h2>
            <p class="text-muted-foreground text-sm mt-1">
              Em uma versão futura, organizações poderão cadastrar e gerenciar seus pontos. Entre em contato para saber mais.
            </p>
          </div>
          <Button
            variant="outline"
            disabled
          >
            Em breve
          </Button>
        </div>
      </section>

      <section class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 animate-fade-in-up">
        <div class="flex items-start gap-3">
          <ShieldAlert
            class="h-5 w-5 text-amber-700 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 class="font-medium text-amber-900">
              Protótipo acadêmico
            </h3>
            <p class="text-sm text-amber-800/80 mt-1">
              Os pontos de coleta exibidos são fictícios e servem apenas para demonstração do conceito. Não utilize como fonte oficial de informações.
            </p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
