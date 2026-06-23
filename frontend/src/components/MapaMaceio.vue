<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { PontoColeta } from '@/types/ponto-coleta'
import { corTipoDoacao } from '@/constants/tipos-doacao'

const props = withDefaults(
  defineProps<{
    pontos: PontoColeta[]
    highlightId?: string
    interactive?: boolean
    height?: number
  }>(),
  {
    highlightId: undefined,
    interactive: true,
    height: undefined,
  },
)

const emit = defineEmits<{
  select: [id: string]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = ref<unknown>(null)
const markers = ref<Array<{ id: string; marker: unknown }>>([])

const pontosComCoordenadas = computed(() =>
  props.pontos.filter((p) => p.status === 'ativo' && typeof p.latitude === 'number' && typeof p.longitude === 'number'),
)

const centro = computed(() => {
  if (pontosComCoordenadas.value.length === 0) {
    return { lat: -9.64985, lng: -35.7339 }
  }
  const soma = pontosComCoordenadas.value.reduce(
    (acc, p) => ({ lat: acc.lat + (p.latitude ?? 0), lng: acc.lng + (p.longitude ?? 0) }),
    { lat: 0, lng: 0 },
  )
  return {
    lat: soma.lat / pontosComCoordenadas.value.length,
    lng: soma.lng / pontosComCoordenadas.value.length,
  }
})

async function initMap() {
  if (!mapContainer.value) return

  const L = await import('leaflet')

  const map = L.map(mapContainer.value, {
    zoomControl: false,
  }).setView([centro.value.lat, centro.value.lng], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  mapInstance.value = map
  addMarkers(L)
}

function addMarkers(L: typeof import('leaflet')) {
  if (!mapInstance.value) return

  const map = mapInstance.value as import('leaflet').Map

  for (const ponto of pontosComCoordenadas.value) {
    const cor = corTipoDoacao(ponto.tiposDoacao[0])
    const colorMap: Record<string, string> = {
      'bg-amber-100': '#f59e0b',
      'bg-emerald-100': '#10b981',
      'bg-sky-100': '#0ea5e9',
      'bg-rose-100': '#f43f5e',
      'bg-violet-100': '#8b5cf6',
      'bg-orange-100': '#f97316',
    }
    const fillColor = colorMap[cor.bg] ?? '#10b981'

    const pinHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${fillColor}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `
    const icon = L.divIcon({
      html: pinHtml,
      className: 'leaflet-custom-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })

    const marker = L.marker([ponto.latitude!, ponto.longitude!], { icon }).addTo(map)

    const popupContent = `
      <div class="font-sans">
        <p class="font-semibold text-sm">${ponto.nome}</p>
        <p class="text-xs text-muted-foreground">${ponto.bairro}</p>
      </div>
    `
    marker.bindPopup(popupContent)

    if (props.interactive) {
      marker.on('click', () => {
        emit('select', ponto.id)
      })
    }

    markers.value.push({ id: ponto.id, marker })
  }

  if (pontosComCoordenadas.value.length > 1) {
    const group = L.featureGroup(markers.value.map((m) => m.marker as import('leaflet').Marker))
    map.fitBounds(group.getBounds().pad(0.15))
  }
}

function updateHighlight() {
  if (!mapInstance.value || !props.highlightId) return
  const entry = markers.value.find((m) => m.id === props.highlightId)
  if (entry) {
    const marker = entry.marker as import('leaflet').Marker
    marker.openPopup()
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance.value) {
    ;(mapInstance.value as import('leaflet').Map).remove()
  }
})

watch(
  () => props.highlightId,
  () => updateHighlight(),
)
</script>

<template>
  <div
    ref="mapContainer"
    class="relative w-full rounded-2xl overflow-hidden border shadow-inner z-0"
    :class="height ? '' : 'aspect-[4/3] sm:aspect-[16/9]'"
    :style="height ? { height: `${height}px` } : undefined"
  />
</template>

<style>
.leaflet-custom-pin {
  background: transparent;
  border: none;
}
</style>
