// Types reflétant les tables de la base Supabase existante.
// Les IDs sont des BIGINT (nombres), pas des UUID.

export interface Hotel {
  id: number
  nom: string
  description: string | null
  commune: string
  adresse: string | null
  latitude: number | null
  longitude: number | null
  statut_validation: string | null
}

export interface TypeChambre {
  id: number
  hotel_id: number
  nom: string | null
  description: string | null
  capacite: number | null
  tarif_nuit: number | null
}

export interface Disponibilite {
  id: number
  type_chambre_id: number
  date: string
  disponible: boolean | null
}

export interface Equipement {
  id: number
  nom: string | null
  description: string | null
}

export interface HotelEquipement {
  id: number
  hotel_id: number
  equipement_id: number
  equipement?: Equipement
}

export interface Utilisateur {
  id: number
  nom: string | null
  email: string | null
}

export interface Reservation {
  id: number
  utilisateur_id: number
  type_chambre_id: number
  date_arrivee: string | null
  date_depart: string | null
  statut: string | null
}

export interface Paiement {
  id: number
  reservation_id: number
  montant: number | null
  statut: string | null
  date_paiement: string | null
}

export interface Avis {
  id: number
  hotel_id: number
  utilisateur_id: number
  reservation_id: number | null
  note: number | null
  commentaire: string | null
  date_creation: string | null
  utilisateur?: Utilisateur
}

export interface Photo {
  id: number
  hotel_id: number
  url: string | null
  legende: string | null
}
