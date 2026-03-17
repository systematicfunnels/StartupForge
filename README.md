<div align="center">

# 🚀 StartupForge

> **AI-Powered Business Blueprint Generator**
>
> Transform any startup idea into a complete, structured 10-section business blueprint in minutes. Powered by cutting-edge AI (GPT-4o, Gemini, or Groq).

[![Live Demo](https://img.shields.io/badge/Live%20Demo-startup--forge--two.vercel.app-00D084?style=for-the-badge&logo=vercel)](https://startup-forge-two.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Database](#database)
- [AI Providers](#ai-providers)
- [Billing & Payments](#billing--payments)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 About

**StartupForge** is an AI-powered SaaS application that helps entrepreneurs turn rough startup ideas into comprehensive, actionable business blueprints.

With a single click, users get:
- 📊 **Market Analysis** - Size, growth trends, opportunities
- 💰 **Monetization Strategy** - Revenue models and pricing
- 🎯 **MVP Definition** - Core features for launch
- 🚀 **Go-to-Market Plan** - Customer acquisition strategy
- 📈 **Financial Projections** - Revenue forecasts
- 🏢 **Organizational Structure** - Team requirements
- ⚠️ **Risk Analysis** - Potential challenges
- 🔄 **Competitive Landscape** - Market positioning
- 🎨 **User Experience Flow** - Customer journey
- 📋 **Implementation Roadmap** - Timeline and milestones

Perfect for:
- 🚀 First-time founders validating ideas
- 💼 Business strategists planning new ventures
- 📈 Investors evaluating startup potential
- 🎯 Product managers defining product scope
- 📊 Consultants assisting clients

---

## ✨ Features

### 🤖 AI-Powered Generation
- ✅ **Multiple AI Providers** - OpenAI GPT-4o, Google Gemini, Groq
- ✅ **Instant Blueprints** - Generate 10-section business plans
- ✅ **Real-time Streaming** - Server-sent events (SSE) for progress updates
- ✅ **Regeneration** - Refine individual sections
- ✅ **Smart Prompts** - Context-aware AI generation
- ✅ **Streaming Response** - Watch your blueprint build in real-time

### 📄 Document Management
- ✅ **Export to PDF** - Professional formatted reports
- ✅ **Markdown Export** - Share as markdown files
- ✅ **History Tracking** - Save all generated blueprints
- ✅ **Version Control** - Compare different versions
- ✅ **Team Sharing** - Share blueprints with team members

### 💳 Subscription & Billing
- ✅ **Multiple Plans** - Starter, Pro, Agency
- ✅ **Stripe Integration** - Secure payments
- ✅ **Usage Limits** - Control per-plan features
- ✅ **Billing Portal** - Self-service subscription management
- ✅ **Webhook Support** - Real-time billing updates
- ✅ **Credit System** - Token-based generation limits

### 🔐 Authentication & Security
- ✅ **Clerk Authentication** - Modern auth with SSO
- ✅ **Email & Google Login** - Multiple sign-in options
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Security Headers** - Helmet.js protection
- ✅ **CORS Configuration** - Safe cross-origin requests
- ✅ **Data Encryption** - Secure sensitive information

### 📱 User Experience
- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Dark Mode Support** - Eye-friendly interface
- ✅ **Loading States** - Smooth UX during generation
- ✅ **Error Handling** - Clear error messages
- ✅ **Pagination** - Easy blueprint browsing
- ✅ **Search & Filter** - Find blueprints quickly

### ⚡ Performance
- ✅ **Server-Side Rendering** - Fast initial page load
- ✅ **Image Optimization** - Automatic image optimization
- ✅ **Code Splitting** - Lazy loading of components
- ✅ **Caching Strategy** - API response caching
- ✅ **Database Indexing** - Fast queries
- ✅ **CDN Ready** - Vercel deployment optimized

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React framework |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.5.2 | Type safety |
| **Tailwind CSS** | 3.4.4 | Styling |
| **Clerk** | 7.0.1 | Authentication |
| **jsPDF** | 4.2.0 | PDF generation |
| **React Query** | 3.39.3 | Data fetching |
| **SWR** | 2.2.5 | Data fetching |
| **Lucide React** | 0.400.0 | Icons |
| **React Markdown** | 9.0.1 | Markdown rendering |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express** | 4.19.2 | Web framework |
| **Node.js** | 20+ | Runtime |
| **TypeScript** | 5.5.2 | Type safety |
| **Prisma** | 5.14.0 | ORM |
| **Clerk SDK** | 5.1.6 | Authentication |
| **Stripe** | 16.1.0 | Payments |
| **Pino** | 9.2.0 | Logging |
| **Helmet** | 7.1.0 | Security headers |
| **express-rate-limit** | 7.3.1 | Rate limiting |

### AI & External Services
| Service | Purpose |
|---------|---------|
| **OpenAI GPT-4o** | Primary AI model |
| **Google Gemini** | Alternative AI model |
| **Groq** | Fast inference AI model |
| **Stripe** | Payment processing |
| **Clerk** | Authentication & user management |

### Database & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **PostgreSQL** | Primary database |
| **Prisma** | ORM & migrations |
| **Railway** | Backend hosting |
| **Vercel** | Frontend hosting |

---

## 🚀 Live Demo

Try StartupForge now: **[startup-forge-two.vercel.app](https://startup-forge-two.vercel.app)**

### Demo Account
- Email: `demo@example.com`
- Password: Use Google OAuth for instant access

---

## 🚀 Getting Started

### Prerequisites

You'll need:

- **Node.js** 20+ - [Download here](https://nodejs.org/)
- **npm** or **yarn**
- **PostgreSQL** database
- **Clerk Account** - [Sign up free](https://clerk.com)
- **OpenAI/Gemini/Groq API Key**
- **Stripe Account** - [Sign up free](https://stripe.com)

### Quick Start (3 steps)

```bash
# 1. Clone the repository
git clone https://github.com/systematicfunnels/StartupForge.git
cd StartupForge

# 2. Install all dependencies
npm run install:all

# 3. Configure environment & start
npm run dev
```

---

## 📥 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/systematicfunnels/StartupForge.git
cd StartupForge
```

### Step 2: Install Dependencies

Install all packages (frontend + backend):

```bash
npm run install:all
```

Or manually:

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### Step 3: Setup Environment Variables

#### Backend `.env`

```bash
cd backend
cp .env.example .env
```

Fill in the values:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/startupforge

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Provider (choose one or more)
OPENAI_API_KEY=sk_...
GOOGLE_GEMINI_API_KEY=...
GROQ_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_AGENCY=price_xxx

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env.local`

```bash
cd frontend
cp .env.local.example .env.local
```

Fill in the values:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# API
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 4: Setup Database

```bash
npm run db:setup
```

This will:
1. Generate Prisma client
2. Run all migrations
3. Initialize the database

Optional - View database GUI:

```bash
cd backend
npm run db:studio
```

### Step 5: Setup Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create **3 subscription products**:
   - **Starter**: $12/month
   - **Pro**: $29/month
   - **Agency**: $79/month
3. Copy the price IDs to `.env`

For local webhook testing:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

### Step 6: Setup Clerk

1. Create app at [clerk.com](https://clerk.com)
2. Enable:
   - Email login
   - Google login
3. Add redirect URLs:
   - Sign in: `/auth/login`
   - Sign up: `/auth/signup`
   - After sign in: `/dashboard`
4. Copy keys to `.env` files

---

## ⚙️ Configuration

### Environment Variables Summary

#### Critical Variables (Must Set)

```env
# Database - REQUIRED
DATABASE_URL=postgresql://...

# Clerk - REQUIRED
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

# AI Provider - SET AT LEAST ONE
OPENAI_API_KEY=...
OR
GOOGLE_GEMINI_API_KEY=...
OR
GROQ_API_KEY=...

# Stripe - REQUIRED for payments
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_STARTER=...
STRIPE_PRICE_PRO=...
STRIPE_PRICE_AGENCY=...
```

#### Optional Variables

```env
# Server Config
PORT=4000
NODE_ENV=development
LOG_LEVEL=info

# URLs
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PROD=https://startup-forge-two.vercel.app
```

---

## 💻 Running Locally

### Development Mode

Start both frontend and backend:

```bash
npm run dev
```

This runs:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:4000 (Express)

### Development (Separate Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

```bash
npm run build
```

Builds:
- Frontend optimized bundle
- Backend compiled TypeScript

### Start Production Server

```bash
cd backend
npm start
```

Then frontend:

```bash
cd frontend
npm start
```

---

## 📁 Project Structure

```
StartupForge/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts           # Authentication
│   │   │   ├── projects.ts       # Project CRUD
│   │   │   ├── generate.ts       # AI generation
│   │   │   ├── billing.ts        # Stripe handling
│   │   │   └── webhooks.ts       # Stripe webhooks
│   │   ├── controllers/          # Business logic
│   │   ├── services/
│   │   │   ├── ai.service.ts     # AI provider logic
│   │   │   ├── stripe.service.ts # Payment handling
│   │   │   └── export.service.ts # PDF/Markdown export
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts           # JWT verification
│   │   │   ├── errorHandler.ts   # Error handling
│   │   │   └── rateLimit.ts      # Rate limiting
│   │   ├── db/                   # Database
│   │   └── utils/                # Utilities
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/               # Auth routes
│   │   │   ├── login/            # Login page
│   │   │   └── signup/           # Signup page
│   │   ├── dashboard/            # Dashboard
│   │   │   ├── page.tsx          # Projects list
│   │   │   ├── [id]/             # Project detail
│   │   │   │   └── page.tsx      # Blueprint view
│   │   │   └── new/              # New project
│   │   ├── pricing/              # Pricing page
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation
│   │   ├── Blueprint.tsx         # Blueprint display
│   │   ├── GenerationForm.tsx    # Generation form
│   │   └── ...                   # Other components
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   └── utils.ts              # Utilities
│   ├── public/                   # Static assets
│   ├── .env.local.example        # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                  # Root scripts
└── README.md                     # This file
```

---

## 🔌 API Reference

### Authentication

```
POST /api/auth/sync          # Sync Clerk user to database
GET  /api/auth/me            # Get current user
```

### Projects

```
GET    /api/projects         # List user's projects
POST   /api/projects         # Create new project
GET    /api/projects/:id     # Get project + outputs
DELETE /api/projects/:id     # Delete project
GET    /api/projects/:id/export # Export as PDF/Markdown
```

### Generation

```
POST   /api/generate/:id/start    # Start AI generation
GET    /api/generate/:id/status   # SSE stream for progress
POST   /api/generate/:id/step/:n  # Regenerate specific step
```

### Billing

```
POST   /api/billing/checkout  # Create Stripe checkout
GET    /api/billing/portal    # Stripe billing portal
POST   /api/webhooks/stripe   # Stripe webhook endpoint
```

---

## 📦 Deployment

### Frontend - Vercel

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables** (Vercel Dashboard)
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

### Backend - Railway

1. **Create Project** on [Railway](https://railway.app)

2. **Connect Repository**

3. **Add PostgreSQL Plugin**

4. **Set Environment Variables**
   - All from `.env.example`

5. **Deploy**
   ```bash
   railway deploy
   ```

### Database - Railway PostgreSQL

1. PostgreSQL plugin automatically created
2. Connection string in `DATABASE_URL`
3. Run migrations:
   ```bash
   npm run db:migrate
   ```

---

## 💾 Database

### Schema Overview

```prisma
model User {
  id String @id
  email String @unique
  name String?
  clerkId String @unique
  subscriptionPlan String
  projects Project[]
}

model Project {
  id String @id @default(cuid())
  userId String
  title String
  description String?
  outputs ProjectOutput[]
  createdAt DateTime @default(now())
}

model ProjectOutput {
  id String @id @default(cuid())
  projectId String
  step Int (1-10)
  content String
  regenerations Int @default(0)
}

model Subscription {
  id String @id
  userId String @unique
  stripeCustomerId String
  stripePriceId String
  status String
}
```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create migration
npm run db:migrate

# Open Studio (GUI)
npm run db:studio

# Reset database (dev only)
npm run db:reset
```

---

## 🤖 AI Providers

### Selecting AI Provider

The system automatically uses whichever API key is set:

**Priority Order:**
1. **OpenAI** (if `OPENAI_API_KEY` set)
2. **Google Gemini** (if `GOOGLE_GEMINI_API_KEY` set)
3. **Groq** (if `GROQ_API_KEY` set)

### Switch Providers

To change providers, just set different API keys in `.env`:

```env
# Use OpenAI
OPENAI_API_KEY=sk_...

# Or use Gemini
GOOGLE_GEMINI_API_KEY=...

# Or use Groq
GROQ_API_KEY=...
```

### API Keys

Get your free API keys:

- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://ai.google.dev/
- **Groq**: https://console.groq.com/

---

## 💳 Billing & Payments

### Stripe Integration

1. **Create Products** in Stripe Dashboard
2. **Add Price IDs** to `.env`
3. **Webhook Endpoint**: `/api/webhooks/stripe`

### Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $12/mo | 10 blueprints/month |
| **Pro** | $29/mo | Unlimited blueprints |
| **Agency** | $79/mo | Team features + API |

### Testing Payments

Use Stripe test cards:

```
Card: 4242 4242 4242 4242
Date: 12/25
CVC: 123
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User signup via email
- [ ] User signup via Google
- [ ] Create new project
- [ ] Generate blueprint
- [ ] View real-time progress
- [ ] Regenerate section
- [ ] Export as PDF
- [ ] Upgrade subscription
- [ ] Access billing portal
- [ ] Webhook payment received

### API Testing

```bash
# Test backend
cd backend
npm test
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution**: Verify `DATABASE_URL` and PostgreSQL is running:

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: Clerk Auth Not Working

**Solution**: Check Clerk keys in `.env`:

```bash
# Verify variables are set
echo $CLERK_SECRET_KEY
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

### Issue: AI Generation Not Starting

**Solution**: Ensure at least one AI key is set:

```bash
# Check
echo $OPENAI_API_KEY  # or
echo $GOOGLE_GEMINI_API_KEY  # or
echo $GROQ_API_KEY
```

### Issue: Stripe Webhook Failing

**Solution**: Test local webhook:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Check logs for errors.

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Fork & Clone

```bash
git clone https://github.com/your-username/StartupForge.git
cd StartupForge
```

### Create Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### Make Changes

1. Follow code style (Prettier, ESLint)
2. Add tests
3. Update documentation

### Commit & Push

```bash
git add .
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

### Create Pull Request

Go to GitHub and create PR with description of changes.

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 📞 Support

### Get Help

- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/systematicfunnels/StartupForge/issues)
- 💬 [Discussions](https://github.com/systematicfunnels/StartupForge/discussions)
- 📧 [Contact](https://startup-forge-two.vercel.app/contact)

### Contact

- **Repository**: https://github.com/systematicfunnels/StartupForge
- **Website**: https://startup-forge-two.vercel.app
- **Owner**: [@systematicfunnels](https://github.com/systematicfunnels)

---

## 📚 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Tutorials

- [Building with Next.js](https://nextjs.org/learn)
- [Stripe Integration](https://stripe.com/docs/payments)
- [Clerk Authentication](https://clerk.com/docs/quickstarts/nextjs)
- [Prisma ORM](https://www.prisma.io/docs/getting-started)

---

## 🚀 Roadmap

- [ ] Team collaboration features
- [ ] Custom AI prompts
- [ ] Advanced analytics
- [ ] White-label option
- [ ] API access for Pro+ users
- [ ] Mobile app
- [ ] Slack integration
- [ ] More AI providers

---

## 📊 Project Status

- ✅ MVP complete
- ✅ Stripe integration live
- ✅ Clerk authentication
- ✅ Multi-provider AI support
- 🔄 User feedback implementation
- 📅 Advanced features coming soon

---

<div align="center">

## Made with ❤️ by systematicfunnels

**[⭐ Star on GitHub](https://github.com/systematicfunnels/StartupForge)** • **[🚀 Try Live](https://startup-forge-two.vercel.app)** • **[🐛 Report Issues](https://github.com/systematicfunnels/StartupForge/issues)**

Turn ideas into blueprints. Scale your startup faster. 🚀

</div>
