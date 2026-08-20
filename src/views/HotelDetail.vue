<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
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

const prixMini = computed<number | null>(() => {
  const tarifs = chambres.value
    .map((c) => c.tarif_nuit)
    .filter((t): t is number => typeof t === 'number')
  return tarifs.length ? Math.min(...tarifs) : null
})

async function loadDetail() {
  loading.value = true
  error.value = ''
  notFound.value = false
  try {
    const idNum = Number(props.id)
    if (!Number.isFinite(idNum)) {
      error.value = `Identifiant invalide : ${props.id}`
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
    error.value =
      e?.message ||
      (typeof e === 'object' ? JSON.stringify(e) : String(e)) ||
      "Impossible de charger les détails de cet hôtel."
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

function formatDate(d: string | null): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
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
      <button class="btn-primary mt-6" @click="router.push('/hotels')">
        Retour à la liste
      </button>
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
            v-if="photos.length"
            :src="photos[activePhoto]?.url || ''"
            :alt="photos[activePhoto]?.legende || hotel.nom"
            class="h-[55vh] w-full object-cover md:h-[60vh]"
          />
          <!-- État neutre quand aucune photo Supabase -->
          <div
            v-else
            class="flex h-[55vh] w-full items-center justify-center bg-gradient-to-br from-lagoon-100 to-lagoon-200 md:h-[60vh]"
            aria-hidden="true"
          >
            <svg class="h-20 w-20 text-lagoon-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l1.5-2h3L9 7m0 0l-6 .01M9 7h11a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8m6-1l1.5-2h3L16 7m-7 0h7" />
            </svg>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-lagoon-900/75 via-transparent to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
            <p class="mb-2 text-sm uppercase tracking-widest text-sand-100/80">{{ hotel.commune }}</p>
            <h1 class="font-serif text-4xl font-semibold md:text-5xl">{{ hotel.nom }}</h1>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <span v-if="note" class="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-lagoon-700">
                ★ {{ note.toFixed(1) }}
              </span>
              <span v-if="avis.length" class="text-sm text-sand-100/80">
                {{ avis.length }} avis
              </span>
              <span v-if="prixMini" class="rounded-full bg-coral-400 px-3 py-1 text-sm font-semibold text-white">
                dès {{ prixMini.toLocaleString('fr-FR') }} € / nuit
              </span>
            </div>
          </div>
        </div>

        <!-- Miniatures -->
        <div v-if="photos.length > 1" class="mt-4 flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(photo, i) in photos"
            :key="photo.id"
            class="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
            :class="i === activePhoto ? 'ring-2 ring-coral-400' : 'opacity-60 hover:opacity-100'"
            :aria-label="`Voir la photo ${i + 1}`"
            @click="activePhoto = i"
          >
            <img :src="photo.url || ''" :alt="photo.legende || ''" class="h-full w-full object-cover" />
          </button>
        </div>
      </section>

      <!-- Contenu -->
      <section class="mx-auto mt-12 grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
        <div class="space-y-14 lg:col-span-2">
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
            <div v-if="chambres.length" class="mt-4 grid gap-5 sm:grid-cols-2">
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
                    {{ ch.capacite }} personne{{ (ch.capacite || 0) > 1 ? 's' : '' }}
                  </span>
                  <span :class="ch.tarif_nuit ? 'font-semibold text-coral-500' : 'text-lagoon-400'">
                    {{ formatPrix(ch.tarif_nuit) }}
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
              <figure
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
                <blockquote v-if="a.commentaire" class="mt-3 leading-relaxed text-lagoon-700">
                  "{{ a.commentaire }}"
                </blockquote>
                <p v-if="a.date_creation" class="mt-3 text-xs text-lagoon-400">
                  {{ formatDate(a.date_creation) }}
                </p>
              </figure>
            </div>
            <p v-else class="mt-4 italic text-lagoon-400">Aucun avis pour le moment.</p>
          </div>
        </div>

        <!-- Sidebar : informations pratiques (collante) -->
        <aside class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <div class="rounded-2xl bg-white p-6 shadow-card">
              <h3 class="font-serif text-lg font-semibold text-lagoon-800">Informations pratiques</h3>
              <dl class="mt-5 space-y-4 text-sm">
                <div>
                  <dt class="font-medium text-lagoon-500">Commune</dt>
                  <dd class="mt-1 text-lagoon-800">{{ hotel.commune }}</dd>
                </div>
                <div v-if="hotel.adresse">
                  <dt class="font-medium text-lagoon-500">Adresse</dt>
                  <dd class="mt-1 text-lagoon-800">{{ hotel.adresse }}</dd>
                </div>
                <div v-if="hotel.latitude && hotel.longitude">
                  <dt class="font-medium text-lagoon-500">Coordonnées</dt>
                  <dd class="mt-1 text-lagoon-800">
                    {{ hotel.latitude }}, {{ hotel.longitude }}
                  </dd>
                </div>
                <div v-if="prixMini">
                  <dt class="font-medium text-lagoon-500">Tarif à partir de</dt>
                  <dd class="mt-1 font-semibold text-coral-500">
                    {{ prixMini.toLocaleString('fr-FR') }} € / nuit
                  </dd>
                </div>
              </dl>
            </div>

            <button class="btn-primary w-full" @click="router.push('/hotels')">
              Retour aux hôtels
            </button>
          </div>
        </aside>
      </section>
    </article>
  </div>
</template>
