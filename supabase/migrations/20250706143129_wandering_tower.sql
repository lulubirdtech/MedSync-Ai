/*
  # Fix patients table RLS policy

  1. Security
    - Add missing INSERT policy for patients table
    - Allow authenticated users to create their own patient profile
*/

-- Add INSERT policy for patients table
CREATE POLICY "Patients can create own profile"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);