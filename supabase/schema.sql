-- Rupiyo — Household Financial Engine
-- Full schema with RLS policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- households
CREATE TABLE IF NOT EXISTS households (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT 'My Household',
  base_currency TEXT NOT NULL DEFAULT 'CAD',
  country       TEXT NOT NULL DEFAULT 'CA',
  fx_rates      JSONB NOT NULL DEFAULT '{}',
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER households_updated_at BEFORE UPDATE ON households FOR EACH ROW EXECUTE FUNCTION update_updated_at();
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages household" ON households FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- members
CREATE TABLE IF NOT EXISTS members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id    UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('primary','spouse','contributor','dependant')),
  color           TEXT NOT NULL DEFAULT '#C8A96E',
  avatar_initials TEXT,
  gross_annual    NUMERIC(12,2),
  tax_rate        NUMERIC(5,2),
  employer        TEXT,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members" ON members FOR ALL USING (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid())) WITH CHECK (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid()));

-- transactions
CREATE TABLE IF NOT EXISTS transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id    UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  member_id       UUID REFERENCES members(id) ON DELETE SET NULL,
  item            TEXT NOT NULL,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  flow            TEXT NOT NULL CHECK (flow IN ('In','Out','Invest')),
  treatment       TEXT NOT NULL CHECK (treatment IN ('Income','Fixed','Variable','Wealth')),
  frequency       TEXT NOT NULL CHECK (frequency IN ('Monthly','Weekly','Biweekly','Annual','One-time')),
  currency        TEXT NOT NULL DEFAULT 'CAD',
  native_amount   NUMERIC(14,2) NOT NULL,
  monthly_base    NUMERIC(14,2) NOT NULL DEFAULT 0,
  is_pre_deducted BOOLEAN NOT NULL DEFAULT FALSE,
  is_shared       BOOLEAN NOT NULL DEFAULT FALSE,
  country_flag    TEXT NOT NULL DEFAULT '🇨🇦',
  notes           TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  effective_from  DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to    DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_transactions_household ON transactions(household_id);
CREATE INDEX idx_transactions_member ON transactions(member_id);
CREATE INDEX idx_transactions_flow ON transactions(flow);
CREATE INDEX idx_transactions_active ON transactions(is_active) WHERE is_active = TRUE;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household transactions" ON transactions FOR ALL USING (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid())) WITH CHECK (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid()));

-- accounts
CREATE TABLE IF NOT EXISTS accounts (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id           UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  member_id              UUID REFERENCES members(id) ON DELETE SET NULL,
  account_name           TEXT NOT NULL,
  account_type           TEXT NOT NULL CHECK (account_type IN ('TFSA','RRSP','FHSA','401k','ISA','Non-Reg','Pension','Crypto','Property','Other')),
  institution            TEXT,
  current_balance        NUMERIC(16,2) NOT NULL DEFAULT 0,
  currency               TEXT NOT NULL DEFAULT 'CAD',
  all_time_return        NUMERIC(6,2),
  contribution_room      NUMERIC(14,2),
  annual_limit           NUMERIC(14,2),
  lifetime_limit         NUMERIC(14,2),
  is_tax_deductible      BOOLEAN NOT NULL DEFAULT FALSE,
  is_tax_free_growth     BOOLEAN NOT NULL DEFAULT FALSE,
  is_tax_free_withdrawal BOOLEAN NOT NULL DEFAULT FALSE,
  country                TEXT NOT NULL DEFAULT 'CA',
  notes                  TEXT,
  holdings               JSONB NOT NULL DEFAULT '[]',
  last_updated           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_accounts_household ON accounts(household_id);
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household accounts" ON accounts FOR ALL USING (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid())) WITH CHECK (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid()));

-- foreign_assets
CREATE TABLE IF NOT EXISTS foreign_assets (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id       UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  member_id          UUID REFERENCES members(id) ON DELETE SET NULL,
  asset_name         TEXT NOT NULL,
  asset_type         TEXT NOT NULL CHECK (asset_type IN ('Property','SIP','Gold','Vehicle','FD','Stock','Business','Other')),
  country            TEXT NOT NULL,
  currency           TEXT NOT NULL DEFAULT 'INR',
  current_value      NUMERIC(16,2),
  monthly_commitment NUMERIC(12,2) NOT NULL DEFAULT 0,
  purchase_value     NUMERIC(16,2),
  notes              TEXT,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER foreign_assets_updated_at BEFORE UPDATE ON foreign_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_foreign_assets_household ON foreign_assets(household_id);
ALTER TABLE foreign_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household foreign assets" ON foreign_assets FOR ALL USING (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid())) WITH CHECK (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid()));

-- action_items
CREATE TABLE IF NOT EXISTS action_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id     UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  priority         TEXT NOT NULL CHECK (priority IN ('HIGH','MEDIUM','LOW')) DEFAULT 'MEDIUM',
  status           TEXT NOT NULL CHECK (status IN ('TODO','IN_PROGRESS','DONE')) DEFAULT 'TODO',
  category         TEXT,
  potential_saving NUMERIC(12,2),
  due_date         DATE,
  completed_at     TIMESTAMPTZ,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER action_items_updated_at BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_action_items_household ON action_items(household_id);
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household action items" ON action_items FOR ALL USING (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid())) WITH CHECK (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid()));

-- projection_scenarios
CREATE TABLE IF NOT EXISTS projection_scenarios (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id   UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  annual_return  NUMERIC(5,2) NOT NULL DEFAULT 7,
  monthly_invest NUMERIC(12,2),
  start_age      INTEGER,
  target_age     INTEGER NOT NULL DEFAULT 65,
  target_amount  NUMERIC(16,2),
  is_default     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projection_scenarios_household ON projection_scenarios(household_id);
ALTER TABLE projection_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household projections" ON projection_scenarios FOR ALL USING (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid())) WITH CHECK (household_id IN (SELECT id FROM households WHERE owner_id = auth.uid()));

-- Auto-create household on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.households (owner_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Household'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
