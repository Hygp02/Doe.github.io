<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, MapPin, Clock, FileText, Package, AlertCircle, Info } from 'lucide-vue-next'
import { usePonto } from '@/composables/usePonto'
import AppLoading from '@/components/AppLoading.vue'
import AppError from '@/components/AppError.vue'
import ExternalActions from '@/components/ExternalActions.vue'
import MapaMaceio from '@/components/MapaMaceio.vue'
import { corTipoDoacao } from '@/constants/tipos-doacao'

const route = useRoute()
const router = useRouter()
const { ponto, loading, error, notFound, carregar } = usePonto()

const pontoId = computed(() => route.params.id as string)

onMounted(() => {
  carregar(pontoId.value)
})

function voltar() {
  router.push('/pontos')
}
</script>

<template>
  <div class="space-y-6">
    <Button
      variant="ghost"
      class="px-0 gap-2"
      @click="voltar"
    >
      <ArrowLeft
        class="h-4 w-4"
        aria-hidden="true"
      />
      Voltar para listagem
    </Button>

    <AppLoading
      v-if="loading"
      message="Carregando detalhes..."
    />

    <div
      v-else-if="notFound"
      class="flex flex-col items-center justify-center gap-4 py-16 text-center"
      role="status"
    >
      <div class="rounded-full bg-muted p-4">
        <AlertCircle
          class="h-8 w-8 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <div class="space-y-1">
        <p class="text-lg font-medium">
          Ponto de coleta não encontrado
        </p>
        <p class="text-sm text-muted-foreground">
          O ponto solicitado não existe ou foi removido.
        </p>
      </div>
      <Button as-child>
        <RouterLink to="/pontos">
          Voltar para listagem
        </RouterLink>
      </Button>
    </div>

    <AppError
      v-else-if="error"
      :message="error"
      @retry="carregar(pontoId)"
    />

    <section
      v-else-if="ponto"
      class="space-y-6"
    >
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-2xl sm:text-3xl font-bold">
              {{ ponto.nome }}
            </h1>
            <Badge
              :variant="ponto.status === 'ativo' ? 'default' : 'secondary'"
              class="text-xs"
            >
              {{ ponto.status === 'ativo' ? 'Ativo' : 'Inativo' }}
            </Badge>
          </div>
          <p
            v-if="ponto.descricao"
            class="text-muted-foreground max-w-3xl"
          >
            {{ ponto.descricao }}
          </p>
        </div>
      </div>

      <section class="rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5 animate-fade-in-up">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div class="rounded-full bg-blue-100 p-2 text-blue-700 shrink-0">
            <Info
              class="h-5 w-5"
              aria-hidden="true"
            />
          </div>
          <p class="text-sm text-blue-800/80 leading-relaxed">
            <span class="font-medium text-blue-900">ONG real.</span>
            Os dados desta organização foram obtidos no cadastro público
            <a
              href="https://www.ongsbrasil.com.br/default.asp?Pag=1&Destino=Instituicoes&Estado=AL&Cidade=Maceio"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:text-blue-900"
            >ongsbrasil.com.br</a>.
            Confirme telefone e necessidades antes de doar.
          </p>
        </div>
      </section>

      <ExternalActions :ponto="ponto" />

      <div class="grid gap-6 lg:grid-cols-3">
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <MapPin
                class="h-5 w-5 text-primary"
                aria-hidden="true"
              />
              Informações do local
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 class="text-sm font-medium text-muted-foreground">
                  Endereço
                </h2>
                <p class="mt-0.5">
                  {{ ponto.endereco }}
                </p>
              </div>
              <div>
                <h2 class="text-sm font-medium text-muted-foreground">
                  Bairro
                </h2>
                <p class="mt-0.5">
                  {{ ponto.bairro }}
                </p>
              </div>
              <div>
                <h2 class="text-sm font-medium text-muted-foreground">
                  Cidade
                </h2>
                <p class="mt-0.5">
                  {{ ponto.cidade }}
                </p>
              </div>
              <div>
                <h2 class="text-sm font-medium text-muted-foreground">
                  Telefone
                </h2>
                <p class="mt-0.5">
                  {{ ponto.telefone || 'Não informado' }}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h2 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock
                  class="h-4 w-4"
                  aria-hidden="true"
                />
                Horário de funcionamento
              </h2>
              <p class="mt-1">
                {{ ponto.horarioFuncionamento || 'Não informado' }}
              </p>
            </div>
          </CardContent>
        </Card>

        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Package
                  class="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                Doações aceitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="tipo in ponto.tiposDoacao"
                  :key="tipo"
                  variant="secondary"
                  :class="corTipoDoacao(tipo).bg + ' ' + corTipoDoacao(tipo).text"
                >
                  {{ tipo }}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card v-if="ponto.observacoes">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <FileText
                  class="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ ponto.observacoes }}
              </p>
            </CardContent>
          </Card>

          <Card class="overflow-hidden animate-fade-in">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <MapPin
                  class="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                Localização no mapa
              </CardTitle>
            </CardHeader>
            <CardContent class="p-0">
              <MapaMaceio
                :pontos="[ponto]"
                :highlight-id="ponto.id"
                :interactive="false"
                :height="220"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>
