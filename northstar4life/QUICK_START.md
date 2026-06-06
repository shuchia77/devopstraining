# Quick Start Guide - Northstar4Life

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd northstar4life
npm install
```

### 2. Configure Supabase
1. Create account at https://supabase.com
2. Create new project
3. Copy your **Project URL** and **Anon Key**
4. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
5. Edit `.env.local` with your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
   ```

### 3. Setup Database Tables
In your Supabase dashboard, go to **SQL Editor** and run these queries:

**Query 1: Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar TEXT,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Query 2: Daily Check-ins Table**
```sql
CREATE TABLE daily_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  scores JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

**Query 3: Goals Table**
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Query 4: Recommendations Table**
```sql
CREATE TABLE daily_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pillar TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  action_items JSONB DEFAULT '[]',
  generated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date, pillar)
);
```

### 4. Run the App
```bash
npm start
```

Choose your platform:
- Press `i` for iOS (Mac only)
- Press `a` for Android
- Press `w` for Web

## Test Credentials

After signup, use any email/password to create an account. The app will:
1. Create user in Supabase
2. Redirect to onboarding screens
3. Then navigate to home screen

## Key Features to Test

### 1. Authentication
- Welcome screen with 5 pillars overview
- Sign up with validation
- Sign in
- Password reset email

### 2. Daily Check-in
- Set scores for each pillar (0-100)
- Add reflection notes
- View calculated overall score
- Update existing check-in

### 3. Dashboard
- Display today's overall score
- Show all 5 pillar scores with progress bars
- Quick action buttons
- User greeting with date
- Motivational message when score < 50

### 4. Goals
- Create goal per pillar
- Set target date and description
- Track progress (0-100%)
- Update progress by +10%
- Delete goals
- View goals grouped by pillar

### 5. Recommendations
- View daily recommendations per pillar
- See action items
- Focus card highlights lowest pillar
- Mock data populated for all 5 pillars

### 6. Profile
- View account details
- See subscription status
- Upgrade to Premium button
- Links to policies
- Sign out button

## Project Structure at a Glance

```
src/
├── app/                     # Routes
├── screens/                 # Full screen components  
├── components/
│   ├── ui/                 # Reusable UI blocks
│   └── layouts/            # SafeLayout wrapper
├── store/                  # Zustand state (auth & data)
├── services/supabase.ts    # All API calls
├── types/index.ts          # TypeScript types
├── constants/theme.ts      # Colors, spacing
└── utils/                  # Helper functions
```

## Component System

### Basic Building Blocks
- **Button** - Primary, secondary, tertiary with sizes
- **Card** - Default, elevated variants
- **Input** - Text with labels, validation, errors
- **Slider** - 0-100 range with visual marks
- **ProgressBar** - Shows percentage with label

### Layouts
- **SafeLayout** - Handles safe area, keyboard, scrolling

## State Management (Zustand)

### Auth Store
```typescript
const { user, isSignedIn, signIn, signUp, signOut } = useAuthStore();
```

### Data Store
```typescript
const { 
  todayCheckIn, loadTodayCheckIn, saveCheckIn,
  goals, loadGoals, createGoal,
  lifeScore 
} = useDataStore();
```

## Colors & Theme

### Pillar Colors
```
Health:        🎨 #ec4899 (Pink)
Wealth:        🎨 #14b8a6 (Teal)
Career:        🎨 #8b5cf6 (Violet)
Relationships: 🎨 #f43f5e (Rose)
Goals:         🎨 #3b82f6 (Blue)
```

### Primary Colors
```
Primary:   #6366f1 (Indigo)
Secondary: #f59e0b (Amber)
Success:   #10b981 (Emerald)
Error:     #ef4444 (Red)
```

## Common Tasks

### Add a New Screen
1. Create component in `src/screens/[category]/`
2. Create route in `src/app/[layout]/screenname.tsx`
3. Add to relevant layout
4. Link from other screens

### Add Data to Store
1. Create service function in `src/services/supabase.ts`
2. Add store action in `src/store/dataStore.ts`
3. Call from component: `const { action } = useDataStore()`

### Create New Component
1. Add to `src/components/ui/[ComponentName].tsx`
2. Export from parent
3. Use across screens

## TypeScript Types

All types in `src/types/index.ts`:
- `LifePillar` - 'health' | 'wealth' | 'career' | 'relationships' | 'goals'
- `User` - Auth user with subscription
- `DailyCheckIn` - Today's scores & notes
- `Goal` - Single goal with progress
- `DailyRecommendation` - AI recommendation

## Environment Variables

Create `.env.local` (gitignored):
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
```

## Debugging Tips

### See Network Calls
Open browser DevTools → Network tab

### Check State
Install React DevTools browser extension

### Logs
```bash
npm start
# Press `i` in console for logs
```

### Reset App State
Delete app data or:
```typescript
// In code temporarily
localStorage.clear();
```

## Production Checklist

- [ ] Set real Supabase URL & key
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Create Supabase policies for data access
- [ ] Test auth flows end-to-end
- [ ] Implement AI recommendation generation
- [ ] Add push notifications
- [ ] Setup analytics
- [ ] Create privacy policy & terms
- [ ] Setup error tracking (Sentry)
- [ ] Optimize images & assets

## Troubleshooting

### App Won't Start
```bash
npm start
# Clear cache if needed:
expo start --clear
```

### Auth Not Working
- Check `.env.local` has correct credentials
- Verify Supabase project is live
- Check network connectivity

### Database Tables Not Found
- Run SQL queries in Supabase SQL Editor
- Verify table names match code (snake_case)

### Data Not Persisting
- Check Supabase Row Level Security settings
- Verify user ID matches authenticated user
- Check network tab for errors

## Next Steps

1. **Test all flows** - Create account, check-in, goals
2. **Customize colors** - Edit `src/constants/theme.ts`
3. **Add AI** - Implement recommendation generation in Supabase
4. **Test on device** - Use Expo Go app or build APK/IPA
5. **Deploy** - Use Expo Application Services (EAS)

## Need Help?

- Check `SETUP.md` for full documentation
- Review Expo docs: https://docs.expo.dev
- Supabase docs: https://supabase.com/docs
- React Native docs: https://reactnative.dev
