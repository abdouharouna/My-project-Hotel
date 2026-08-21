import { ref, readonly } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// État global de l'authentification, partagé entre tous les composants.
const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)

let initialized = false

function init() {
  if (initialized) return
  initialized = true

  // Récupère la session existante au chargement (persistée après actualisation).
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    user.value = data.session?.user ?? null
    loading.value = false
  })

  // Réagit aux changements d'état (connexion / déconnexion / refresh).
  // Le callback est synchrone : on encapsule le travail asynchrone.
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user ?? null
    loading.value = false
  })
}

export function useAuth() {
  init()

  async function signUp(nom: string, email: string, password: string) {
    // Le nom est stocké dans les métadonnées utilisateur (pas en base publique).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom } },
    })
    if (error) throw error
    return data
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Nom affichable : depuis les métadonnées, sinon l'email, sinon "Utilisateur".
  const displayName = () => {
    const nom = user.value?.user_metadata?.nom as string | undefined
    if (nom) return nom
    const email = user.value?.email
    if (email) return email.split('@')[0]
    return 'Utilisateur'
  }

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    signUp,
    signIn,
    signOut,
    displayName,
  }
}
