/*
  # Complete MedSync AI Database Schema

  1. New Tables
    - `users` - User profiles and authentication
    - `patients` - Patient-specific data and medical history  
    - `doctors` - Doctor profiles and specialties
    - `appointments` - Scheduling and consultation management
    - `agent_sessions` - Multi-agent interaction logs
    - `vitals` - Patient vital signs tracking
    - `prescriptions` - Medication management
    - `remedies` - Natural remedy recommendations
    - `transactions` - Payment and marketplace data
    - `agent_logs` - Detailed agent operation logs
    - `doctor_notes` - Clinical notes and summaries
    - `snowflake_sync_jobs` - Analytics sync tracking

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for role-based access
    - Secure patient data with proper isolation

  3. Indexes
    - Performance indexes on frequently queried columns
    - Foreign key constraints with CASCADE deletes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  name text NOT NULL,
  locale text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  dob date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  medical_history jsonb DEFAULT '{}',
  preferences jsonb DEFAULT '{}',
  emergency_contact jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialty text NOT NULL,
  languages text[] DEFAULT ARRAY['en'],
  license_number text,
  profile_data jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  livekit_room text,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent sessions table
CREATE TABLE IF NOT EXISTS agent_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_type text NOT NULL,
  input_text text NOT NULL,
  output_text text DEFAULT '',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  metadata jsonb DEFAULT '{}',
  confidence_score decimal(3,2),
  created_at timestamptz DEFAULT now()
);

-- Vitals table
CREATE TABLE IF NOT EXISTS vitals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('blood_pressure', 'heart_rate', 'temperature', 'weight', 'height', 'oxygen_saturation')),
  value decimal NOT NULL,
  unit text NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  recorded_by uuid REFERENCES users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medication text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  instructions text,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  issued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Remedies table
CREATE TABLE IF NOT EXISTS remedies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  natural_remedy text NOT NULL,
  details jsonb DEFAULT '{}',
  category text CHECK (category IN ('herbal', 'dietary', 'lifestyle', 'exercise')),
  effectiveness_rating integer CHECK (effectiveness_rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES agent_sessions(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_naira decimal(10,2),
  amount_usd decimal(10,2),
  currency text DEFAULT 'NGN' CHECK (currency IN ('NGN', 'USD')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text CHECK (payment_method IN ('paystack', 'stripe')),
  payment_reference text UNIQUE,
  items jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  log_level text DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warn', 'error')),
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  timestamp timestamptz DEFAULT now()
);

-- Doctor notes table
CREATE TABLE IF NOT EXISTS doctor_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary text NOT NULL,
  diagnosis text,
  treatment_plan text,
  actions jsonb DEFAULT '[]',
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Snowflake sync jobs table
CREATE TABLE IF NOT EXISTS snowflake_sync_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name text NOT NULL,
  last_sync_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  records_synced integer DEFAULT 0,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE snowflake_sync_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Patients can read own data" ON patients
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Patients can update own data" ON patients
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can read patient data" ON patients
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'doctor'
    )
  );

-- RLS Policies for doctors
CREATE POLICY "Doctors can read own profile" ON doctors
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update own profile" ON doctors
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read verified doctors" ON doctors
  FOR SELECT TO authenticated
  USING (is_verified = true);

-- RLS Policies for appointments
CREATE POLICY "Users can read own appointments" ON appointments
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- RLS Policies for agent_sessions
CREATE POLICY "Users can read own sessions" ON agent_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions" ON agent_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON agent_sessions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for vitals
CREATE POLICY "Patients can read own vitals" ON vitals
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can read patient vitals" ON vitals
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'doctor'
    )
  );

CREATE POLICY "Healthcare providers can insert vitals" ON vitals
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = patient_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('doctor', 'admin')
    )
  );

-- RLS Policies for prescriptions
CREATE POLICY "Patients can read own prescriptions" ON prescriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can read own prescriptions" ON prescriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = doctor_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'doctor'
    )
  );

-- RLS Policies for transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for agent_logs
CREATE POLICY "Users can read session logs" ON agent_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_sessions 
      WHERE agent_sessions.id = session_id 
      AND agent_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for doctor_notes
CREATE POLICY "Doctors can read own notes" ON doctor_notes
  FOR SELECT TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can read notes from their appointments" ON doctor_notes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointments.id = appointment_id 
      AND appointments.patient_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create notes" ON doctor_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = doctor_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'doctor'
    )
  );

-- RLS Policies for snowflake_sync_jobs (admin only)
CREATE POLICY "Admins can manage sync jobs" ON snowflake_sync_jobs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_user_id ON agent_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent_type ON agent_sessions(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_started_at ON agent_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_vitals_patient_id ON vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_vitals_recorded_at ON vitals(recorded_at);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_session_id ON agent_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_appointment_id ON doctor_notes(appointment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctor_notes_updated_at BEFORE UPDATE ON doctor_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_snowflake_sync_jobs_updated_at BEFORE UPDATE ON snowflake_sync_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();