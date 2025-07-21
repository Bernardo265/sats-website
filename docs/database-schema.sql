-- SafeSats Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  account_status TEXT DEFAULT 'pending_verification' CHECK (account_status IN ('pending_verification', 'active', 'suspended')),
  kyc_status TEXT DEFAULT 'not_started' CHECK (kyc_status IN ('not_started', 'pending', 'approved', 'rejected')),
  preferred_currency TEXT DEFAULT 'MWK' CHECK (preferred_currency IN ('MWK', 'USD')),
  timezone TEXT DEFAULT 'Africa/Blantyre',
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table for virtual trading
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  mwk_balance DECIMAL(15,2) DEFAULT 100000.00 CHECK (mwk_balance >= 0),
  btc_balance DECIMAL(16,8) DEFAULT 0.00000000 CHECK (btc_balance >= 0),
  total_value DECIMAL(15,2) DEFAULT 100000.00 CHECK (total_value >= 0),
  profit_loss DECIMAL(15,2) DEFAULT 0.00,
  profit_loss_percentage DECIMAL(8,4) DEFAULT 0.0000,
  initial_balance DECIMAL(15,2) DEFAULT 100000.00,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  losing_trades INTEGER DEFAULT 0,
  largest_gain DECIMAL(15,2) DEFAULT 0.00,
  largest_loss DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table for trading history
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('market', 'limit')),
  btc_amount DECIMAL(16,8) NOT NULL CHECK (btc_amount > 0),
  mwk_amount DECIMAL(15,2) NOT NULL CHECK (mwk_amount > 0),
  price DECIMAL(15,2) NOT NULL CHECK (price > 0),
  fee DECIMAL(15,2) DEFAULT 0.00 CHECK (fee >= 0),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for pending limit orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('limit', 'stop_loss', 'take_profit')),
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  price DECIMAL(15,2) NOT NULL CHECK (price > 0),
  trigger_price DECIMAL(15,2), -- For stop loss and take profit orders
  filled_amount DECIMAL(15,2) DEFAULT 0.00 CHECK (filled_amount >= 0),
  remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - filled_amount) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partially_filled', 'completed', 'cancelled', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price_history table for storing Bitcoin price data
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL DEFAULT 'BTC',
  price_usd DECIMAL(15,2) NOT NULL CHECK (price_usd > 0),
  price_mwk DECIMAL(15,2) NOT NULL CHECK (price_mwk > 0),
  usd_mwk_rate DECIMAL(10,4) NOT NULL CHECK (usd_mwk_rate > 0),
  volume_24h DECIMAL(20,2),
  market_cap DECIMAL(20,2),
  price_change_24h DECIMAL(15,2),
  price_change_percentage_24h DECIMAL(8,4),
  high_24h DECIMAL(15,2),
  low_24h DECIMAL(15,2),
  source TEXT DEFAULT 'coingecko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking user activity
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_total_value ON public.portfolios(total_value DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_profit_loss ON public.portfolios(profit_loss DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON public.transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_execution_time ON public.transactions(execution_time DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON public.orders(type);
CREATE INDEX IF NOT EXISTS idx_orders_price ON public.orders(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON public.orders(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_price_history_symbol ON public.price_history(symbol);
CREATE INDEX IF NOT EXISTS idx_price_history_created_at ON public.price_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_symbol_created ON public.price_history(symbol, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start ON public.user_sessions(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_start ON public.user_sessions(user_id, session_start DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolio" ON public.portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio" ON public.portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio" ON public.portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders" ON public.orders
  FOR DELETE USING (auth.uid() = user_id);

-- Price history policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view price history" ON public.price_history
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow service role to insert price data
CREATE POLICY "Service role can insert price data" ON public.price_history
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Enhanced transaction policies with additional security
CREATE POLICY "Users can view own transactions detailed" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions with validation" ON public.transactions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND btc_amount > 0
    AND mwk_amount > 0
    AND price > 0
  );

-- Enhanced order policies with business logic
CREATE POLICY "Users can view own orders detailed" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert valid orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND amount > 0
    AND price > 0
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Users can update own pending orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id
    AND status IN ('pending', 'partially_filled')
  );

CREATE POLICY "Users can cancel own orders" ON public.orders
  FOR DELETE USING (
    auth.uid() = user_id
    AND status IN ('pending', 'partially_filled')
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update portfolio statistics
CREATE OR REPLACE FUNCTION public.update_portfolio_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update portfolio statistics when a transaction is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.portfolios
    SET
      total_trades = total_trades + 1,
      winning_trades = CASE
        WHEN NEW.type = 'sell' AND NEW.mwk_amount > (
          SELECT COALESCE(AVG(mwk_amount), 0)
          FROM public.transactions
          WHERE user_id = NEW.user_id AND type = 'buy' AND status = 'completed'
        ) THEN winning_trades + 1
        ELSE winning_trades
      END,
      losing_trades = CASE
        WHEN NEW.type = 'sell' AND NEW.mwk_amount < (
          SELECT COALESCE(AVG(mwk_amount), 0)
          FROM public.transactions
          WHERE user_id = NEW.user_id AND type = 'buy' AND status = 'completed'
        ) THEN losing_trades + 1
        ELSE losing_trades
      END,
      largest_gain = CASE
        WHEN NEW.type = 'sell' AND profit_loss > largest_gain THEN profit_loss
        ELSE largest_gain
      END,
      largest_loss = CASE
        WHEN NEW.type = 'sell' AND profit_loss < largest_loss THEN profit_loss
        ELSE largest_loss
      END
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for portfolio statistics
CREATE TRIGGER update_portfolio_stats_trigger
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_portfolio_stats();

-- Create function to automatically create profile and portfolio on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, email_verified)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email_confirmed_at IS NOT NULL);

  -- Create initial portfolio
  INSERT INTO public.portfolios (user_id)
  VALUES (NEW.id);

  -- Create initial session record
  INSERT INTO public.user_sessions (user_id, session_start)
  VALUES (NEW.id, NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile email verification status
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles
    SET email_verified = TRUE
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email verification
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_verification();

-- Create function to process limit orders
CREATE OR REPLACE FUNCTION public.process_limit_orders(current_btc_price DECIMAL(15,2))
RETURNS TABLE(processed_order_id UUID, user_id UUID, order_type TEXT, amount DECIMAL(15,2)) AS $$
DECLARE
  order_record RECORD;
  transaction_id UUID;
BEGIN
  -- Process buy limit orders where current price <= order price
  FOR order_record IN
    SELECT * FROM public.orders
    WHERE status = 'pending'
    AND type = 'buy'
    AND order_type = 'limit'
    AND current_btc_price <= price
    ORDER BY price DESC, created_at ASC
  LOOP
    -- Create transaction
    INSERT INTO public.transactions (
      user_id, type, order_type, btc_amount, mwk_amount, price, order_id, status
    ) VALUES (
      order_record.user_id,
      order_record.type,
      order_record.order_type,
      order_record.amount / current_btc_price,
      order_record.amount,
      current_btc_price,
      order_record.id,
      'completed'
    ) RETURNING id INTO transaction_id;

    -- Update order status
    UPDATE public.orders
    SET status = 'completed', updated_at = NOW()
    WHERE id = order_record.id;

    -- Update portfolio
    UPDATE public.portfolios
    SET
      mwk_balance = mwk_balance - order_record.amount,
      btc_balance = btc_balance + (order_record.amount / current_btc_price),
      updated_at = NOW()
    WHERE user_id = order_record.user_id;

    -- Return processed order info
    processed_order_id := order_record.id;
    user_id := order_record.user_id;
    order_type := order_record.type;
    amount := order_record.amount;
    RETURN NEXT;
  END LOOP;

  -- Process sell limit orders where current price >= order price
  FOR order_record IN
    SELECT * FROM public.orders
    WHERE status = 'pending'
    AND type = 'sell'
    AND order_type = 'limit'
    AND current_btc_price >= price
    ORDER BY price ASC, created_at ASC
  LOOP
    -- Create transaction
    INSERT INTO public.transactions (
      user_id, type, order_type, btc_amount, mwk_amount, price, order_id, status
    ) VALUES (
      order_record.user_id,
      order_record.type,
      order_record.order_type,
      order_record.amount / order_record.price,
      order_record.amount,
      current_btc_price,
      order_record.id,
      'completed'
    ) RETURNING id INTO transaction_id;

    -- Update order status
    UPDATE public.orders
    SET status = 'completed', updated_at = NOW()
    WHERE id = order_record.id;

    -- Update portfolio
    UPDATE public.portfolios
    SET
      btc_balance = btc_balance - (order_record.amount / order_record.price),
      mwk_balance = mwk_balance + order_record.amount,
      updated_at = NOW()
    WHERE user_id = order_record.user_id;

    -- Return processed order info
    processed_order_id := order_record.id;
    user_id := order_record.user_id;
    order_type := order_record.type;
    amount := order_record.amount;
    RETURN NEXT;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to store price data
CREATE OR REPLACE FUNCTION public.store_price_data(
  p_symbol TEXT,
  p_price_usd DECIMAL(15,2),
  p_price_mwk DECIMAL(15,2),
  p_usd_mwk_rate DECIMAL(10,4),
  p_volume_24h DECIMAL(20,2) DEFAULT NULL,
  p_market_cap DECIMAL(20,2) DEFAULT NULL,
  p_price_change_24h DECIMAL(15,2) DEFAULT NULL,
  p_price_change_percentage_24h DECIMAL(8,4) DEFAULT NULL,
  p_high_24h DECIMAL(15,2) DEFAULT NULL,
  p_low_24h DECIMAL(15,2) DEFAULT NULL,
  p_source TEXT DEFAULT 'coingecko'
)
RETURNS UUID AS $$
DECLARE
  price_id UUID;
BEGIN
  INSERT INTO public.price_history (
    symbol, price_usd, price_mwk, usd_mwk_rate, volume_24h, market_cap,
    price_change_24h, price_change_percentage_24h, high_24h, low_24h, source
  ) VALUES (
    p_symbol, p_price_usd, p_price_mwk, p_usd_mwk_rate, p_volume_24h, p_market_cap,
    p_price_change_24h, p_price_change_percentage_24h, p_high_24h, p_low_24h, p_source
  ) RETURNING id INTO price_id;

  -- Clean up old price data (keep only last 30 days)
  DELETE FROM public.price_history
  WHERE symbol = p_symbol
  AND created_at < NOW() - INTERVAL '30 days';

  RETURN price_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate portfolio value
CREATE OR REPLACE FUNCTION public.calculate_portfolio_value(
  p_user_id UUID,
  p_current_btc_price DECIMAL(15,2)
)
RETURNS TABLE(
  total_value DECIMAL(15,2),
  profit_loss DECIMAL(15,2),
  profit_loss_percentage DECIMAL(8,4)
) AS $$
DECLARE
  portfolio_record RECORD;
  btc_value_mwk DECIMAL(15,2);
  calculated_total DECIMAL(15,2);
  calculated_profit_loss DECIMAL(15,2);
  calculated_percentage DECIMAL(8,4);
BEGIN
  -- Get current portfolio
  SELECT * INTO portfolio_record
  FROM public.portfolios
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Portfolio not found for user %', p_user_id;
  END IF;

  -- Calculate BTC value in MWK
  btc_value_mwk := portfolio_record.btc_balance * p_current_btc_price;

  -- Calculate total portfolio value
  calculated_total := portfolio_record.mwk_balance + btc_value_mwk;

  -- Calculate profit/loss
  calculated_profit_loss := calculated_total - portfolio_record.initial_balance;

  -- Calculate percentage
  calculated_percentage := (calculated_profit_loss / portfolio_record.initial_balance) * 100;

  -- Update portfolio with calculated values
  UPDATE public.portfolios
  SET
    total_value = calculated_total,
    profit_loss = calculated_profit_loss,
    profit_loss_percentage = calculated_percentage,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Return calculated values
  total_value := calculated_total;
  profit_loss := calculated_profit_loss;
  profit_loss_percentage := calculated_percentage;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create enhanced view for user dashboard data
CREATE OR REPLACE VIEW public.user_dashboard AS
SELECT
  p.id,
  p.full_name,
  p.email_verified,
  p.account_status,
  p.kyc_status,
  p.preferred_currency,
  p.last_login_at,
  p.created_at as member_since,
  port.mwk_balance,
  port.btc_balance,
  port.total_value,
  port.profit_loss,
  port.profit_loss_percentage,
  port.initial_balance,
  port.total_trades,
  port.winning_trades,
  port.losing_trades,
  port.largest_gain,
  port.largest_loss,
  CASE
    WHEN port.total_trades > 0 THEN ROUND((port.winning_trades::DECIMAL / port.total_trades) * 100, 2)
    ELSE 0
  END as win_rate_percentage,
  (SELECT COUNT(*) FROM public.orders WHERE user_id = p.id AND status = 'pending') as pending_orders,
  (SELECT COUNT(*) FROM public.orders WHERE user_id = p.id AND status IN ('pending', 'partially_filled')) as active_orders,
  (SELECT price_mwk FROM public.price_history WHERE symbol = 'BTC' ORDER BY created_at DESC LIMIT 1) as current_btc_price
FROM public.profiles p
LEFT JOIN public.portfolios port ON p.id = port.user_id
WHERE p.id = auth.uid();

-- Create view for trading history with enhanced data
CREATE OR REPLACE VIEW public.user_trading_history AS
SELECT
  t.id,
  t.type,
  t.order_type,
  t.btc_amount,
  t.mwk_amount,
  t.price,
  t.fee,
  t.status,
  t.execution_time,
  t.notes,
  t.created_at,
  o.id as order_id,
  o.expires_at as order_expires_at,
  CASE
    WHEN t.type = 'buy' THEN t.mwk_amount + COALESCE(t.fee, 0)
    ELSE t.mwk_amount - COALESCE(t.fee, 0)
  END as net_amount
FROM public.transactions t
LEFT JOIN public.orders o ON t.order_id = o.id
WHERE t.user_id = auth.uid()
ORDER BY t.execution_time DESC;

-- Create view for active orders
CREATE OR REPLACE VIEW public.user_active_orders AS
SELECT
  o.id,
  o.type,
  o.order_type,
  o.amount,
  o.price,
  o.trigger_price,
  o.filled_amount,
  o.remaining_amount,
  o.status,
  o.expires_at,
  o.created_at,
  o.updated_at,
  CASE
    WHEN o.expires_at IS NOT NULL AND o.expires_at < NOW() THEN true
    ELSE false
  END as is_expired
FROM public.orders o
WHERE o.user_id = auth.uid()
AND o.status IN ('pending', 'partially_filled')
ORDER BY o.created_at DESC;

-- Create view for price data with technical indicators
CREATE OR REPLACE VIEW public.btc_price_data AS
SELECT
  ph.id,
  ph.symbol,
  ph.price_usd,
  ph.price_mwk,
  ph.usd_mwk_rate,
  ph.volume_24h,
  ph.market_cap,
  ph.price_change_24h,
  ph.price_change_percentage_24h,
  ph.high_24h,
  ph.low_24h,
  ph.source,
  ph.created_at,
  LAG(ph.price_mwk) OVER (ORDER BY ph.created_at) as previous_price,
  CASE
    WHEN LAG(ph.price_mwk) OVER (ORDER BY ph.created_at) IS NOT NULL THEN
      ph.price_mwk - LAG(ph.price_mwk) OVER (ORDER BY ph.created_at)
    ELSE 0
  END as price_change,
  AVG(ph.price_mwk) OVER (ORDER BY ph.created_at ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as sma_7,
  AVG(ph.price_mwk) OVER (ORDER BY ph.created_at ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) as sma_30
FROM public.price_history ph
WHERE ph.symbol = 'BTC'
ORDER BY ph.created_at DESC;

-- Grant access to the views
GRANT SELECT ON public.user_dashboard TO authenticated;
GRANT SELECT ON public.user_trading_history TO authenticated;
GRANT SELECT ON public.user_active_orders TO authenticated;
GRANT SELECT ON public.btc_price_data TO authenticated;
