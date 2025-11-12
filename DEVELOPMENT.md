# Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd fantasy-soccer-dashboard
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

3. **Setup Frontend (in new terminal)**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on `http://localhost:3000`

## Backend Development

### Project Structure
```
backend/src/
├── index.ts       - Express server & route handlers
├── types.ts       - TypeScript interfaces & types
├── scoring.ts     - Fantasy score calculations & sorting
├── mockData.ts    - Mock player database
└── cache.ts       - Caching service
```

### Key Functions

#### Scoring
```typescript
calculateFantasyScore(stats: PlayerStats, formula?: ScoringFormula): number
calculateAverageScore(stats: PlayerStats, formula?: ScoringFormula): number
sortPlayers<T>(players: T[], sortBy: string): T[]
```

#### Validation
```typescript
validateTeamComposition(composition: TeamComposition): { valid: boolean; errors: string[] }
```

### Adding New Endpoints

1. Define types in `types.ts`
2. Add business logic in relevant files
3. Create route handler in `index.ts`
4. Test with cURL or Postman

Example:
```typescript
app.get('/api/new-endpoint', (req: Request, res: Response) => {
  try {
    const result = await someFunction();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error message' });
  }
});
```

### Caching Strategy

- Default TTL: 600 seconds (10 minutes)
- Players list: 600s TTL
- Single player: 600s TTL
- Top players: 600s TTL

Clear cache:
```bash
curl -X POST http://localhost:5000/clear-cache
```

## Frontend Development

### Project Structure
```
frontend/src/
├── api/
│   └── client.ts          - API client with axios
├── components/            - Reusable React components
│   ├── PlayerCard.tsx
│   ├── PlayersGrid.tsx
│   ├── PlayersTable.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   ├── TeamSummary.tsx
│   └── charts/            - Chart components
├── context/
│   └── FantasyContext.tsx  - State management
├── pages/
│   └── Dashboard.tsx       - Main page
├── types/
│   └── index.ts           - TypeScript types
├── utils/
│   └── calculations.ts    - Utility functions
└── App.tsx
```

### Component Hierarchy

```
App
└── Dashboard
    ├── TeamSummary
    ├── CompositionChart
    ├── ComparisonChart
    ├── SearchBar
    ├── FilterBar
    ├── PlayersGrid
    │   └── PlayerCard (repeated)
    └── PlayersTable
```

### State Management with Context

```typescript
// Using the context
const { state, addPlayer, removePlayer, updateTotalScore } = useFantasy();

// State shape
{
  teamPlayers: Player[],
  totalScore: number,
  scoringFormula: ScoringFormula,
  filters: { position?, sortBy? },
  isLoading: boolean,
  error?: string
}
```

### Adding New Features

1. **New Component**
```typescript
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  // Props definition
}

export function MyComponent({ ...props }: MyComponentProps) {
  return <div>{/* JSX */}</div>;
}
```

2. **Update State**
```typescript
// In FantasyContext.tsx
case 'NEW_ACTION':
  return { ...state, /* new state */ };
```

3. **Add API Endpoint**
```typescript
// In api/client.ts
async myNewMethod(): Promise<any> {
  const response = await this.client.get('/my-endpoint');
  return response.data.data;
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Color scheme:
  - Primary: `blue-500` / `blue-600`
  - Danger: `red-500` / `red-600`
  - Success: `green-500` / `green-600`
  - Warning: `yellow-500` / `yellow-600`
  - Neutral: `gray-500` / `gray-600`

### Common Component Patterns

#### Controlled Input
```typescript
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

#### Async Data Fetching
```typescript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getPlayers();
      setData(data);
    } catch (error) {
      setError('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [dependencies]);
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Add player to team
- [ ] Remove player from team
- [ ] Team validation (full team = 11 players)
- [ ] Score calculation
- [ ] Filter by position
- [ ] Search functionality
- [ ] Sort by different criteria
- [ ] View toggle (grid/table)
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] Error handling (bad API, network errors)

## Performance Tips

### Backend
1. Use caching for frequently accessed data
2. Validate input early
3. Use pagination for large datasets
4. Consider database queries optimization

### Frontend
1. Use React.memo() for expensive components
2. Use useMemo() for derived state
3. Lazy load images
4. Code splitting with React.lazy()
5. Avoid re-renders with proper dependency arrays

## Debugging

### Backend
```typescript
// Add console logs
console.log('Debug info:', data);

// Use TypeScript strict mode for better error checking
```

### Frontend
```typescript
// React DevTools
// Redux DevTools (if using Redux)
// Console logs
console.log('Component render:', props);
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name

# Create Pull Request
# Review and merge
```

## Deployment

### Docker
```bash
# Build and run with docker-compose
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=production
```

**Frontend (.env)**
```
REACT_APP_API_URL=https://api.example.com
```

## Troubleshooting

### Backend Issues

**Port already in use**
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**API connection error**
- Check backend is running
- Verify REACT_APP_API_URL is correct
- Check CORS configuration

**Build fails**
```bash
rm -rf build node_modules
npm install
npm run build
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

## Support

For questions or issues, open an issue in the repository or contact the development team.
