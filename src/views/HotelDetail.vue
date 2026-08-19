<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchHotelById } from '../services/hotelService'
import { fetchChambresByHotelId } from '../services/chambreService'
import { fetchEquipementsByHotelId } from '../services/equipementService'
import { fetchPhotosByHotelId } from '../services/photoService'
import { fetchAvisByHotelId, noteMoyenne } from '../services/avisService'
import type { Hotel, TypeChambre, Equipement, Photo, Avis } from '../types/database'

const props = defineProps<{ id: number | string }>()
const router = useRouter()

const hotel = ref<Hotel | null>(null)
const chambres = ref<TypeChambre[]>([])
const equipements = ref<Equipement[]>([])
const photos = ref<Photo[]>([])
const avis = ref<Avis[]>([])

const loading = ref(true)
const error = ref('')
const notFound = ref(false)

const note = ref<number | null>(null)
const activePhoto = ref(0)

const fallbackImage =
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600'

async function loadDetail() {
  loading.value = true
  error.value = ''
  notFound.value = false
  try {
    const idNum = Number(props.id)
    if (!Number.isFinite(idNum)) {
      error.value = `ID invalide : ${props.id}`
      loading.value = false
      return
    }

    const data = await fetchHotelById(idNum)
    if (!data) {
      notFound.value = true
      return
    }
    hotel.value = data

    const [c, e, p, a] = await Promise.all([
      fetchChambresByHotelId(idNum),
      fetchEquipementsByHotelId(idNum),
      fetchPhotosByHotelId(idNum),
      fetchAvisByHotelId(idNum),
    ])
    chambres.value = c
    equipements.value = e
    photos.value = p
    avis.value = a
    note.value = noteMoyenne(a)
    activePhoto.value = 0
  } catch (e: any) {
    console.error('[HotelDetail] loadDetail error', e)
    // Affiche le message d'erreur retourné par Supabase si disponible
    error.value = e?.message || (typeof e === 'object' ? JSON.stringify(e) : String(e)) || "Impossible de charger les détails de cet hôtel."
  } finally {
    loading.value = false
  }
}

watch(() => props.id, loadDetail)
onMounted(loadDetail)

function formatPrix(p: number | null): string {
  if (p === null || p === undefined) return 'Non disponible'
  return `${p.toLocaleString('fr-FR')} € / nuit`
}
</script>

