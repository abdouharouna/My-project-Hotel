<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, signOut } = useAuth()

const loading = ref(false)
const error = ref('')

async function handleSignOut() {
  error.value = ''
  loading.value = true
  try {
    await signOut()
    router.replace('/')
  } catch (e: any) {
    error.value = e?.message || 'Erreur lors de la déconnexion.'
  } finally {
    loading.value = false
  }
}

const nom = () => (user.value?.user_metadata?.nom as string) || null
const email = () => user.value?.email || null
</script>

<template>
  <div class="min-h-screen bg-sand-50 pt-28">
    <section class="mx-auto max-w-lg px-6 py-16">
      <p class="mb-2 text-sm font-medium uppercase tracking-widest text-coral-500">
        Mon compte
      </p>
      <h1 class="font-serif text-4xl font-semibold text-lagoon-800">Bonjour{{ nom() ? ', ' + nom() : '' }}</h1>
      <p class="mt-3 text-lagoon-600">Voici les informations de votre compte MayHotels.</p>

      <div class="mt-10 rounded-2xl bg-white p-8 shadow-card animate-fade-up">
        <dl class="space-y-5">
          <div>
            <dt class="text-xs font-semibold uppercase tracking-wider text-lagoon-500">Nom</dt>
            <dd class="mt-1 text-lagoon-800">{{ nom() || 'Non renseigné' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-wider text-lagoon-500">Email</dt>
            <dd class="mt-1 text-lagoon-800">{{ email() || 'Non disponible' }}</dd>
          </div>
        </dl>

        <p v-if="error" class="mt-6 rounded-lg bg-coral-50 px-4 py-3 text-sm text-coral-700" role="alert">
          {{ error }}
        </p>

        <button
          class="btn-primary mt-8 w-full"
          :disabled="loading"
          :class="loading ? 'opacity-70 cursor-not-allowed hover:translate-y-0 hover:shadow-soft' : ''"
          @click="handleSignOut"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Déconnexion…
          </span>
          <span v-else class="flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Se déconnecter
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
