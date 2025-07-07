/*
  # Fix appointments-doctors relationship

  1. Database Changes
    - Add proper foreign key constraint between appointments.doctor_id and doctors.user_id
    - This will allow Supabase to properly join the tables in queries

  2. Security
    - No RLS changes needed as existing policies are sufficient
*/

-- Add foreign key constraint between appointments.doctor_id and doctors.user_id
DO $$
BEGIN
  -- First, check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'appointments_doctor_id_doctors_fkey'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE appointments 
    ADD CONSTRAINT appointments_doctor_id_doctors_fkey 
    FOREIGN KEY (doctor_id) REFERENCES doctors(user_id) ON DELETE CASCADE;
  END IF;
END $$;