-- Policy to allow public SELECT on the `hotel` table
-- Paste this into Supabase Dashboard → SQL Editor and run.

-- Autorise la lecture publique de toutes les lignes
CREATE POLICY "Allow anon select on hotel" ON public.hotel
  FOR SELECT
  USING ( true );

-- Option alternative: autoriser uniquement les hôtels validés
-- CREATE POLICY "Allow anon select validated hotels" ON public.hotel
--   FOR SELECT
--   USING ( statut_validation = 'valide' );

-- Note de sécurité:
--  - Cette policy permet à n'importe qui (rôle anon) de lire la table `hotel`.
--  - Préférez la seconde option si vous souhaitez exposer uniquement les lignes "valides".
--  - Ne stockez pas de données sensibles dans les champs accessibles publiquement.

-- Policies additionnelles pour tester les autres sections (type_chambre, photo, avis, equipement)
-- Ajoutez ces règles dans Supabase → SQL Editor et exécutez pour permettre les SELECT publics.

-- Autorise la lecture publique de la table `type_chambre`
CREATE POLICY "Allow anon select on type_chambre" ON public.type_chambre
  FOR SELECT
  USING ( true );

-- Autorise la lecture publique de la table `photo`
CREATE POLICY "Allow anon select on photo" ON public.photo
  FOR SELECT
  USING ( true );

-- Autorise la lecture publique de la table `avis`
CREATE POLICY "Allow anon select on avis" ON public.avis
  FOR SELECT
  USING ( true );

-- Si vous joignez `utilisateur` dans les requêtes (avis -> utilisateur), autorisez aussi la lecture:
CREATE POLICY "Allow anon select on utilisateur" ON public.utilisateur
  FOR SELECT
  USING ( true );

-- Autorise la lecture publique des équipements et de la table de liaison hotel_equipement
CREATE POLICY "Allow anon select on equipement" ON public.equipement
  FOR SELECT
  USING ( true );

CREATE POLICY "Allow anon select on hotel_equipement" ON public.hotel_equipement
  FOR SELECT
  USING ( true );

-- Sécurité: ces policies ouvrent la lecture à tout le monde (rôle anon). Pour production,
-- restreignez les règles (ex: `USING ( statut_validation = 'valide' )`) ou exposez uniquement
-- les colonnes non sensibles via des vues.
