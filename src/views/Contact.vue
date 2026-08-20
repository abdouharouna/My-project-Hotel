<script setup lang="ts">
import { ref, computed } from 'vue'

const form = ref({
  nom: '',
  email: '',
  message: '',
})

const sent = ref(false)
const error = ref('')

const canSubmit = computed(() =>
  Boolean(form.value.nom && form.value.email && form.value.message)
)

function submit() {
  error.value = ''
  if (!canSubmit.value) {
    error.value = 'Merci de remplir tous les champs.'
    return
  }
  // Pour l'instant, le formulaire n'est pas enregistré en base.
  sent.value = true
}

function reset() {
  form.value = { nom: '', email: '', message: '' }
  sent.value = false
}
</script>

<template>
  <div class="min-h-screen bg-sand-50 pt-20">
    <!-- En-tête -->
    <section class="mx-auto max-w-3xl px-6 pt-20 text-center">
      <p class="mb-2 text-sm font-medium uppercase tracking-widest text-coral-500">
        Une question ?
      </p>
      <h1 class="font-serif text-4xl font-semibold text-lagoon-800 md:text-5xl">
        Contactez-nous
      </h1>
      <p class="mx-auto mt-4 max-w-md leading-relaxed text-lagoon-600">
        Notre équipe vous répondra dans les meilleurs délais.
      </p>
    </section>

    <section class="mx-auto max-w-xl px-6 py-16">
      <!-- Confirmation -->
      <div
        v-if="sent"
        class="rounded-2xl bg-white p-8 text-center shadow-card"
      >
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral-50">
          <svg class="h-7 w-7 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="font-serif text-xl font-semibold text-lagoon-800">Message envoyé !</h2>
        <p class="mt-2 text-sm text-lagoon-600">Merci, nous reviendrons vers vous très vite.</p>
        <button class="mt-6 text-sm font-semibold text-coral-500 transition-colors hover:text-coral-600" @click="reset">
          Envoyer un autre message
        </button>
      </div>

      <!-- Formulaire -->
      <form v-else class="space-y-5" @submit.prevent="submit">
        <div>
          <label for="nom" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
            Nom
          </label>
          <input
            id="nom"
            v-model="form.nom"
            type="text"
            class="field"
            placeholder="Votre nom"
            autocomplete="name"
          />
        </div>

        <div>
          <label for="email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="field"
            placeholder="vous@email.com"
            autocomplete="email"
          />
        </div>

        <div>
          <label for="message" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lagoon-500">
            Message
          </label>
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            class="field"
            placeholder="Votre message..."
          />
        </div>

        <p v-if="error" class="text-sm text-coral-600" role="alert">{{ error }}</p>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="!canSubmit"
          :class="!canSubmit ? 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-soft' : ''"
        >
          Envoyer le message
        </button>
      </form>
    </section>
  </div>
</template>
