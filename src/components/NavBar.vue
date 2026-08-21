<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, signOut } = useAuth()

const mobileOpen = ref(false)
const scrolled = ref(false)
const signingOut = ref(false)

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

// Ferme le menu mobile au changement de page.
watch(() => route.fullPath, () => { mobileOpen.value = false })

async function handleSignOut() {
  signingOut.value = true
  try {
    await signOut()
    router.replace('/')
  } finally {
    signingOut.value = false
    mobileOpen.value = false
  }
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isTransparent ? 'bg-transparent py-5' : 'bg-white/95 backdrop-blur-md py-3 shadow-soft',
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
            class="relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-coral-400 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
            :class="
              isTransparent
                ? 'text-white/90 hover:text-white'
                : 'text-lagoon-700 hover:text-coral-500'
            "
            active-class="!text-coral-400 after:!w-full"
          >
            {{ link.label }}
          </RouterLink>
        </li>

        <!-- Liens d'authentification -->
        <li v-if="!user" class="ml-2">
          <RouterLink
            to="/connexion"
            class="text-sm font-medium transition-colors"
            :class="isTransparent ? 'text-white/90 hover:text-white' : 'text-lagoon-700 hover:text-coral-500'"
          >
            Connexion
          </RouterLink>
        </li>
        <li v-if="!user">
          <RouterLink to="/inscription" class="btn-primary !px-5 !py-2 text-xs">
            Inscription
          </RouterLink>
        </li>

        <li v-if="user" class="ml-2">
          <RouterLink
            to="/mon-compte"
            class="text-sm font-medium transition-colors"
            :class="isTransparent ? 'text-white/90 hover:text-white' : 'text-lagoon-700 hover:text-coral-500'"
            active-class="!text-coral-400"
          >
            Mon compte
          </RouterLink>
        </li>
        <li v-if="user">
          <button
            class="text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 rounded"
            :class="isTransparent ? 'text-white/90 hover:text-white' : 'text-lagoon-700 hover:text-coral-500'"
            :disabled="signingOut"
            @click="handleSignOut"
          >
            Déconnexion
          </button>
        </li>
      </ul>

      <!-- Burger -->
      <button
        class="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 rounded"
        :aria-label="mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        :aria-expanded="mobileOpen"
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
        class="absolute top-full left-0 right-0 flex flex-col gap-1 bg-white px-6 py-4 shadow-soft md:hidden"
      >
        <li v-for="link in links" :key="link.to">
          <RouterLink
            :to="link.to"
            class="block py-2.5 font-medium text-lagoon-700 transition-colors hover:text-coral-500 focus:outline-none focus-visible:text-coral-500"
            active-class="text-coral-500"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </li>

        <li class="my-1 border-t border-lagoon-50"></li>

        <li v-if="!user">
          <RouterLink
            to="/connexion"
            class="block py-2.5 font-medium text-lagoon-700 hover:text-coral-500"
            @click="mobileOpen = false"
          >
            Connexion
          </RouterLink>
        </li>
        <li v-if="!user">
          <RouterLink
            to="/inscription"
            class="block py-2.5 font-medium text-lagoon-700 hover:text-coral-500"
            @click="mobileOpen = false"
          >
            Inscription
          </RouterLink>
        </li>

        <li v-if="user">
          <RouterLink
            to="/mon-compte"
            class="block py-2.5 font-medium text-lagoon-700 hover:text-coral-500"
            @click="mobileOpen = false"
          >
            Mon compte
          </RouterLink>
        </li>
        <li v-if="user">
          <button
            class="block w-full py-2.5 text-left font-medium text-lagoon-700 hover:text-coral-500"
            :disabled="signingOut"
            @click="handleSignOut"
          >
            Déconnexion
          </button>
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
