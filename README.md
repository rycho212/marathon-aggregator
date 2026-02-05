# 🏃 GetABib - Marathon & Race Aggregator

A beautiful, mobile-first app for discovering and signing up for endurance running races worldwide. From 5Ks to ultramarathons, find your next adventure.

![React Native](https://img.shields.io/badge/React_Native-0.76-61dafb?logo=react)
![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript)

## ✨ Features

- **Discover Races** - Browse upcoming races with beautiful cards and filtering
- **Smart Search** - Filter by distance (5K to Ultra), location, terrain, and date
- **Featured Races** - Highlighted carousel of popular and prestigious events
- **Race Details** - Full information including elevation, pricing, and registration links
- **Race Personality Quiz** - Get personalized race recommendations based on your running style
- **Cross-Platform** - Works on iOS, Android, and Web from a single codebase
- **Professional UI** - Clean, minimal design with responsive sidebar navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for mobile testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/rycho212/marathon-aggregator.git
cd marathon-aggregator

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 📱 Screenshots

Coming soon!

## 🏗️ Project Structure

```
marathon-aggregator/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Discover/Home screen
│   │   ├── search.tsx     # Advanced search
│   │   ├── saved.tsx      # Saved races
│   │   └── profile.tsx    # User profile
│   ├── race/[id].tsx      # Race detail page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── RaceCard.tsx       # Race listing card
│   ├── SearchBar.tsx      # Search input
│   ├── CategoryFilter.tsx # Distance filter chips
│   ├── FeaturedRaces.tsx  # Featured carousel
│   ├── Sidebar.tsx        # Left navigation (desktop)
│   ├── MobileNav.tsx      # Bottom navigation (mobile)
│   ├── PersonalityQuiz.tsx # Race personality quiz
│   └── PersonalityProfile.tsx # Personality results display
├── constants/             # Theme and constants
│   └── theme.ts           # Colors, spacing, typography
├── data/                  # Type definitions and data
│   ├── types.ts           # Race, Filter interfaces
│   └── runnerProfile.ts   # Personality types and quiz questions
├── services/              # API and data services
│   ├── raceService.ts     # Race fetching logic
│   └── recommendationEngine.ts # Personalized race scoring
└── assets/               # Images, fonts, etc.
```

## 🎨 Design System

### Colors
The app uses a clean, professional light theme:
- **Primary**: Mint (#00C9A7)
- **Background**: Light gray (#FAFBFC)
- **Text**: Dark slate (#0F172A)
- **Secondary text**: Gray (#475569)

### Typography
- Clean, minimal sans-serif fonts
- Light font weights for a sleek look
- Clear hierarchy with consistent sizing

### Layout
- Responsive sidebar navigation for desktop/tablet (768px+)
- Bottom navigation for mobile devices
- Clean card-based content layout

## 🔌 Data Sources

Currently integrated:
- **RunSignUp API** - Real race data from RunSignUp.com
- **Mock Data** - High-quality sample data for development

### Adding More Sources

The `services/raceService.ts` file is designed to be extensible. To add new data sources:

1. Create a new fetch function (e.g., `fetchRacesFromNewSource`)
2. Transform the data to match the `Race` interface
3. Combine with existing sources in the main fetch function

## 📋 Roadmap

- [ ] User authentication & saved races
- [ ] Push notifications for registration deadlines
- [ ] Race reviews and ratings
- [ ] Training plan integration
- [ ] Social features (follow friends, share races)
- [ ] Scraping from additional sources (Running USA, etc.)
- [ ] Maps integration showing race routes

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: React Native StyleSheet (no external CSS frameworks)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/)
- **Dates**: [date-fns](https://date-fns.org/)
- **Gradients**: [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built for runners everywhere
