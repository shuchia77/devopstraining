# Northstar4Life Architecture

## Overview

Northstar4Life is built with a clean, scalable architecture that separates concerns into distinct layers:

```
┌─────────────────────────────────────────────────┐
│            EXPO ROUTER (Navigation)             │
│  (auth layouts) ↔ (main layouts) with guards    │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│           SCREEN COMPONENTS                      │
│  (compose UI, handle user interactions)         │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│        ZUSTAND STORES (State Management)        │
│  authStore ↔ dataStore (reactive state)         │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│      SERVICES LAYER (Supabase Client)           │
│  auth ↔ users ↔ check_ins ↔ goals ↔ recs       │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│       SUPABASE (Backend as a Service)           │
│  PostgreSQL DB ↔ Auth ↔ Edge Functions          │
└─────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Navigation Layer (Expo Router)

**Files**: `src/app/**/*`

**Responsibilities**:
- Route management with auth-aware splitting
- Screen transitions and deep linking
- Group-based route organization

**Key Decisions**:
- Use route groups `(auth)` and `(main)` for logical separation
- Auth state determines which group is rendered
- No route guards needed - handled at root layout

**Structure**:
```
app/
├── _layout.tsx          # Root: shows (auth) or (main)
├── (auth)/
│   ├── _layout.tsx      # Auth stack
│   ├── welcome.tsx      # Entry point
│   ├── signup.tsx
│   ├── signin.tsx
│   └── forgot-password.tsx
└── (main)/
    ├── _layout.tsx      # Main stack
    ├── home.tsx
    ├── check-in.tsx
    ├── goals.tsx
    ├── recommendations.tsx
    └── profile.tsx
```

### 2. UI/Screen Layer

**Files**: `src/screens/**/*.tsx` + `src/components/**/*.tsx`

**Responsibilities**:
- Render UI to users
- Handle form input and interactions
- Display data from stores
- Call store actions

**Key Decisions**:
- Screens are thick components (handle logic)
- UI components are thin & reusable
- Forms validate before submitting

**Flow**:
```
Screen Component
  ↓ (reads)
  Zustand Store (state)
  ↓ (calls)
  Store actions
  ↓ (update)
  Service layer
  ↓ (API call)
  Supabase
  ↓ (returns)
  Store (auto-updates)
  ↓ (triggers re-render)
  Component (shows new data)
