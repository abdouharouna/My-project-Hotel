import { supabase } from '../lib/supabase'
import type { Avis } from '../types/database'

// Récupère les avis d'un hôtel, avec le nom de l'utilisateur.
export async function fetchAvisByHotelId(hotelId: number): Promise<Avis[]> {
  const { data, error } = await supabase
    .from('avis')
    .select('*, utilisateur(*)')
    .eq('hotel_id', hotelId)
    .order('date_creation', { ascending: false })

  if (error) throw error
  const rows = data ?? []
  console.log('[DIAG fetchAvisByHotelId] hotelId =', hotelId, '| rows =', rows.length)
  return rows
}

// Calcule la note moyenne d'un hôtel à partir de ses avis.
export function noteMoyenne(avis: Avis[]): number | null {
  const notes = avis.map((a) => a.note).filter((n): n is number => typeof n === 'number')
  if (notes.length === 0) return null
  return notes.reduce((sum, n) => sum + n, 0) / notes.length
}
