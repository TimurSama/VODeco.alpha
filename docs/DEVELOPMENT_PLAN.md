# VODeco Full Development Plan
## Comprehensive Implementation Roadmap

---

## Table of Contents
1. [Database Schema Extensions](#1-database-schema-extensions)
2. [Authentication & Session Management](#2-authentication--session-management)
3. [Referral System](#3-referral-system)
4. [Social Media Integration & Rewards](#4-social-media-integration--rewards)
5. [Missions & Tasks System](#5-missions--tasks-system)
6. [Airdrop & Rewards Calculation](#6-airdrop--rewards-calculation)
7. [Profile Page Enhancement](#7-profile-page-enhancement)
8. [Library/Research Section](#8-libraryresearch-section)
9. [News Submission System](#9-news-submission-system)
10. [Roadmap Visualization](#10-roadmap-visualization)
11. [API Enhancements](#11-api-enhancements)
12. [Tokenomics Integration](#12-tokenomics-integration)

---

## 1. Database Schema Extensions

### 1.1 New Models to Add

#### Referral System
```prisma
model Referral {
  id            String   @id @default(cuid())
  referrerId    String   // User who created the referral
  referrer      User     @relation("Referrer", fields: [referrerId], references: [id])
  referredId    String?  // User who used the referral (nullable until used)
  referred      User?    @relation("Referred", fields: [referredId], references: [id])
  code          String   @unique // Unique referral code
  link          String   @unique // Unique referral link
  status        String   @default("active") // 'active', 'used', 'expired'
  rewardAmount  String   @default("0") // Reward for referrer
  createdAt     DateTime @default(now())
  usedAt       DateTime?
  
  @@index([referrerId])
  @@index([referredId])
  @@index([code])
}

// Add to User model:
// referralsCreated Referral[] @relation("Referrer")
// referralsUsed   Referral[] @relation("Referred")
```

#### Social Media Shares
```prisma
model SocialShare {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  platform      String   // 'twitter', 'facebook', 'telegram', 'linkedin', 'instagram'
  postUrl       String   // URL of the shared post
  newsPostId    String?  // If sharing a news article
  newsPost      NewsPost? @relation(fields: [newsPostId], references: [id])
  verified      Boolean  @default(false) // Admin verification
  rewardAmount  String   @default("0")
  rewardStatus  String   @default("pending") // 'pending', 'approved', 'rejected'
  metadata      String?  // JSON: screenshot, engagement metrics, etc.
  createdAt     DateTime @default(now())
  verifiedAt    DateTime?
  
  @@index([userId])
  @@index([platform])
  @@index([rewardStatus])
}
```

#### Missions & Tasks
```prisma
model Mission {
  id              String   @id @default(cuid())
  title           String
  description     String
  type            String   // 'task', 'vacancy', 'partnership', 'news_submission'
  category        String   // 'development', 'design', 'marketing', 'content', 'research', 'partnership'
  status          String   @default("active") // 'active', 'completed', 'paused', 'closed'
  rewardAmount    String   // VOD tokens reward
  rewardType      String   // 'fixed', 'variable', 'tiered'
  requirements    String?  // JSON: skills, experience, deliverables
  maxParticipants Int?     // For tasks that can be done by multiple users
  currentParticipants Int  @default(0)
  deadline        DateTime?
  metadata        String?  // JSON: additional info
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  submissions     MissionSubmission[]
  
  @@index([type])
  @@index([category])
  @@index([status])
}

model MissionSubmission {
  id            String   @id @default(cuid())
  missionId     String
  mission       Mission  @relation(fields: [missionId], references: [id])
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  status        String   @default("pending") // 'pending', 'reviewing', 'approved', 'rejected'
  content       String?  // Text submission
  attachments   String?  // JSON: URLs to files, images, videos
  rewardAmount  String   @default("0")
  feedback      String?  // Admin feedback
  submittedAt   DateTime @default(now())
  reviewedAt    DateTime?
  
  @@unique([missionId, userId]) // One submission per user per mission
  @@index([userId])
  @@index([status])
}
```

#### User Level & Experience
```prisma
model UserLevel {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  level         Int      @default(1)
  experience    Int      @default(0) // XP points
  totalRewards  String   @default("0") // Total VOD earned
  achievements  Int      @default(0) // Count of achievements
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Add to User model:
// level UserLevel?
```

#### Library/Research Items
```prisma
model LibraryItem {
  id            String   @id @default(cuid())
  title         String
  description   String
  type          String   // 'research', 'article', 'study', 'publication', 'project_card'
  category      String   // 'water_resources', 'ecology', 'technology', 'policy', 'science'
  authorId      String?
  author        User?    @relation(fields: [authorId], references: [id])
  content       String?  // Full text or markdown
  fileUrl       String?  // PDF, document URL
  imageUrl      String?
  tags          String?  // JSON array
  published     Boolean  @default(false)
  publishedAt   DateTime?
  views         Int      @default(0)
  likes         Int      @default(0)
  metadata      String?  // JSON: DOI, journal, citations, etc.
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  comments      Comment[]
  
  @@index([type])
  @@index([category])
  @@index([published])
}

// Add to Comment model:
// libraryItemId String?
// libraryItem   LibraryItem? @relation(fields: [libraryItemId], references: [id])
```

#### Enhanced Post Model
```prisma
// Extend existing Post model:
model Post {
  // ... existing fields ...
  type          String   @default("post") // 'post', 'news', 'research', 'achievement', 'project_card'
  attachments   String?  // JSON: images, videos, audio, files
  tags          String?  // JSON array
  location      String?  // Optional location
  // ... rest of existing fields ...
}
```

#### Airdrop Events
```prisma
model Airdrop {
  id            String   @id @default(cuid())
  name          String
  description   String
  type          String   // 'social_share', 'referral', 'mission', 'news_submission', 'general'
  totalAmount   String   // Total VOD allocated
  distributedAmount String @default("0")
  startDate     DateTime
  endDate       DateTime?
  criteria      String?  // JSON: requirements
  status        String   @default("active") // 'active', 'paused', 'completed'
  createdAt     DateTime @default(now())
  
  distributions AirdropDistribution[]
  
  @@index([type])
  @@index([status])
}

model AirdropDistribution {
  id            String   @id @default(cuid())
  airdropId     String
  airdrop       Airdrop  @relation(fields: [airdropId], references: [id])
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  amount        String
  reason        String   // Why user received this airdrop
  status        String   @default("pending") // 'pending', 'distributed', 'failed'
  distributedAt DateTime?
  createdAt     DateTime @default(now())
  
  @@index([userId])
  @@index([status])
}

// Add to User model:
// airdropDistributions AirdropDistribution[]
```

---

## 2. Authentication & Session Management

### 2.1 JWT Implementation
- Replace demo user fallback with JWT-based sessions
- Use `next-auth` or custom JWT solution
- Store sessions in database or Redis

### 2.2 API Middleware
- Create auth middleware for protected routes
- Extract user from JWT token
- Handle token refresh

### 2.3 Files to Create/Modify
- `src/lib/auth/jwt.ts` - JWT utilities
- `src/lib/auth/middleware.ts` - Auth middleware
- `app/api/auth/session/route.ts` - Session management
- Update all API routes to use auth middleware

---

## 3. Referral System

### 3.1 Features
- Unique referral codes for each user (auto-generated on registration)
- Unique referral links: `https://vodeco.org/ref/{code}`
- Reward structure:
  - Referrer: 500-1000 VOD (configurable)
  - Referred: 1000 VOD welcome bonus (existing) + 200 VOD referral bonus
- Track referral usage and prevent self-referrals

### 3.2 API Endpoints
- `GET /api/referrals` - Get user's referral code and stats
- `POST /api/referrals/use` - Use a referral code (during registration)
- `GET /api/referrals/stats` - Referral statistics

### 3.3 Implementation
- Modify `app/api/auth/telegram/route.ts` to accept `referralCode` parameter
- Create referral code on user creation
- Distribute rewards automatically
- Create referral dashboard component

---

## 4. Social Media Integration & Rewards

### 4.1 Supported Platforms
- Twitter/X
- Facebook
- Telegram
- LinkedIn
- Instagram
- VKontakte (for Russian market)

### 4.2 Verification Methods
- Manual: User submits screenshot/proof
- Automated: OAuth integration (where possible)
- URL verification: Check if post contains VODeco link

### 4.3 Reward Structure
- Base reward: 50-200 VOD per verified share
- Bonus for engagement: +10-50 VOD per 100 likes/shares
- Daily limit: Max 5 shares per platform per day
- Quality bonus: +100 VOD for viral posts (1000+ engagements)

### 4.4 API Endpoints
- `POST /api/social/share` - Submit social media share
- `GET /api/social/shares` - Get user's shares
- `POST /api/social/verify/:id` - Admin verification
- `GET /api/social/stats` - Social sharing statistics

### 4.5 Components
- Share button component with platform selection
- Share verification form
- Social media dashboard

---

## 5. Missions & Tasks System

### 5.1 Mission Types

#### A. Vacancies (Open Positions)
- Frontend Developer (React/Next.js)
- Backend Developer (Node.js/TypeScript)
- Blockchain Developer (Solidity/Web3)
- UI/UX Designer
- Marketing Specialist
- SMM Specialist
- Content Creator
- Influencer Program
- Partnership Program
- Research Scientist
- Data Analyst
- Community Manager

#### B. Tasks
- Bug fixes
- Feature development
- Documentation
- Translation
- Testing
- Design assets

#### C. News Submissions
- Submit relevant water/environmental news
- Reward: 20-100 VOD per approved submission

#### D. Partnerships
- Company partnerships
- Organization collaborations
- NGO partnerships
- Government partnerships

### 5.2 Mission Page Structure
- Filter by type, category, status
- Search functionality
- Sort by reward, deadline, popularity
- Mission detail page with submission form
- Progress tracking

### 5.3 API Endpoints
- `GET /api/missions` - List missions with filters
- `GET /api/missions/:id` - Mission details
- `POST /api/missions/:id/submit` - Submit mission
- `GET /api/missions/my-submissions` - User's submissions
- `POST /api/missions/:id/review` - Admin review (approve/reject)

### 5.4 Reward Calculation
- Based on mission complexity and type
- Tiered rewards for quality submissions
- Bonus for early completion

---

## 6. Airdrop & Rewards Calculation

### 6.1 Tokenomics-Based Calculations

Примечание: в MVP все вознаграждения рассчитываются в **VOD credits** (pre‑sensor режим).

#### Total Airdrop Pool
- Allocate 5-10% of total supply for airdrops
- Distribute over 12-24 months
- Reserve pools:
  - Social shares: 2%
  - Referrals: 2%
  - Missions: 3%
  - News submissions: 1%
  - General community: 2%

#### Reward Formulas

**Social Share Rewards:**
```
Base: 50 VOD
Engagement bonus: (likes + shares) / 100 * 10 VOD (max 50)
Viral bonus: if (engagements > 1000) + 100 VOD
Daily limit: 5 shares/day
Max per share: 200 VOD
```

**Referral Rewards:**
```
Referrer: 500 VOD (first 10 referrals), 300 VOD (11-50), 200 VOD (51+)
Referred: 200 VOD bonus (in addition to 1000 welcome)
Tier bonus: +100 VOD if referrer has 10+ active referrals
```

**Mission Rewards:**
```
Vacancy: 500-5000 VOD (based on role and complexity)
Task: 100-2000 VOD (based on difficulty)
News submission: 20-100 VOD (based on quality and relevance)
Partnership: 1000-10000 VOD (based on partnership value)
```

**News Submission Rewards:**
```
Base: 20 VOD
Quality bonus: +30 VOD (if approved and published)
Relevance bonus: +50 VOD (if highly relevant to water resources)
First submission: +10 VOD bonus
```

### 6.2 Implementation
- Create `src/lib/tokenomics/rewards.ts` with calculation functions
- Integrate with airdrop distribution system
- Automatic reward distribution on approval
- Manual review for high-value rewards

---

## 7. Profile Page Enhancement

### 7.1 New Features

#### A. Achievement Feed
- Timeline of all achievements
- Filter by category
- Share achievements
- Achievement badges display

#### B. User Level System
- XP-based leveling
- Level benefits (higher staking APY, priority support)
- Level progress bar
- Next level requirements

#### C. Publications Feed
- User's posts, news submissions, research
- Filter by type
- Empty state: "No publications yet"
- Create new publication button

#### D. Content Creation
- Rich text editor
- Media upload (images, videos, audio)
- Attach achievements
- Attach project cards
- Tag system
- Publish/unpublish toggle

#### E. Statistics Dashboard
- Total rewards earned
- Active stakings
- Referrals count
- Social shares count
- Mission completions
- Level and XP

### 7.2 Components to Create
- `AchievementFeed.tsx`
- `LevelProgress.tsx`
- `PublicationFeed.tsx`
- `ContentEditor.tsx`
- `ProfileStats.tsx`

---

## 8. Library/Research Section

### 8.1 Features
- Browse research articles, studies, publications
- Filter by category, type, author
- Search functionality
- View/download documents
- Comments and discussions
- User submissions

### 8.2 Page Structure
- Main library page: `/library`
- Category pages
- Item detail page
- Submission form

### 8.3 API Endpoints
- `GET /api/library` - List library items
- `GET /api/library/:id` - Item details
- `POST /api/library` - Submit new item
- `GET /api/library/my-items` - User's submissions

---

## 9. News Submission System

### 9.1 Submission Form
- Title
- Content/Description
- Source URL
- Category selection
- Image upload
- Tags
- Contact information

### 9.2 Review Process
- Admin review queue
- Approval/rejection with feedback
- Automatic reward distribution on approval
- Quality scoring

### 9.3 Integration Points
- Mission page: "Submit News" mission
- News page: "Submit News" button
- Profile: User's news submissions

---

## 10. Roadmap Visualization

### 10.1 Roadmap Structure

#### Phase 1: Pre‑Sensor & Pilot (Months 0-9)
- MVP completion
- VOD credits (pre‑sensor) + TokenHub
- IoT sensor R&D funding
- Pilot data validation framework

#### Phase 2: Data Anchoring & Mint (Months 9-24)
- Sensor prototype & pilot deployment
- IoT oracle + verification pipeline
- Water index governance v1
- WTR minting on verified data
- DAO implementation (initial)

#### Phase 3: Scale & Institutional (Months 24-48)
- Mass sensor manufacturing
- Global water data coverage
- Full DAO governance
- Institutional partnerships
- Ecosystem expansion

### 10.2 Visual Elements
- Interactive timeline
- Milestone markers
- Progress indicators
- Regional expansion map
- Metrics dashboard
- Technology stack evolution

### 10.3 Implementation
- Create `/roadmap` page
- Use interactive chart library (Recharts + D3)
- Animated timeline
- Filter by category (tech, business, tokenomics)

---

## 11. API Enhancements

### 11.1 Real Data Integration
- Remove all demo/mock data
- Ensure all APIs use real database queries
- Integrate external APIs (World Bank, USGS, etc.)
- Implement caching strategy

### 11.2 New API Routes
```
/api/referrals/*
/api/social/*
/api/missions/*
/api/library/*
/api/airdrop/*
/api/user/level
/api/user/stats
```

### 11.3 Error Handling
- Standardized error responses
- Rate limiting
- Input validation
- Logging

---

## 12. Tokenomics Integration

### 12.1 Calculations Module
- Extend `src/lib/tokenomics/calculations.ts`
- Add pre‑sensor credits vs water‑mint mode switch
- Add reward calculation functions
- Add airdrop distribution logic
- Add level/XP calculations

### 12.2 Integration Points
- VOD credits (pre‑sensor) accounting
- WTR minting on verified data
- All reward distributions
- Staking calculations
- User level progression
- Airdrop events

---

## Implementation Priority

### Phase 1 (Week 1-2): Foundation
1. Database schema extensions
2. Authentication & session management
3. Referral system (basic)

### Phase 2 (Week 3-4): Core Features
4. Missions system (basic)
5. Social media integration (basic)
6. Profile enhancements

### Phase 3 (Week 5-6): Advanced Features
7. Library section
8. News submission system
9. Airdrop system
10. Reward calculations

### Phase 4 (Week 7-8): Polish & Launch
11. Roadmap visualization
12. UI/UX improvements
13. Testing & bug fixes
14. Documentation

---

## Technical Stack Additions

### New Dependencies
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing (if needed)
- `sharp` - Image processing
- `multer` or `formidable` - File uploads
- `zod` - Schema validation (already installed)
- `react-quill` or `slate` - Rich text editor
- `recharts` - Charts (already installed)

### Environment Variables
```env
JWT_SECRET=...
JWT_EXPIRES_IN=7d
UPLOAD_MAX_SIZE=10MB
AWS_S3_BUCKET=... (for file storage)
SOCIAL_VERIFICATION_ENABLED=true
```

---

## Testing Checklist

- [ ] Referral system: code generation, usage, rewards
- [ ] Social shares: submission, verification, rewards
- [ ] Missions: creation, submission, review, rewards
- [ ] Profile: level system, achievements, publications
- [ ] Library: CRUD operations, search, filters
- [ ] News submission: form, review, rewards
- [ ] Airdrop: distribution, tracking
- [ ] API: all endpoints, error handling
- [ ] Authentication: JWT, sessions, middleware
- [ ] Database: migrations, relationships, indexes

---

## Documentation Requirements

- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Reward calculation formulas
- User guides for each feature
- Admin guides for moderation

---

## Estimated Timeline

**Total: 8-10 weeks** for full implementation

- Database & Auth: 1 week
- Referral System: 1 week
- Social Media: 1.5 weeks
- Missions System: 2 weeks
- Profile & Library: 1.5 weeks
- Roadmap: 1 week
- Testing & Polish: 1-2 weeks

---

## План оставшихся доработок до релизной v1 (первые пользователи и инвесторы)

### 1) Конверсионные цепочки и рост
- Сквозная аналитика: view → click → submit для CTA, партнёрских/инвесторских форм, токен‑покупки.
- UTM‑стандарты на всех ключевых CTA.
- Мини‑воронки: аирдроп, рефералы, миссии, social‑share.
- Метрики (DAU/MAU, регистрации, конверсии, CAC/CR) и недельные отчёты.

### 2) Достоверность данных и витрина проектов
- Проверка внешних источников (OSM/USGS/World Bank) и fallback‑сценариев.
- Заполнение карточек объектов/субъектов воды (полные данные, связки).
- Кейсы/витрина: 3–5 ключевых проектов с метриками результата.

### 3) UX/UI релизного качества
- Полировка форм (валидации, ошибки, подсказки).
- Онбординг по ролям + минимальные туториалы.
- Единый визуальный ритм блоков, пустые состояния, адаптив.

### 4) Социальный слой и доверие
- Модерация контента (posts/comments) и отчёты.
- Трек достижений и репутации (XP/уровни) как «соц. доказательство».
- Прозрачность токеномики (VOD → WTR) на ключевых страницах.

### 5) Технический релиз‑контур
- Миграции Prisma, `db push`, `generate`, smoke‑тесты API.
- Мониторинг/логирование (Sentry/Logtail и аналоги).
- Проверка прод‑сборки и производительности.

### 6) Юридический минимум и инвест‑пакет
- Уточнение Terms/Privacy/Disclaimer (юрист при необходимости).
- Инвест‑лендинг: тезисы, traction‑метрики, use‑cases, CTA на форму.
- Партнёрские офферы: форматы интеграций + SLA‑черновик.

---

## Notes

- All rewards should be calculated based on tokenomics
- No demo data in production
- All APIs must use real database queries
- Implement proper error handling and logging
- Consider scalability from the start
- Security: validate all inputs, prevent SQL injection, XSS
- Performance: optimize queries, implement caching
- Mobile responsiveness for all new features