```

### 3. State Management (Zustand)

**Files**: `src/store/*.ts`

**Why Zustand?**
- Lightweight (no boilerplate)
- Reactive state updates
- Works perfectly for React Native
- Easy to persist to AsyncStorage

**Auth Store**:
- User session & profile
- Sign up/in/out logic
- Session persistence
- Error handling

**Data Store**:
- Daily check-ins (CRUD)
- Goals (CRUD)
- Recommendations (load & generate)
- Life score calculations

**Usage Pattern**:
```typescript
// In any component
const { user, signIn, loading, error } = useAuthStore();

// State auto-updates when changed
// Component re-renders automatically
```

### 4. Services Layer

**Files**: `src/services/supabase.ts`

**Responsibilities**:
- Encapsulate Supabase client
- Provide domain-specific functions
- Handle errors gracefully
- Transform data if needed

**Organization**:
```
authService        // sign up, sign in, password reset
userService        // user profile CRUD
checkInService     // daily check-ins CRUD
goalService        // goals CRUD
recommendationService // recommendations & AI
```

**Error Handling**:
```typescript
export async function createCheckIn(userId, scores, notes) {
  const { data, error } = await supabase
    .from('daily_check_ins')
    .insert({...})
    .select()
    .single();
  
  if (error) throw error;  // Let caller handle
  return data;
}
```

### 5. Backend (Supabase)

**Components**:
- **PostgreSQL**: Relational database
- **Auth**: Built-in authentication
- **Realtime**: Real-time subscriptions
- **Edge Functions**: Serverless compute
- **Storage**: File storage

**Database Schema**:
```
users
├── id (UUID, PK)
├── email (unique)
├── display_name
├── subscription
└── timestamps

daily_check_ins
├── id (UUID, PK)
├── user_id (FK → users)
├── date (unique per user)
├── scores (JSONB)
├── notes
└── timestamps

goals
├── id (UUID, PK)
├── user_id (FK → users)
├── pillar
├── title, description
├── target_date
├── progress (0-100)
├── status (active/completed/paused)
└── timestamps

daily_recommendations
├── id (UUID, PK)
├── user_id (FK → users)
├── date
├── pillar
├── recommendation (text)
├── action_items (JSONB)
└── generated_at
```

## Data Flow Examples

### 1. Sign Up Flow
```
User fills form
  ↓
SignupScreen validates
  ↓
Calls useAuthStore.signUp(email, password, name)
  ↓
Store calls authService.signUp()
  ↓
Service calls supabase.auth.signUp()
  ↓
Supabase creates user & returns session
  ↓
Store calls userService.createUserProfile()
  ↓
Service inserts user record in DB
  ↓
Store updates state with user & session
  ↓
Root layout detects isSignedIn=true
  ↓
Navigation switches to (main) group
  ↓
User sees onboarding → home
```

### 2. Daily Check-in Flow
```
User opens CheckInScreen
  ↓
useEffect calls loadTodayCheckIn(userId)
  ↓
Store fetches today's check-in from DB
  ↓
If found, loads into state
  ↓
Form pre-fills with existing data
  ↓
User adjusts sliders & notes
  ↓
Submits form
  ↓
Store calls updateCheckIn() or saveCheckIn()
  ↓
Service updates/inserts in DB
  ↓
Store updates state
  ↓
generateRecommendations() is called
  ↓
Recommendations loaded into store
  ↓
User sees success message
```

### 3. Goal Creation Flow
```
User navigates to GoalsScreen
  ↓
useEffect calls loadGoals(userId)
  ↓
Store fetches all active goals
  ↓
Grouped by pillar in display
  ↓
User clicks "Add Goal"
  ↓
Modal opens with pillar selector
  ↓
User fills title, description, target date
  ↓
Clicks "Create Goal"
  ↓
Store calls createGoal()
  ↓
Service inserts into DB
  ↓
Optimistically add to state
  ↓
Modal closes
  ↓
Goal appears in list
```

## Key Architecture Decisions

### 1. Expo Router vs React Navigation
✅ **Chose**: Expo Router
- File-based routing (Next.js style)
- Built-in linking support
- Auth-aware route groups
- Better DX

### 2. Zustand vs Redux/Context
✅ **Chose**: Zustand
- Minimal boilerplate
- Hooks-first API
- Great for React Native
- Can persist to AsyncStorage

### 3. Supabase vs Firebase
✅ **Chose**: Supabase
- PostgreSQL (relational)
- Open source
- Better SQL control
- Real-time subscriptions
- Edge functions for custom logic

### 4. Service Layer Pattern
✅ **Included**
- Decouples components from Supabase
- Easy to test (mock service)
- Single place to change API calls
- Consistent error handling

### 5. Thick Screens vs Container Pattern
✅ **Chose**: Thick Screens
- Simpler with Zustand (no need for containers)
- Clearer data flow
- Less boilerplate

## Extensibility Points

### Add New Feature
1. Create service functions in `supabase.ts`
2. Add store actions in `dataStore.ts`
3. Create screen component in `screens/`
4. Add route in `app/(main)/`
5. Link from existing screens

### Add New Table
1. Create table in Supabase
2. Add service CRUD in `supabase.ts`
3. Add store slice in `dataStore.ts`
4. Create screen component
5. Add types to `types/index.ts`

### Add Authentication Method
1. Add to `authService` in `supabase.ts`
2. Add store action in `authStore.ts`
3. Create auth screen
4. Link from welcome screen

## Performance Considerations

### Optimizations Included
- ✅ Code splitting via route groups
- ✅ Lazy loading of screens
- ✅ Memoization of store selectors
- ✅ AsyncStorage persistence

### Potential Future Optimizations
- [ ] Pagination for goal/check-in lists
- [ ] Image caching
- [ ] Network request debouncing
- [ ] Realtime subscriptions
- [ ] Offline-first with SQLite

## Testing Strategy

### Current
- Manual testing via Expo

### Recommended
- **Unit**: Test store actions
- **Integration**: Test service calls
- **E2E**: Test user flows with Detox

### Example Unit Test
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '@/store/authStore';

test('sign in sets user', async () => {
  const { result } = renderHook(() => useAuthStore());
  
  await act(async () => {
    await result.current.signIn('test@test.com', 'password');
  });
  
  expect(result.current.isSignedIn).toBe(true);
  expect(result.current.user?.email).toBe('test@test.com');
});
```

## Security Considerations

### Implemented
- ✅ Auth with Supabase (OAuth, email/password)
- ✅ Session persistence via AsyncStorage
- ✅ Automatic token refresh
- ✅ User data isolated by user_id

### Recommended
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Implement email verification
- [ ] Add 2FA
- [ ] Rate limit API calls
- [ ] Encrypt sensitive data
- [ ] Monitor for suspicious activity
- [ ] Regular security audits

### RLS Example
```sql
-- Only allow users to see their own data
CREATE POLICY "Users see own data"
ON daily_check_ins
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own data"
ON daily_check_ins
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Deployment Architecture

### Current (Development)
```
Local Dev → Expo Metro → Device/Emulator
```

### Production (EAS)
```
Git Push
  ↓
EAS Build
  ↓
EAS Submit (to App Store/Play Store)
  ↓
Users download from store
  ↓
Auto updates via EAS Updates
```

### Recommended Setup
```
GitHub Repo
  ↓ (on push to main)
GitHub Actions (lint, test)
  ↓
EAS Build (if tests pass)
  ↓
TestFlight/Beta Testing
  ↓ (after approval)
EAS Submit (production)
```

## Monitoring & Analytics

### Recommended Tools
- **Sentry**: Error tracking
- **Firebase Analytics**: User behavior
- **LogRocket**: Session replay
- **Mixpanel**: Funnel analysis

### Key Metrics to Track
- Sign-up conversion rate
- Daily active users (DAU)
- Check-in completion rate
- Goal completion rate
- Feature usage by pillar
- Crash rate
- Session duration

## Maintenance & Updates

### Dependencies
- Update Expo SDK semi-annually
- Update Supabase SDK as needed
- Monitor security advisories

### Database Migrations
- Use Supabase migrations
- Version control schema changes
- Test migrations on staging first

### API Changes
- Update service layer only
- Components automatically see changes
- No recompilation needed (with hot reload)
