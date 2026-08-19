<script setup lang="ts">
const year = new Date().getFullYear()
const links = [
  { to: '/', label: 'Accueil' },
  { to: '/hotels', label: 'Hôtels' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <footer class="bg-lagoon-800 text-sand-100">
    <div class="mx-auto max-w-7xl px-6 py-16">
      <div class="grid gap-10 md:grid-cols-3">
        <div>
          <p class="font-serif text-2xl font-semibold text-white">
            May<span class="text-coral-400">Hotels</span>
          </p>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-sand-100/70">
            La plateforme de découverte et de réservation des hôtels de Mayotte,
            l'île aux parfums de l'océan Indien.
          </p>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-sand-100/50">Navigation</p>
          <ul class="mt-4 space-y-2">
            <li v-for="link in links" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-sm text-sand-100/80 transition-colors hover:text-coral-400"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-sand-100/50">Contact</p>
          <ul class="mt-4 space-y-2 text-sm text-sand-100/80">
            <li>Mamoudzou, Mayotte</li>
            <li>contact@mayhotels.fr</li>
            <li>+262 2 69 00 00 00</li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-white/10 pt-6 text-center text-xs text-sand-100/50">
        © {{ year }} MayHotels — Tous droits réservés.
      </div>
    </div>
  </footer>
</template>
