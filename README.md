# ⚽ Fantasy Soccer Dashboard

A production-ready fantasy soccer dashboard where users can track players, compare stats, and build a fantasy team with real-time calculations and interactive visualizations.

## Features

### 🎯 Core Features
- **Player Search & Discovery**: Search and filter players by position, club, or performance
- **Fantasy Team Builder**: Build your 11-player team with validation rules
- **Real-time Scoring**: Automatic calculation of fantasy scores using configurable formulas
- **Interactive Charts**: 
  - Line chart for player performance trends
  - Pie chart for team composition analysis
  - Bar chart for player comparison
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Advanced Filtering**: Sort by fantasy score, goals, assists, appearances
- **Dual View Modes**: Grid view (cards) and table view

### 🛠️ Technical Features
- **TypeScript**: Full type safety across the stack
- **Caching**: Smart API caching to minimize data fetches
- **State Management**: React Context + useReducer for predictable state
- **REST API**: Comprehensive Express.js backend with validation
- **Data Validation**: Team composition rules enforcement
- **Error Handling**: Robust error management and user feedback

## Project Structure

```
fantasy-soccer-dashboard/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── index.ts           # Express server & endpoints
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── scoring.ts         # Fantasy score calculations
│   │   ├── mockData.ts        # Mock player data
│   │   └── cache.ts           # Caching service
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── PlayersGrid.tsx
│   │   │   ├── PlayersTable.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── TeamSummary.tsx
│   │   │   └── charts/        # Chart components
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── api/
│   │   │   └── client.ts      # API client
│   │   ├── context/
│   │   │   └── FantasyContext.tsx  # State management
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript types
│   │   ├── utils/
│   │   │   └── calculations.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

## Installation

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000 npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Players
- `GET /players` - List all players
  - Query params: `position` (GK|DEF|MID|FWD), `sortBy` (fantasyScore|goals|assists)
- `GET /players/:id` - Get single player
- `GET /players/:id/stats` - Get player statistics
- `GET /players/:id/fantasyScore` - Get calculated fantasy score
- `GET /topPlayers?limit=10` - Get top players leaderboard

### Team Management
- `POST /validate-team` - Validate team composition
- `POST /calculate-team-score` - Calculate total team fantasy score
- `POST /custom-scoring` - Calculate scores with custom formula

### System
- `GET /health` - Health check
- `POST /clear-cache` - Clear the cache

## Fantasy Score Formula

Default scoring formula:
```
fantasyScore = goals × 4 + assists × 3 + cleanSheets × 2 - yellowCards × 1 - redCards × 3
```

### Customizable Formula
You can use custom scoring formulas via the API or context:
```typescript
{
  goalsMultiplier: 4,
  assistsMultiplier: 3,
  cleanSheetsMultiplier: 2,
  yellowCardsPenalty: 1,
  redCardsPenalty: 3
}
```

## Team Validation Rules

✅ **Valid Teams Must Have:**
- Exactly 11 players
- At least 1 goalkeeper (max 3)
- Between 3-6 defenders
- Between 2-5 midfielders
- Between 1-3 forwards

## Scoring Features

### 📊 Available Statistics
- Goals scored
- Assists provided
- Clean sheets (defenders/goalkeepers)
- Yellow/Red cards
- Appearances
- Average rating per appearance

### 📈 Sorting Options
- Fantasy Score (default)
- Goals
- Assists
- Appearances

## State Management

Using React Context + useReducer:
```typescript
interface FantasyState {
  teamPlayers: Player[];
  totalScore: number;
  scoringFormula: ScoringFormula;
  filters: { position?: string; sortBy?: string };
  isLoading: boolean;
  error?: string;
}
```

Actions: ADD_PLAYER, REMOVE_PLAYER, UPDATE_TOTAL_SCORE, SET_FORMULA, SET_FILTER, CLEAR_TEAM

## Technologies Used

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **node-cache** - In-memory caching
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React Chart.js 2** - Chart components
- **Lucide React** - Icons
- **Axios** - API requests

## Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Performance Optimizations

1. **API Caching**: 10-minute TTL on player data
2. **Memoization**: useMemo for filtered players
3. **Lazy Loading**: Charts only render when team has players
4. **Code Splitting**: React lazy loading ready
5. **Image Optimization**: Fallback for missing player photos

## Error Handling

- Try-catch blocks on all async operations
- User-friendly error messages in context
- Fallback UI components
- Network error handling
- Validation on both client and server

## Future Enhancements

- [ ] Drag-and-drop team rearrangement
- [ ] User authentication & profiles
- [ ] Team persistence (local storage / DB)
- [ ] Leaderboard with user rankings
- [ ] Real API integration (SofaScore, Rapid API)
- [ ] Advanced filters (league, season, price range)
- [ ] Team export/sharing
- [ ] Performance history tracking
- [ ] WebSocket for live score updates
- [ ] Progressive Web App (PWA)

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Built with ❤️ using React, TypeScript & Node.js**
