<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const menuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b sticky top-0 bg-background z-10">
      <nav class="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <RouterLink
          to="/"
          class="text-lg font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Mapa Solidário Maceió
        </RouterLink>

        <button
          class="inline-flex items-center justify-center rounded-md border border-input bg-background h-9 px-3 text-sm sm:hidden hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'"
          aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span class="text-lg leading-none">{{ menuOpen ? '\u2715' : '\u2630' }}</span>
        </button>

        <div
          class="w-full sm:w-auto flex-col sm:flex-row gap-2 sm:gap-4 text-sm"
          :class="[menuOpen ? 'flex' : 'hidden sm:flex']"
        >
          <RouterLink
            to="/pontos"
            class="block py-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            @click="menuOpen = false"
          >
            Pontos de Coleta
          </RouterLink>
          <RouterLink
            to="/admin"
            class="block py-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            @click="menuOpen = false"
          >
            Administração
          </RouterLink>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-6 sm:py-8">
      <RouterView />
    </main>
  </div>
</template>
