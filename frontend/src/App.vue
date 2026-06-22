<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b">
      <nav class="container mx-auto flex h-16 items-center gap-6 px-4">
        <RouterLink to="/" class="text-lg font-semibold text-primary">
          Mapa Solidário Maceió
        </RouterLink>
        <div class="flex gap-4 text-sm">
          <RouterLink to="/pontos" class="text-muted-foreground hover:text-foreground transition-colors">
            Pontos de Coleta
          </RouterLink>
          <RouterLink to="/admin" class="text-muted-foreground hover:text-foreground transition-colors">
            Administração
          </RouterLink>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
