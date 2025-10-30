# Movie Database Explorer - Setup Guide

## Quick Start

### 1. Get Your TMDB API Key

1. Go to [TMDB website](https://www.themoviedb.org/)
2. Create a free account or log in
3. Navigate to Settings → API
4. Request an API key (choose "Developer" option)
5. Fill out the required information
6. Copy your API key (v3 auth)

### 2. Configure the Application

1. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   ```

### 3. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Features Guide

### 🎬 Browse Movies
- The homepage displays trending movies by default
- Scroll down to load more movies automatically (infinite scroll)
- Hover over movie cards to see additional information

### 🔍 Search
- Use the search bar at the top to find specific movies
- Results update as you type (live search)
- Clear search with the X button

### 🎭 Filters
- **Genre Filter**: Select from various movie genres (Action, Comedy, Drama, etc.)
- **Rating Filter**: Filter movies by minimum rating (7+, 8+, 9+ stars)
- **Clear Filters**: Reset all filters to see all movies

### ⭐ Favorites/Watchlist
- Click the heart icon on any movie card to add/remove from favorites
- Access your favorites by clicking "Favorites" button in the header
- Favorites are stored in browser's local storage

### 📝 Movie Details
- Click on any movie card to open the detailed modal
- View full overview, ratings, release date, runtime, and genres
- Add to favorites directly from the modal
- Close modal by clicking the X button or clicking outside

### 📱 Responsive Design
- Optimized for all screen sizes
- Mobile-friendly interface
- Touch-friendly interactions

## Troubleshooting

### No Movies Displayed
- Check if your TMDB API key is correctly set in `.env.local`
- Ensure the environment variable name is exactly `NEXT_PUBLIC_TMDB_API_KEY`
- Restart the development server after changing environment variables

### Images Not Loading
- TMDB image domains are configured in `next.config.js`
- Verify your internet connection
- Some movies may not have poster images

### Build Errors
- Clear the `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (recommended: v18 or higher)

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: TMDB (The Movie Database)
- **State Management**: React Hooks
- **Storage**: Browser LocalStorage

## Project Structure

```
.
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page with main logic
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── MovieCard.tsx    # Individual movie card
│   ├── MovieModal.tsx   # Movie details modal
│   ├── SearchBar.tsx    # Search input
│   └── FilterBar.tsx    # Genre and rating filters
├── lib/                 # Utility functions
│   ├── tmdb.ts          # TMDB API client
│   └── favorites.ts     # Favorites management
├── types/               # TypeScript type definitions
│   └── movie.ts         # Movie-related types
├── public/              # Static assets
└── next.config.js       # Next.js configuration
```

## API Rate Limits

TMDB API has rate limits:
- Free tier: 40 requests every 10 seconds
- The app implements caching to minimize API calls
- Consider implementing additional caching for production use

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add `NEXT_PUBLIC_TMDB_API_KEY` in environment variables
4. Deploy

### Other Platforms
- Ensure environment variables are set
- Build command: `npm run build`
- Start command: `npm start`
- Node.js version: 18+

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or commercial purposes.
