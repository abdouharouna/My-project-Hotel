import { supabase } from '../lib/supabase'
import type { TypeChambre } from '../types/database'

// Récupère les types de chambres d'un hôtel.
export async function fetchChambresByHotelId(hotelId: number): Promise<TypeChambre[]> {
  const { data, error } = await supabase
    .from('type_chambre')
    .select('*')
    .eq('hotel_id', hotelId)
    .order('tarif_nuit', { ascending: true })

  if (error) throw error

  const rows = data ?? []

  console.log(
    '[DIAG fetchChambresByHotelId] hotelId =',
    hotelId,
    '| rows =',
    rows.length
  )

  return rows
}