<template>
  <div class="min-h-screen bg-sand-50 pt-20">
    <!-- Chargement -->
    <div v-if="loading" class="mx-auto max-w-5xl px-6 py-24">
      <div class="animate-pulse">
        <div class="h-8 w-1/2 rounded bg-lagoon-100" />
        <div class="mt-4 h-4 w-1/3 rounded bg-lagoon-50" />
        <div class="mt-8 h-96 rounded-2xl bg-lagoon-100" />
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="mx-auto max-w-3xl px-6 py-24 text-center">
      <p class="rounded-2xl bg-coral-50 p-8 text-coral-700">{{ error }}</p>
    </div>

    <!-- Introuvable -->
    <div v-else-if="notFound" class="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 class="font-serif text-3xl text-lagoon-800">Hôtel introuvable</h1>
      <p class="mt-3 text-lagoon-600">Cet hôtel n'existe pas ou n'est plus disponible.</p>
      <button class="btn-primary mt-6" @click="router.push('/hotels')">
        Retour à la liste
      </button>
    </div>

    <!-- Détail -->
    <article v-else-if="hotel">
      <!-- Galerie -->
      <section class="mx-auto max-w-7xl px-6">
        <div class="relative overflow-hidden rounded-3xl">
          <img
            :src="photos[activePhoto]?.url || fallbackImage"
            :alt="photos[activePhoto]?.legende || hotel.nom"
            class="h-[60vh] w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-lagoon-900/70 via-transparent to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
            <p class="mb-2 text-sm uppercase tracking-widest text-sand-100/80">{{ hotel.commune }}</p>
            <h1 class="font-serif text-4xl font-semibold md:text-5xl">{{ hotel.nom }}</h1>
            <div v-if="note" class="mt-3 flex items-center gap-2">
              <span class="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-lagoon-700">
                ★ {{ note.toFixed(1) }}
              </span>
              <span class="text-sm text-sand-100/80">({{ avis.length }} avis)</span>
            </div>
          </div>
        </div>

        <!-- Miniatures -->
        <div v-if="photos.length > 1" class="mt-4 flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(photo, i) in photos"
            :key="photo.id"
            class="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg transition"
            :class="i === activePhoto ? 'ring-2 ring-coral-400' : 'opacity-60 hover:opacity-100'"
            @click="activePhoto = i"
          >
            <img :src="photo.url || ''" :alt="photo.legende || ''" class="h-full w-full object-cover" />
          </button>
        </div>
      </section>

      <!-- Contenu -->
      <section class="mx-auto mt-12 grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-12">
          <!-- Description -->
          <div>
            <h2 class="font-serif text-2xl font-semibold text-lagoon-800">À propos</h2>
            <p v-if="hotel.description" class="mt-4 leading-relaxed text-lagoon-700">
              {{ hotel.description }}
            </p>
            <p v-else class="mt-4 italic text-lagoon-400">Description non disponible.</p>
          </div>

          <!-- Équipements -->
          <div>
            <h2 class="font-serif text-2xl font-semibold text-lagoon-800">Équipements</h2>
            <div v-if="equipements.length" class="mt-4 flex flex-wrap gap-2">
              <span v-for="e in equipements" :key="e.id" class="chip">
                {{ e.nom || 'Équipement' }}
              </span>
            </div>
            <p v-else class="mt-4 italic text-lagoon-400">Aucun équipement renseigné.</p>
          </div>

          <!-- Chambres -->
          <div>
            <h2 class="font-serif text-2xl font-semibold text-lagoon-800">Chambres</h2>
            <div v-if="chambres.length" class="mt-4 grid gap-4 sm:grid-cols-2">
              <div
                v-for="ch in chambres"
                :key="ch.id"
                class="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <h3 class="font-serif text-lg font-semibold text-lagoon-800">{{ ch.nom || 'Chambre' }}</h3>
                <p v-if="ch.description" class="mt-2 text-sm leading-relaxed text-lagoon-600">
                  {{ ch.description }}
                </p>
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span v-if="ch.capacite" class="text-lagoon-500">
                    {{ ch.capacite }} personne(s)
                  </span>
                  <span :class="ch.prix_par_nuit ? 'font-semibold text-coral-500' : 'text-lagoon-400'">
                    {{ formatPrix(ch.prix_par_nuit) }}
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="mt-4 italic text-lagoon-400">Aucune chambre renseignée.</p>
          </div>

          <!-- Avis -->
          <div>
            <h2 class="font-serif text-2xl font-semibold text-lagoon-800">Avis des visiteurs</h2>
            <div v-if="avis.length" class="mt-4 space-y-4">
              <div
                v-for="a in avis"
                :key="a.id"
                class="rounded-2xl bg-white p-6 shadow-card"
              >
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-lagoon-800">
                    {{ a.utilisateur?.nom || 'Visiteur' }}
                  </p>
                  <span v-if="a.note" class="text-sm font-semibold text-coral-500">
                    ★ {{ a.note }}/5
                  </span>
                </div>
                <p v-if="a.commentaire" class="mt-3 leading-relaxed text-lagoon-700">
                  {{ a.commentaire }}
                </p>
                <p v-if="a.date_creation" class="mt-3 text-xs text-lagoon-400">
                  {{ new Date(a.date_creation).toLocaleDateString('fr-FR') }}
                </p>
              </div>
            </div>
            <p v-else class="mt-4 italic text-lagoon-400">Aucun avis pour le moment.</p>
          </div>
        </div>

        <!-- Sidebar : informations pratiques -->
        <aside class="space-y-6">
          <div class="rounded-2xl bg-white p-6 shadow-card">
            <h3 class="font-serif text-lg font-semibold text-lagoon-800">Informations pratiques</h3>
            <dl class="mt-4 space-y-3 text-sm">
              <div>
                <dt class="font-medium text-lagoon-500">Commune</dt>
                <dd class="text-lagoon-800">{{ hotel.commune }}</dd>
              </div>
              <div v-if="hotel.adresse">
                <dt class="font-medium text-lagoon-500">Adresse</dt>
                <dd class="text-lagoon-800">{{ hotel.adresse }}</dd>
              </div>
              <div v-if="hotel.latitude && hotel.longitude">
                <dt class="font-medium text-lagoon-500">Coordonnées</dt>
                <dd class="text-lagoon-800">
                  {{ hotel.latitude }}, {{ hotel.longitude }}
                </dd>
              </div>
            </dl>
          </div>

          <button class="btn-primary w-full" @click="router.push('/hotels')">
            Retour aux hôtels
          </button>
        </aside>
      </section>
    </article>
  </div>
</template>
