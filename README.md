# VODeco MVP

Decentralized platform for water resource management with blockchain integration readiness.

## Tech Stack

- **Framework**: Next.js 16+ (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS (Glass Morphism, Neomorphism, Cyberneon)
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **State Management**: Zustand
- **Database**: PostgreSQL via Prisma ORM
- **i18n**: Custom i18n solution (next-intl ready)
- **Telegram**: @twa-dev/sdk for Mini App
- **Blockchain Ready**: ethers.js v6 + wagmi + viem

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create `.env.local` using `ENV_VARIABLES_LIST.md`

4. Initialize database:
```bash
npm run db:push
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vod-eco-mvp/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main application pages
│   │   ├── dashboard/     # Dashboard with 3D globe
│   │   ├── profile/       # User profile
│   │   ├── wallet/        # Wallet (offchain tokens)
│   │   ├── news/          # News feed
│   │   ├── projects/      # Project HUB
│   │   └── ...
│   └── api/               # API routes
├── src/
│   ├── components/        # React components
│   │   ├── layout/       # Layout components (Header, Sidebar)
│   │   ├── globe/        # 3D globe components
│   │   └── ...
│   ├── lib/              # Utilities and services
│   │   ├── api/          # API clients
│   │   ├── db/           # Database (Prisma)
│   │   ├── i18n/         # Internationalization
│   │   └── ...
│   └── ...
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Features

### ✅ Implemented

- [x] Project setup with Next.js 16 + TypeScript
- [x] Prisma database schema with PostgreSQL
- [x] Design system (Cyberneon + Glass Morphism + Neomorphism)
- [x] Layout components (Header, Sidebar, Logo, Language Switcher)
- [x] Internationalization (EN/RU) with context provider
- [x] 3D Interactive Globe component with Three.js
- [x] Dashboard page with water resources and metrics
- [x] Water Resources API integration (DB + OSM fallback)
- [x] Database seeding with sample data
- [x] Project HUB page with project cards
- [x] Wallet page with balance and staking display
- [x] Profile page with user information
- [x] News feed page structure
- [x] Telegram Mini App SDK integration (ready)
- [x] Telegram authentication API route
- [x] Error boundary and loading components
- [x] Utility functions (formatting, constants)
- [x] Zustand stores (sidebar, wallet)
- [x] API clients for projects, news, water resources

### 📋 Planned

- [ ] Blockchain integration (ethers.js/wagmi)
- [ ] DAO governance system
- [ ] Real-time data updates
- [ ] Advanced filtering and search
- [ ] Mobile optimizations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

See `ENV_VARIABLES_LIST.md` for required environment variables.

## License

MIT
