<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signUp } = useAuth()

const nom = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const passwordsMatch = computed(() => password.value === confirmPassword.value)
const passwordLong = computed(() => password.value.length >= 6)

async function submit() {
  error.value = ''
  if (!nom.value) {
    error.value = 'Merci d\'indiquer votre nom.'
    return
  }
  if (!emailValid.value) {
    error.value = 'L\'adresse email n\'est pas valide.'
    return
  }
  if (!passwordLong.value) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }
  if (!passwordsMatch.value) {
    error.value = 'Les deux mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    await signUp(nom.value, email.value, password.value)
    router.replace('/mon-compte')
  } catch (e: any) {
    error.value = e?.message || 'Impossible de créer le compte.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-sand-50 px-6 pt-20 pb-12">
    <div class="w-full max-w-md">
      <div class="rounded-2xl bg-white p-8 shadow-card animate-fade-up">
        <div class="mb-8 text-center">
          <p class="mb-2 text-sm font-medium uppercase tracking-widest text-coral-500">
            Inscription
          </p>
          <h1 class="font-serif text-3xl font-semibold text-lagoon-800">Créer votre compte</h1>
          <p class="mt-3 text-sm text-lagoon-600">
            Rejoignez MayHotels pour découvrir les hôtels de Mayotte.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submit">
          <div>
            <label for="nom" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
              Nom
            </label>
            <input
              id="nom"
              v-model="nom"
              type="text"
              class="field"
              placeholder="Votre nom"
              autocomplete="name"
              required
            />
          </div>

          <div>
            <label for="email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="field"
              placeholder="vous@email.com"
              autocomplete="email"
              required
            />
          </div>

          <div>
            <label for="password" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
              Mot de passe
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field pr-12"
                placeholder="Au moins 6 caractères"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-lagoon-400 hover:text-lagoon-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 rounded"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label for="confirm" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="field"
              placeholder="Saisissez à nouveau votre mot de passe"
              autocomplete="new-password"
              required
            />
            <p v-if="confirmPassword && !passwordsMatch" class="mt-2 text-xs text-coral-600">
              Les mots de passe ne correspondent pas.
            </p>
          </div>

          <p v-if="error" class="rounded-lg bg-coral-50 px-4 py-3 text-sm text-coral-700" role="alert">
            {{ error }}
          </p>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
            :class="loading ? 'opacity-70 cursor-not-allowed hover:translate-y-0 hover:shadow-soft' : ''"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Création…
            </span>
            <span v-else>Créer mon compte</span>
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-lagoon-600">
          Déjà inscrit ?
          <RouterLink to="/connexion" class="font-semibold text-coral-500 hover:text-coral-600">
            Se connecter
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
