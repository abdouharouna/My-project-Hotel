<script setup lang="ts">
import { computed } from 'vue'
import type { Hotel } from '../types/database'

const props = defineProps<{
  hotel: Hotel
  imageUrl?: string | null
  note?: number | null
}>()

// Image de remplacement si aucune photo n'est disponible depuis Supabase.
const fallbackImage =
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200'

const imgSrc = computed(() => props.imageUrl || fallbackImage)
</script>

<template>
  <RouterLink
    :to="`/hotels/${hotel.id}`"
    class="group block overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft"
  >
    <div class="relative h-64 overflow-hidden">
      <img
        :src="imgSrc"
        :alt="hotel.nom"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-lagoon-900/50 to-transparent opacity-70" />
      <span
        v-if="note"
        class="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-lagoon-700 shadow-soft"
      >
        ★ {{ note.toFixed(1) }}
      </span>
      <span class="absolute bottom-4 left-4 chip bg-white/90">
        {{ hotel.commune }}
      </span>
    </div>

    <div class="p-6">
      <h3 class="font-serif text-xl font-semibold text-lagoon-800 transition-colors group-hover:text-coral-500">
        {{ hotel.nom }}
      </h3>
      <p v-if="hotel.description" class="mt-3 line-clamp-2 text-sm leading-relaxed text-lagoon-600">
        {{ hotel.description }}
      </p>
      <p v-else class="mt-3 text-sm italic text-lagoon-400">Description non disponible</p>

      <div class="mt-5 flex items-center gap-2 text-sm font-medium text-coral-500">
        Découvrir
        <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  </RouterLink>
</template>
