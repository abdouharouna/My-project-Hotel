import { supabase } from '../lib/supabase'
import type { Photo } from '../types/database'

// Récupère les photos d'un hôtel.
export async function fetchPhotosByHotelId(hotelId: number): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photo')
    .select('*')
    .eq('hotel_id', hotelId)

  if (error) throw error
  const rows = data ?? []
  console.log('[DIAG fetchPhotosByHotelId] hotelId =', hotelId, '| rows =', rows.length)
  return rows
}
