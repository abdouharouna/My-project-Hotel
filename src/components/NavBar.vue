<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

// La navbar est transparente seulement sur la page d'accueil, au-dessus du hero.
const isTransparent = computed(() => route.name === 'home' && !scrolled.value)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/hotels', label: 'Hôtels' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isTransparent ? 'bg-transparent py-5' : 'bg-white/95 backdrop-blur py-3 shadow-soft',
    ]"
  >
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-6">
      <RouterLink to="/" class="group flex items-center gap-2" @click="mobileOpen = false">
        <span
          class="font-serif text-2xl font-semibold tracking-tight transition-colors"
          :class="isTransparent ? 'text-white' : 'text-lagoon-700'"
        >
          May<span class="text-coral-400">Hotels</span>
        </span>
      </RouterLink>

      <!-- Desktop -->
      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="link in links" :key="link.to">
          <RouterLink
            :to="link.to"
            class="relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-coral-400 after:transition-all after:duration-300 hover:after:w-full"
            :class="
              isTransparent
                ? 'text-white/90 hover:text-white'
                : 'text-lagoon-700 hover:text-coral-500'
            "
            active-class="!text-coral-400"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>

      <!-- Burger -->
      <button
        class="md:hidden flex flex-col gap-1.5 p-2"
        :aria-label="mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="mobileOpen = !mobileOpen"
      >
        <span
          class="block h-0.5 w-6 transition-all duration-300"
          :class="[
            isTransparent ? 'bg-white' : 'bg-lagoon-700',
            mobileOpen ? 'translate-y-2 rotate-45' : '',
          ]"
        />
        <span
          class="block h-0.5 w-6 transition-all duration-300"
          :class="[isTransparent ? 'bg-white' : 'bg-lagoon-700', mobileOpen ? 'opacity-0' : '']"
        />
        <span
          class="block h-0.5 w-6 transition-all duration-300"
          :class="[
            isTransparent ? 'bg-white' : 'bg-lagoon-700',
            mobileOpen ? '-translate-y-2 -rotate-45' : '',
          ]"
        />
      </button>
    </nav>

    <!-- Mobile -->
    <Transition name="slide">
      <ul
        v-if="mobileOpen"
        class="absolute top-full left-0 right-0 flex flex-col gap-2 bg-white px-6 py-4 shadow-soft md:hidden"
      >
        <li v-for="link in links" :key="link.to">
          <RouterLink
            :to="link.to"
            class="block py-2 font-medium text-lagoon-700 hover:text-coral-500"
            active-class="text-coral-500"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </Transition>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
