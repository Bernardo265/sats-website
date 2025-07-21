# SafeSats Supabase Setup Guide

This guide will help you set up Supabase for the SafeSats project, including database schema, authentication, and real-time features.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- SafeSats project cloned locally

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: SafeSats
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

1. In your SafeSats project root, copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `docs/database-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `profiles` table for user profiles
- `portfolios` table for virtual trading portfolios
- `transactions` table for trading history
- `orders` table for pending limit orders
- Row Level Security (RLS) policies
- Triggers for automatic timestamps
- Functions for user signup handling

## Step 5: Configure Authentication

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure the following settings:

### Email Settings
- **Enable email confirmations**: ON
- **Confirm email change**: ON
- **Enable email change**: ON

### URL Configuration
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: Add your production domain when deploying

### Email Templates (Optional)
You can customize the email templates in **Authentication** > **Email Templates**:
- Confirm signup
- Reset password
- Magic link
- Change email address

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to `/start-trading` and try to register a new account
3. Check your email for the verification link
4. Verify that the user appears in **Authentication** > **Users**
5. Check that the profile and portfolio are created in **Table Editor**

## Step 7: Configure Real-time (Optional)

Real-time updates are already configured in the code. To verify:

1. Go to **Database** > **Replication** in Supabase
2. Ensure replication is enabled for your tables:
   - `profiles`
   - `portfolios`
   - `transactions`
   - `orders`

## Step 8: Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Add your production domain to **Authentication** > **URL Configuration**
3. Update CORS settings if needed
4. Consider enabling additional security features

## Database Schema Overview

### Tables

#### `profiles`
- Extends `auth.users` with additional user information
- Stores full name, phone, verification status
- Linked to user ID from Supabase Auth

#### `portfolios`
- Virtual trading portfolio for each user
- Tracks MWK balance, BTC balance, profit/loss
- Updated in real-time with trading activity

#### `transactions`
- Complete history of all trades
- Stores buy/sell transactions with amounts and prices
- Immutable record for audit purposes

#### `orders`
- Pending limit orders
- Can be cancelled by users
- Automatically cleaned up when executed

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Policies enforce data isolation
- Automatic user profile creation on signup

## Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check that your environment variables are correct
   - Ensure you're using the anon key, not the service role key

2. **"Row Level Security policy violation"**
   - Verify that RLS policies are set up correctly
   - Check that the user is authenticated

3. **Email verification not working**
   - Check your email settings in Supabase
   - Verify SMTP configuration if using custom email

4. **Real-time updates not working**
   - Ensure replication is enabled for your tables
   - Check browser console for WebSocket errors

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

After setting up Supabase:

1. Test all authentication flows
2. Verify trading simulation works
3. Test real-time updates
4. Set up monitoring and analytics
5. Configure backup strategies
6. Plan for scaling and performance optimization

Your SafeSats application is now powered by Supabase with:
- ✅ User authentication and email verification
- ✅ Secure database with RLS
- ✅ Real-time trading simulation
- ✅ Scalable architecture
- ✅ Production-ready setup
