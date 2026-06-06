# Northstar4Life - Setup & Configuration Guide

## Project Overview

Northstar4Life is a React Native Expo app that helps users manage five life pillars: Health, Wealth, Career, Relationships, and Goals. Users can perform daily check-ins, track goals, and receive AI-powered recommendations.

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Supabase** for backend & authentication
- **Zustand** for state management
- **Date-fns** for date handling

## Project Structure

```
src/
├── app/                    # Expo Router routes
│   ├── (auth)/            # Auth flows (welcome, signup, signin, etc)
│   └── (main)/            # Main app screens (home, goals, etc)
├── screens/               # Screen components
│   ├── auth/              # Auth-related screens
│   ├── onboarding/        # Onboarding screens
│   └── main/              # Main app screens
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI components (Button, Card, Input, etc)
│   └── layouts/           # Layout wrappers (SafeLayout)
├── store/                 # Zustand state management
│   ├── authStore.ts       # Auth state & actions
│   └── dataStore.ts       # App data state & actions
├── services/              # API & Supabase integration
│   └── supabase.ts        # Supabase client & service functions
├── types/                 # TypeScript type definitions
├── constants/             # App constants (colors, spacing, etc)
├── utils/                 # Utility functions
└── hooks/                 # Custom React hooks
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### 2. Install Dependencies

```bash
cd northstar4life
npm install
```

### 3. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Get your Supabase URL and Anon Key
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Update `.env.local` with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Setup Supabase Database

Create the following tables in your Supabase project:

#### Users Table
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

#### Daily Check-ins Table
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

#### Goals Table
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

#### Daily Recommendations Table
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

### 5. Run the App

For development:

```bash
npm start
```

Then choose your platform:
- Press `i` for iOS (requires macOS)
- Press `a` for Android
- Press `w` for web

## Features

### Implemented MVP Features

1. **Onboarding**
   - Welcome screen
   - Signup & signin flows
   - Password reset
   - Account setup

2. **Daily Check-in**
   - Score each of 5 life pillars (0-100)
   - Add reflection notes
   - View daily overall score

3. **Life Score Dashboard**
   - Display overall life score
   - Show individual pillar scores
   - Visual progress bars
   - User greeting & profile summary

4. **Goal Tracker**
   - Create goals per pillar
   - Track progress (0-100%)
   - Update milestones
   - Delete goals
   - View goals by pillar

5. **AI Recommendations** (Mock)
   - Daily recommendations per pillar
   - Actionable items
   - Focus on lowest pillar
   - Customizable actions

6. **Profile Management**
   - View account info
   - Manage subscription (free/premium)
   - Sign out
   - Links to policies & support

### Subscription-Ready Structure

The app includes:
- `subscription` field in user model
- Subscription badge in profile
- Upgrade to Premium button
- Foundation for premium features

## State Management

### Auth Store (Zustand)
- User authentication state
- Sign up, sign in, sign out, password reset
- Session persistence

### Data Store (Zustand)
- Daily check-in management
- Goal management
- Recommendations
- Life score calculations

## Styling & Theme

- **Colors**: Defined in `src/constants/theme.ts`
- **Pillar Colors**:
  - Health: Pink (#ec4899)
  - Wealth: Teal (#14b8a6)
  - Career: Violet (#8b5cf6)
  - Relationships: Rose (#f43f5e)
  - Goals: Blue (#3b82f6)

- **Components**: Reusable in `src/components/ui/`
  - Button: Primary, secondary, tertiary variants
  - Card: Default, elevated
  - Input: Text input with labels & errors
  - Slider: Range input for scores
  - ProgressBar: Visual progress display

## Development Tips

### Adding New Screens

1. Create screen component in `src/screens/[category]/`
2. Create route file in `src/app/[layout]/`
3. Add to navigation structure
4. Import and use in route

### Adding New Data Services

1. Create service functions in `src/services/supabase.ts`
2. Add corresponding store actions in `src/store/dataStore.ts`
3. Use in components via `useDataStore()` hook

### Building for Production

```bash
# Type check
npm run type-check

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Next Steps & Future Features

- [ ] Push notifications for daily reminders
- [ ] Weekly summary reports
- [ ] Social features (share goals with friends)
- [ ] Advanced analytics & charts
- [ ] Integration with fitness APIs
- [ ] Voice notes for reflections
- [ ] Community challenges
- [ ] Premium analytics dashboard

## Support & Documentation

- **Expo Docs**: https://docs.expo.dev/
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev/

## License

This project is private and proprietary.
