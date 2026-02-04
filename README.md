# 🏃 RaceRadar - Marathon & Race Aggregator

A beautiful, mobile-first app for discovering and signing up for endurance running races worldwide. From 5Ks to ultramarathons, find your next adventure.

![React Native](https://img.shields.io/badge/React_Native-0.76-61dafb?logo=react)
![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript)

## ✨ Features

- **Discover Races** - Browse upcoming races with beautiful cards and filtering
- **Smart Search** - Filter by distance (5K to Ultra), location, terrain, and date
- **Featured Races** - Highlighted carousel of popular and prestigious events
- **Race Details** - Full information including elevation, pricing, and registration links
- **Cross-Platform** - Works on iOS, Android, and Web from a single codebase
- **Beautiful UI** - Dark theme with vibrant color accents for each distance category

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
│   └── FeaturedRaces.tsx  # Featured carousel
├── constants/             # Theme and constants
│   └── theme.ts           # Colors, spacing, typography
├── data/                  # Type definitions
│   └── types.ts           # Race, Filter interfaces
├── services/              # API and data services
│   └── raceService.ts     # Race fetching logic
└── assets/               # Images, fonts, etc.
```

## 🎨 Design System

### Distance Categories
Each race distance has its own color for easy identification:
- **5K** - Teal (#4ECDC4)
- **10K** - Blue (#45B7D1)
- **Half Marathon** - Green (#96C93D)
- **Marathon** - Orange (#FF6B35)
- **Ultra** - Purple (#9B59B6)

### Theme
The app uses a dark theme with:
- Background: Deep navy (#0F0F1A)
- Cards: Dark blue (#16213E)
- Primary accent: Vibrant orange (#FF6B35)

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

Built with ❤️ for runners everywhere
