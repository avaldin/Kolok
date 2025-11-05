# Kolok

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black?logo=socket.io)](https://socket.io/)

> A real-time collaborative shared living (colocation) management Progressive
> Web App that simplifies roommate coordination through synchronized tools and
> passwordless authentication.

---

## Problem & Solution

**The Problem**: Roommates struggle to coordinate shared tasks like shopping
lists, expenses, and schedules. Traditional apps require complex setups,
passwords, and lack real-time synchronization.

**Our Solution**: Kolok provides a lightweight, passwordless PWA with real-time
collaborative tools. Users authenticate via email verification codes, join
shared "Koloks" (rooms), and access synchronized tools like shopping lists with
instant updates and push notifications.

---

## Key Features

### Authentication & User Management

- **Passwordless Authentication**: Email-based login with 6-digit verification
  codes (15-minute expiration)
- **Automatic Email Delivery**: Powered by Resend for reliable transactional
  emails
- **Persistent Sessions**: Client-side userId storage for seamless experience

### Collaborative Rooms ("Koloks")

- **Shared Spaces**: Users create or join rooms to collaborate with roommates
- **Modular Tool System**: Each room can enable/disable tools dynamically
- **Multi-User Support**: One user per room with full participant visibility

### Real-Time Communication

- **WebSocket Synchronization**: Instant updates via Socket.IO for all room
  members
- **Web Push Notifications**: VAPID-based notifications for offline users
- **Service Worker Integration**: Background sync and offline capabilities

### Currently Implemented Tools

- **Shopping List**: Collaborative shopping list with real-time item
  additions/removals
    - Instant synchronization across all connected devices
    - Push notifications when roommates add items
    - Persistent storage in PostgreSQL

---

## Tech Stack

### Backend (`/backend`)

| Technology     | Version | Purpose                                       |
|----------------|---------|-----------------------------------------------|
| **NestJS**     | 11.x    | Progressive Node.js framework with TypeScript |
| **TypeScript** | 5.7     | Type-safe development                         |
| **TypeORM**    | 0.3.25  | PostgreSQL ORM with migrations                |
| **PostgreSQL** | Latest  | Database (hosted on Supabase)                 |
| **Socket.IO**  | 4.8     | WebSocket real-time communication             |
| **web-push**   | 3.6     | VAPID push notifications                      |
| **Resend**     | Latest  | Transactional email service                   |
| **Swagger**    | Latest  | OpenAPI documentation                         |

### Frontend (`/frontend`)

| Technology               | Version | Purpose                      |
|--------------------------|---------|------------------------------|
| **Next.js**              | 15      | React framework with SSR/SSG |
| **React**                | 19      | UI library                   |
| **TypeScript**           | 5       | Type-safe development        |
| **Tailwind CSS**         | v4      | Utility-first styling        |
| **Socket.IO Client**     | 4.8     | Real-time updates            |
| **@ducanh2912/next-pwa** | 10.2    | Progressive Web App support  |
| **Lucide React**         | Latest  | Icon library                 |

### Infrastructure

- **Database**: PostgreSQL on Supabase with SSL
- **Email Service**: Resend API
- **Real-Time**: Socket.IO server/client
- **PWA**: Service Workers with offline support
- **Deployment**: Configured for production builds

---

## Project Architecture

```
Kolok/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── user/              # User authentication & management
│   │   ├── room/              # Room (Kolok) management
│   │   ├── shopping-list/     # Collaborative shopping list tool
│   │   ├── notifications/     # Push notification service (VAPID)
│   │   ├── mail/              # Email service (Resend)
│   │   ├── websocket/         # Socket.IO gateway
│   │   ├── common/            # Shared validation pipes
│   │   ├── config/            # Environment validation
│   │   └── migrations/        # TypeORM database migrations
│   ├── orm.config.ts          # TypeORM CLI configuration
│   └── package.json
│
├── frontend/                   # Next.js PWA
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/          # Login & email verification
│   │   │   ├── setup/         # Room creation/joining
│   │   │   ├── main/          # Authenticated app view
│   │   │   ├── layout/        # Header, room cards
│   │   │   └── ui/            # Reusable components (Toast, buttons)
│   │   ├── tools/
│   │   │   └── shopping-list/ # Shopping list feature page
│   │   ├── lib/
│   │   │   ├── api.ts         # Backend API client (20+ functions)
│   │   │   ├── hooks.ts       # Socket.IO & Service Worker hooks
│   │   │   ├── storage.ts     # localStorage wrapper (userId)
│   │   │   └── validation.ts  # Input validators
│   │   ├── layout.tsx         # Root layout with ToastProvider
│   │   ├── page.tsx           # Home page with AppRouter
│   │   └── globals.css        # Tailwind v4 theme
│   └── public/
│       ├── manifest.json      # PWA manifest
│       └── icons/             # PWA icons
│
└── README.md                   # This file
```

### Database Schema

```
┌─────────────┐         ┌─────────────┐
│    User     │    N:1  │    Room     │
├─────────────┤─────────├─────────────┤
│ id (PK)     │         │ name (PK)   │
│ name        │         │ users[]     │
│ email       │         │ tools[]     │
│ roomName    │         └─────────────┘
│ verified    │                │
└─────────────┘                │ 1:1
                               ↓
                      ┌─────────────────┐
                      │ ShoppingList    │
                      ├─────────────────┤
                      │ roomName (PK)   │
                      │ items[]         │
                      └─────────────────┘

┌──────────────────┐
│  Notifications   │  (VAPID subscriptions)
├──────────────────┤
│ userId (PK)      │
│ url              │
│ encryptionKey    │
│ authKey          │
└──────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (for both frontend and backend)
- **PostgreSQL** database (local or Supabase)
- **npm** or **yarn**

### Environment Variables

#### Backend (`.env` in `/backend`)

```env
# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://user:password@host:5432/kolok

# Web Push (VAPID)
VAPID_KEY_PUBLIC=your_vapid_public_key
VAPID_KEY_PRIVATE=your_vapid_private_key
VAPID_SUBJECT=mailto:your-email@example.com

# Email Service
RESEND_API_KEY=your_resend_api_key
```

**Generate VAPID keys**:

```bash
npx web-push generate-vapid-keys
```

#### Frontend (`.env.local` in `/frontend`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NODE_ENV=development
```

### Installation & Running

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kolok.git
cd kolok
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Run database migrations
npm run migration:run

# Start development server
npm run dev
```

Backend will be available at `http://localhost:4000`
API documentation at `http://localhost:4000/api` (Swagger)

#### 3. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### 4. Production Build

**Backend**:

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend**:

```bash
cd frontend
npm run build
npm start
```

---

## Available Scripts

### Backend (`/backend`)

| Command                      | Description                            |
|------------------------------|----------------------------------------|
| `npm run dev`                | Start in watch mode for development    |
| `npm run build`              | Compile TypeScript to `/dist`          |
| `npm run start:prod`         | Run production build                   |
| `npm run migration:generate` | Generate migration from entity changes |
| `npm run migration:run`      | Execute pending migrations             |
| `npm run migration:revert`   | Rollback last migration                |

### Frontend (`/frontend`)

| Command         | Description                             |
|-----------------|-----------------------------------------|
| `npm run dev`   | Start Next.js dev server with Turbopack |
| `npm run build` | Build for production                    |
| `npm start`     | Run production server                   |
| `npm run lint`  | Run ESLint checks                       |

---

## API Overview

### REST Endpoints

**Authentication**

```
POST   /user/register      - Create account
POST   /user/login         - Request login code
POST   /user/verify-email  - Verify 6-digit code
POST   /user/resend-code   - Resend verification code
```

**Rooms**

```
POST   /room                    - Create new room
GET    /room/:name              - Get room details
GET    /room/byUserId/:userId   - Get user's room
POST   /room/join-room          - Join existing room
DELETE /room/leave-room         - Leave current room
```

**Shopping List**

```
POST   /shopping-list/:roomName           - Create list for room
GET    /shopping-list/:userId/items       - Get items
POST   /shopping-list/item                - Add item
DELETE /shopping-list/:userId/item/:item  - Remove item
```

**Notifications**

```
GET    /notifications/vapid-key       - Get VAPID public key
GET    /notifications/:userId/status  - Check subscription status
POST   /notifications                 - Subscribe to push
DELETE /notifications                 - Unsubscribe
```

### WebSocket Events

**Emit**:

- `joinShoppingList(roomName: string)` - Join room for updates

**Listen**:

- `listUpdated` - Fired when shopping list changes

---

## Technical Highlights

### Architecture Decisions

**Modular Design**

- NestJS modules for clear separation of concerns (User, Room, Tools,
  Notifications)
- Each tool (shopping-list) is an independent module with its own entity,
  service, and controller
- Scalable architecture ready for additional tools (calendar, expenses, tasks,
  notes)

**Type Safety**

- Full TypeScript implementation across frontend and backend
- DTOs with `class-validator` decorators for runtime validation
- Strict type checking prevents runtime errors

**Real-Time Architecture**

- Socket.IO rooms mirror application rooms for targeted broadcasts
- Push notifications for offline users ensure no updates are missed
- Client-side hooks (`useShoppingListSocket`) abstract WebSocket complexity

**Data Validation**

- Environment variables validated at startup (fails fast if misconfigured)
- Custom validation pipes for names (3-25 characters, alphanumeric + special
  chars)
- Client and server-side validation for defense in depth

**Database Management**

- Versioned migrations (no `synchronize: true` in production)
- Automatic migration execution on server startup
- Relations with proper foreign key constraints and cascade deletes

**PWA Implementation**

- Service Worker registration for offline capabilities
- Web Push API with VAPID authentication
- Manifest configuration for "Add to Home Screen"

### Security Practices

**Current Implementation**:

- Passwordless authentication reduces credential theft risk
- Email verification with time-limited codes (15-minute expiration)
- SSL database connections
- CORS configuration for frontend-only access
- Input validation on all user inputs

---

## Development Best Practices

**Code Quality**

- ESLint + Prettier configured for consistent formatting
- Modular component architecture in React
- Service layer pattern in NestJS for business logic
- Custom React hooks for reusable logic

---

## Roadmap & Future Tools

The architecture supports adding new collaborative tools. Planned features:

- **Calendar**: Shared event scheduling
- **Tasks**: Todo lists with assignments
- **Expenses**: Shared expense tracking and splitting
- **Notes**: Collaborative note-taking

Each tool follows the same pattern:

1. Create NestJS module with entity, service, controller
2. Add to `tools` array in Room entity
3. Implement frontend page in `/tools/[toolName]`
4. Add WebSocket events for real-time sync

---

## Contributing

This project follows conventional commits and uses migrations for database
changes.

**Adding a new tool**:

1. Backend: Create module in `/backend/src/[tool-name]`
2. Generate migration: `npm run migration:generate`
3. Frontend: Add page in `/frontend/app/tools/[tool-name]`
4. Update room card with tool option

---

## License

This project is private and unlicensed. All rights reserved.

---

## Project Status

**Current State**: Functional MVP with core features implemented
**Deployment**: Configured for production (backend + frontend)
**Next Steps**: Additional collaborative tools, enhanced security, comprehensive
testing

---

**Built with modern web technologies to solve real-world roommate coordination
challenges.**
