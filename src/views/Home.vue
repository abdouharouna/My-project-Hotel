<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HotelCard from '../components/HotelCard.vue'
import { fetchHotels, fetchCommunes } from '../services/hotelService'
import { fetchPhotosByHotelId } from '../services/photoService'
import { fetchAvisByHotelId, noteMoyenne } from '../services/avisService'
import type { Hotel } from '../types/database'

const router = useRouter()

const hotels = ref<Hotel[]>([])
const communes = ref<string[]>([])
const loading = ref(true)
const error = ref('')

// Première photo de chaque hôtel (pour les cartes).
const hotelImages = ref<Record<number, string | null>>({})
const hotelNotes = ref<Record<number, number | null>>({})

const searchCommune = ref('')

const heroImage =
  'https://images.pexels.com/photos/12871816/pexels-photo-12871816.jpeg?auto=compress&cs=tinysrgb&w=1920'

async function loadHome() {
  loading.value = true
  error.value = ''
  try {
    const [data, com] = await Promise.all([fetchHotels(), fetchCommunes()])
    hotels.value = data.slice(0, 4) // "Hôtels à la une"
    communes.value = com

    // Récupère en parallèle la première photo + note de chaque hôtel mis en avant.
    await Promise.all(
      hotels.value.map(async (h) => {
        const [photos, avis] = await Promise.all([
          fetchPhotosByHotelId(h.id),
          fetchAvisByHotelId(h.id),
        ])
        hotelImages.value[h.id] = photos[0]?.url ?? null
        hotelNotes.value[h.id] = noteMoyenne(avis)
      })
    )
  } catch (e) {
    console.error(e)
    error.value = "Impossible de charger les hôtels."
  } finally {
    loading.value = false
  }
}

function search() {
  if (searchCommune.value) {
    router.push({ path: '/hotels', query: { commune: searchCommune.value } })
  } else {
    router.push('/hotels')
  }
}

onMounted(loadHome)
</script>

<template>
  <!-- Hero plein écran -->
  <section class="relative flex min-h-screen items-center justify-center overflow-hidden">
    <img
      :src="heroImage"
      alt="Mayotte — littoral tropical"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-lagoon-900/60 via-lagoon-900/30 to-lagoon-900/70" />

    <div class="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
      <p class="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-sand-100/80 animate-fade-up">
        Mayotte · Océan Indien
      </p>
      <h1 class="font-serif text-5xl font-semibold leading-tight md:text-7xl animate-fade-up">
        L'île aux parfums,<br />ses hôtels d'exception
      </h1>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sand-100/90 md:text-lg animate-fade-up">
        Découvrez les plus beaux établissements de Mayotte, entre lagons turquoise,
        mangroves et forêts tropicales.
      </p>

      <!-- Barre de recherche -->
      <div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-up">
        <select v-model="searchCommune" class="w-full max-w-xs rounded-full border border-white/30 bg-white/15 px-5 py-3 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-auto">
          <option value="" class="text-lagoon-800">Toutes les communes</option>
          <option v-for="c in communes" :key="c" :value="c" class="text-lagoon-800">{{ c }}</option>
        </select>
        <button class="btn-primary w-full sm:w-auto" @click="search">
          Rechercher
        </button>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- Hôtels à la une — présentation asymétrique -->
  <section class="mx-auto max-w-7xl px-6 py-24">
    <div class="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
      <div>
        <p class="mb-2 text-sm font-medium uppercase tracking-widest text-coral-500">Sélection</p>
        <h2 class="font-serif text-4xl font-semibold text-lagoon-800">Hôtels à la une</h2>
      </div>
      <RouterLink to="/hotels" class="text-sm font-semibold text-lagoon-700 hover:text-coral-500">
        Voir tous les hôtels →
      </RouterLink>
    </div>

    <div v-if="loading" class="grid gap-8 md:grid-cols-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl bg-white p-6 shadow-card">
        <div class="h-48 rounded-xl bg-lagoon-100" />
        <div class="mt-4 h-6 w-2/3 rounded bg-lagoon-100" />
        <div class="mt-3 h-4 w-full rounded bg-lagoon-50" />
      </div>
    </div>

    <div v-else-if="error" class="rounded-2xl bg-coral-50 p-8 text-center text-coral-700">
      {{ error }}
    </div>

    <div v-else-if="hotels.length === 0" class="rounded-2xl bg-lagoon-50 p-8 text-center text-lagoon-600">
      Aucun hôtel n'est encore disponible dans la base.
    </div>

    <!-- Grille asymétrique : premier carte plus grande -->
    <div v-else class="grid gap-8 md:grid-cols-3">
      <HotelCard
        v-for="(hotel, i) in hotels"
        :key="hotel.id"
        :hotel="hotel"
        :image-url="hotelImages[hotel.id]"
        :note="hotelNotes[hotel.id]"
        :class="i === 0 ? 'md:col-span-2 md:row-span-1' : ''"
      />
    </div>
  </section>

  <!-- Communes de Mayotte -->
  <section class="bg-lagoon-800 py-24">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-12 text-center">
        <p class="mb-2 text-sm font-medium uppercase tracking-widest text-coral-400">Explorer</p>
        <h2 class="font-serif text-4xl font-semibold text-white">Les communes de Mayotte</h2>
        <p class="mx-auto mt-4 max-w-xl text-sand-100/70">
          Choisissez votre destination parmi les communes où nos hôtels sont implantés.
        </p>
      </div>

      <div v-if="communes.length === 0" class="text-center text-sand-100/50">
        Aucune commune disponible pour le moment.
      </div>

      <div v-else class="flex flex-wrap justify-center gap-3">
        <RouterLink
          v-for="c in communes"
          :key="c"
          :to="{ path: '/hotels', query: { commune: c } }"
          class="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-coral-400 hover:text-coral-400"
        >
          {{ c }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
