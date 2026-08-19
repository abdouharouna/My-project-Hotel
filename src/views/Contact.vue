<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  nom: '',
  email: '',
  message: '',
})

const sent = ref(false)
const error = ref('')

function submit() {
  error.value = ''
  if (!form.value.nom || !form.value.email || !form.value.message) {
    error.value = 'Merci de remplir tous les champs.'
    return
  }
  // Pour l'instant, le formulaire n'est pas enregistré en base.
  // Aucune table n'a été créée pour lui, conformément aux consignes.
  sent.value = true
}

function reset() {
  form.value = { nom: '', email: '', message: '' }
  sent.value = false
}
</script>

<template>
  <div class="min-h-screen bg-sand-50 pt-20">
    <section class="mx-auto max-w-xl px-6 py-24">
      <p class="mb-2 text-center text-sm font-medium uppercase tracking-widest text-coral-500">
        Une question ?
      </p>
      <h1 class="text-center font-serif text-4xl font-semibold text-lagoon-800 md:text-5xl">
        Contactez-nous
      </h1>
      <p class="mx-auto mt-4 max-w-md text-center text-lagoon-600">
        Notre équipe vous répondra dans les meilleurs délais.
      </p>

      <!-- Confirmation -->
      <div
        v-if="sent"
        class="mt-12 rounded-2xl bg-white p-8 text-center shadow-card"
      >
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral-50">
          <svg class="h-7 w-7 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="font-serif text-xl font-semibold text-lagoon-800">Message envoyé !</h2>
        <p class="mt-2 text-sm text-lagoon-600">Merci, nous reviendrons vers vous très vite.</p>
        <button class="mt-6 text-sm font-semibold text-coral-500 hover:text-coral-600" @click="reset">
          Envoyer un autre message
        </button>
      </div>

      <!-- Formulaire -->
      <form v-else class="mt-12 space-y-5" @submit.prevent="submit">
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
            Nom
          </label>
          <input v-model="form.nom" type="text" class="field" placeholder="Votre nom" />
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
            Email
          </label>
          <input v-model="form.email" type="email" class="field" placeholder="vous@email.com" />
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
            Message
          </label>
          <textarea v-model="form.message" rows="5" class="field" placeholder="Votre message..."></textarea>
        </div>

        <p v-if="error" class="text-sm text-coral-600">{{ error }}</p>

        <button type="submit" class="btn-primary w-full">
          Envoyer le message
        </button>
      </form>
    </section>
  </div>
</template>
