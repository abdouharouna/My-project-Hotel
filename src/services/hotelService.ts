import { supabase } from '../lib/supabase'
import type { Hotel } from '../types/database'

// Récupère tous les hôtels validés (visibles publiquement).
export async function fetchHotels(): Promise<Hotel[]> {
  // TEMPORAIRE : filtre statut_validation retiré pour tester l'affichage de toutes les lignes.
  const { data, error } = await supabase
    .from('hotel')
    .select('*')
    .order('nom', { ascending: true })

  console.log('[DIAG fetchHotels] data =', data)
  console.log('[DIAG fetchHotels] data type =', typeof data, '| isArray =', Array.isArray(data), '| length =', data?.length)
  console.log('[DIAG fetchHotels] error =', error)

  if (error) throw error
  return data ?? []
}

// Récupère un hôtel par son ID (BIGINT).
export async function fetchHotelById(id: number): Promise<Hotel | null> {
  const { data, error } = await supabase
    .from('hotel')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

// Récupère les hôtels d'une commune donnée.
export async function fetchHotelsByCommune(commune: string): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('hotel')
    .select('*')
    .eq('statut_validation', 'valide')
    .eq('commune', commune)
    .order('nom', { ascending: true })

  if (error) throw error
  return data ?? []
}

// Récupère la liste distincte des communes ayant des hôtels validés.
export async function fetchCommunes(): Promise<string[]> {
  const { data, error } = await supabase
    .from('hotel')
    .select('commune')
    .eq('statut_validation', 'valide')

  if (error) throw error

  const communes = (data ?? [])
    .map((row) => row.commune)
    .filter((c): c is string => Boolean(c))
  return Array.from(new Set(communes)).sort()
}
