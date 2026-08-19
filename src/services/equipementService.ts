import { supabase } from '../lib/supabase'
import type { Equipement } from '../types/database'

// Récupère les équipements d'un hôtel via la table de liaison hotel_equipement.
export async function fetchEquipementsByHotelId(hotelId: number): Promise<Equipement[]> {
  const { data, error } = await supabase
    .from('hotel_equipement')
    .select('equipement(*)')
    .eq('hotel_id', hotelId)

  if (error) throw error

  const equipements: Equipement[] = (data ?? [])
    .map((row: any) => row.equipement)
    .filter((e: any): e is Equipement => Boolean(e))

  console.log('[DIAG fetchEquipementsByHotelId] hotelId =', hotelId, '| rows =', equipements.length)
  return equipements
}

// Récupère tous les équipements (pour les filtres).
export async function fetchAllEquipements(): Promise<Equipement[]> {
  const { data, error } = await supabase
    .from('equipement')
    .select('*')
    .order('nom', { ascending: true })

  if (error) throw error
  return data ?? []
}
