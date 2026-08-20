<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HotelCard from '../components/HotelCard.vue'
import { fetchHotels, fetchCommunes } from '../services/hotelService'
import { fetchPhotosByHotelId } from '../services/photoService'
import { fetchAvisByHotelId, noteMoyenne } from '../services/avisService'
import { fetchChambresByHotelId } from '../services/chambreService'
import type { Hotel } from '../types/database'

const route = useRoute()
const router = useRouter()

const allHotels = ref<Hotel[]>([])
const communes = ref<string[]>([])
const loading = ref(true)
const error = ref('')

const hotelImages = ref<Record<number, string | null>>({})
const hotelNotes = ref<Record<number, number | null>>({})
const hotelPrix = ref<Record<number, number | null>>({})

// Filtre par commune : initialise depuis l'URL (?commune=...).
const selectedCommune = ref<string>((route.query.commune as string) || '')
const searchQuery = ref('')

async function loadList() {
  loading.value = true
  error.value = ''
  try {
    const [data, com] = await Promise.all([fetchHotels(), fetchCommunes()])
    allHotels.value = data
    communes.value = com

    // Enrichit chaque hôtel : première photo, note moyenne, prix mini.
    await Promise.all(
      data.map(async (h) => {
        const [photos, avis, chambres] = await Promise.all([
          fetchPhotosByHotelId(h.id),
          fetchAvisByHotelId(h.id),
          fetchChambresByHotelId(h.id),
        ])
        hotelImages.value[h.id] = photos[0]?.url ?? null
        hotelNotes.value[h.id] = noteMoyenne(avis)
        const tarifs = chambres
          .map((c) => c.tarif_nuit)
          .filter((t): t is number => typeof t === 'number')
        hotelPrix.value[h.id] = tarifs.length ? Math.min(...tarifs) : null
      })
    )
  } catch (e: any) {
    console.error('[HotelList] loadList error', e)
    error.value = e?.message || "Impossible de charger les hôtels."
  } finally {
    loading.value = false
  }
}

// Applique les filtres commune + recherche texte côté client.
const filteredHotels = computed(() => {
  return allHotels.value.filter((h) => {
    const okCommune = !selectedCommune.value || h.commune === selectedCommune.value
    const q = searchQuery.value.trim().toLowerCase()
    const okSearch =
      !q ||
      h.nom.toLowerCase().includes(q) ||
      (h.commune || '').toLowerCase().includes(q) ||
      (h.description || '').toLowerCase().includes(q)
    return okCommune && okSearch
  })
})

function selectCommune(c: string) {
  selectedCommune.value = c
  syncRoute()
}

function clearFilters() {
  selectedCommune.value = ''
  searchQuery.value = ''
  syncRoute()
}

function syncRoute() {
  router.replace({
    path: '/hotels',
    query: selectedCommune.value ? { commune: selectedCommune.value } : {},
  })
}

// Réagit aux changements de commune via l'URL (ex. depuis la page d'accueil).
watch(
  () => route.query.commune,
  (c) => {
    selectedCommune.value = (c as string) || ''
  }
)

onMounted(loadList)
</script>

<template>
  <div class="bg-sand-50 pb-24 pt-28">
    <!-- En-tête -->
    <section class="mx-auto max-w-7xl px-6 py-12">
      <p class="mb-2 text-sm font-medium uppercase tracking-widest text-coral-500">Nos établissements</p>
      <h1 class="font-serif text-4xl font-semibold text-lagoon-800 md:text-5xl">
        Hôtels à Mayotte
      </h1>
      <p class="mt-4 max-w-2xl leading-relaxed text-lagoon-600">
        Découvrez les établissements de l'île. Filtrez par commune ou recherchez
        par nom pour trouver votre prochain séjour.
      </p>
    </section>

    <!-- Barre de filtres -->
    <section class="mx-auto max-w-7xl px-6">
      <div class="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card md:flex-row md:items-center">
        <div class="relative flex-1">
          <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-lagoon-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            class="field pl-12"
            placeholder="Rechercher un hôtel, une commune…"
            aria-label="Rechercher un hôtel"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            class="rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
            :class="selectedCommune === ''
              ? 'bg-coral-400 text-white shadow-soft'
              : 'bg-lagoon-50 text-lagoon-700 hover:bg-lagoon-100'"
            @click="selectCommune('')"
          >
            Toutes
          </button>
          <button
            v-for="c in communes"
            :key="c"
            class="rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
            :class="selectedCommune === c
              ? 'bg-coral-400 text-white shadow-soft'
              : 'bg-lagoon-50 text-lagoon-700 hover:bg-lagoon-100'"
            @click="selectCommune(c)"
          >
            {{ c }}
          </button>
        </div>
      </div>
    </section>

    <!-- Liste -->
    <section class="mx-auto max-w-7xl px-6 pt-10">
      <!-- Chargement -->
      <div v-if="loading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-white p-6 shadow-card">
          <div class="h-48 rounded-xl bg-lagoon-100" />
          <div class="mt-4 h-6 w-2/3 rounded bg-lagoon-100" />
          <div class="mt-3 h-4 w-full rounded bg-lagoon-50" />
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="rounded-2xl bg-coral-50 p-8 text-center text-coral-700">
        <p class="font-semibold">Impossible de charger les hôtels</p>
        <p class="mt-2 text-sm">{{ error }}</p>
      </div>

      <!-- Aucun résultat après filtre -->
      <div
        v-else-if="filteredHotels.length === 0"
        class="rounded-2xl bg-lagoon-50 p-12 text-center"
      >
        <p class="text-lagoon-600">Aucun hôtel ne correspond à votre recherche.</p>
        <button class="btn-primary mt-6" @click="clearFilters">
          Réinitialiser les filtres
        </button>
      </div>

      <!-- Résultats -->
      <div v-else>
        <p class="mb-6 text-sm text-lagoon-500">
          {{ filteredHotels.length }} hôtel{{ filteredHotels.length > 1 ? 's' : '' }}
          <span v-if="selectedCommune" class="text-lagoon-400">· {{ selectedCommune }}</span>
        </p>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <HotelCard
            v-for="hotel in filteredHotels"
            :key="hotel.id"
            :hotel="hotel"
            :image-url="hotelImages[hotel.id]"
            :note="hotelNotes[hotel.id]"
            :prix="hotelPrix[hotel.id]"
          />
        </div>
      </div>
    </section>
  </div>
</template>
