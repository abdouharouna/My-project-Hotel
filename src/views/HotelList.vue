<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HotelCard from '../components/HotelCard.vue'
import { fetchHotels } from '../services/hotelService'
import type { Hotel } from '../types/database'

// TEST TEMPORAIRE — uniquement la table hotel.
// Les autres tables (photo, equipement, avis, type_chambre...) sont déconnectées volontairement.

const hotels = ref<Hotel[]>([])
const loading = ref(true)
const error = ref('')

async function loadList() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchHotels()

    // LOG TEMPORAIRE — pour vérifier la connexion Supabase dans la console du navigateur.
    console.log('[TEST SUPABASE] Hôtels récupérés :', data)
    console.log('[TEST SUPABASE] Nombre de lignes :', data.length)

    hotels.value = data
  } catch (e: any) {
    console.error('[TEST SUPABASE] Erreur :', e)
    error.value = e?.message || "Impossible de charger les hôtels."
  } finally {
    loading.value = false
  }
}

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
      <p class="mt-4 max-w-2xl text-lagoon-600">
        Test de connexion — table <code class="font-mono text-coral-600">hotel</code> uniquement.
      </p>
    </section>

    <!-- Liste -->
    <section class="mx-auto max-w-7xl px-6 pt-4">
      <!-- Chargement -->
      <div v-if="loading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl bg-white p-6 shadow-card">
          <div class="h-48 rounded-xl bg-lagoon-100" />
          <div class="mt-4 h-6 w-2/3 rounded bg-lagoon-100" />
          <div class="mt-3 h-4 w-full rounded bg-lagoon-50" />
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="rounded-2xl bg-coral-50 p-8 text-center text-coral-700">
        <p class="font-semibold">Erreur Supabase</p>
        <p class="mt-2 text-sm">{{ error }}</p>
      </div>

      <!-- Liste vide -->
      <div v-else-if="hotels.length === 0" class="rounded-2xl bg-lagoon-50 p-12 text-center">
        <p class="text-lagoon-600">Aucun hôtel validé trouvé dans la base.</p>
        <p class="mt-2 text-sm text-lagoon-400">
          Vérifiez que la table « hotel » contient des lignes avec statut_validation = 'valide'.
        </p>
      </div>

      <!-- Résultats -->
      <div v-else>
        <p class="mb-6 text-sm text-lagoon-500">
          {{ hotels.length }} hôtel(s) récupéré(s) depuis Supabase
        </p>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <HotelCard
            v-for="hotel in hotels"
            :key="hotel.id"
            :hotel="hotel"
          />
        </div>
      </div>
    </section>
  </div>
</template>
