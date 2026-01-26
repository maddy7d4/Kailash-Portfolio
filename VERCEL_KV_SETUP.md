# Upstash Redis Setup Guide

This project uses **Upstash Redis** (serverless Redis database) for storing feedback data. This is the recommended solution for Vercel deployments as it's:
- ✅ Fast (Redis-based, sub-millisecond latency)
- ✅ Serverless-friendly (works perfectly with Vercel's serverless functions)
- ✅ Persistent (data survives deployments)
- ✅ Scalable (handles high traffic automatically)
- ✅ Free tier available (10,000 requests/day)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Upstash Redis Database

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab or **Integrations**
4. Click **Browse Marketplace** or **Add Integration**
5. Search for "Upstash Redis" or "Redis"
6. Click **Add Integration** → **Create Database**
7. Give it a name (e.g., "feedback-db")
8. Select a region close to your users
9. Vercel will automatically add the environment variables

**Option B: Via Upstash Console**

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token
4. Add them to your Vercel project environment variables

### 3. Configure Environment Variables

Vercel automatically provides these environment variables when you create a KV store:
- `KV_REST_API_URL` - The REST API URL for your KV store
- `KV_REST_API_TOKEN` - The authentication token
- `KV_REST_API_READ_ONLY_TOKEN` - Read-only token (optional)

**The code automatically uses these variables!** No additional configuration needed.

**For Local Development:**

Create a `.env.local` file in the root directory:

```env
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your_kv_token
```

You can find these values in:
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Or your KV store settings in Vercel

### 4. Deploy

Once the environment variables are set, deploy to Vercel:

```bash
vercel deploy
```

Or push to your connected Git repository and Vercel will auto-deploy.

## How It Works

- Feedback is stored in Upstash Redis using the key `feedback:all`
- All feedback entries are stored as a JSON array
- The database operations are async and optimized for serverless functions
- Data persists across deployments and function invocations
- Uses REST API (no connection pooling needed for serverless)

## Pricing

- **Free Tier**: 10,000 commands/day, 256 MB storage
- **Pay-as-you-go**: $0.20 per 100K commands, $0.10 per GB storage

Perfect for a portfolio feedback form!

## Alternative Database Options

If you prefer a different database, here are other options that work well with Vercel:

1. **MongoDB Atlas** - Free tier available, works great with Prisma
2. **Supabase** - PostgreSQL-based, excellent for complex queries
3. **Vercel Postgres** - Native Vercel integration, SQL-based

The current implementation can be easily swapped to any of these if needed.
