# Swipe Movie

Swipe Movie is a web application that allows users to browse and swipe through a curated list of movies. Users can swipe right to like a movie or swipe left to pass. The app provides an intuitive and engaging way to discover new films.

## Features

- Browse movies with swipe gestures
- Like or pass movies by swiping right or left
- View detailed information about each movie
- Responsive design for mobile and desktop
- Real-time room creation and swiping with friends
- Matches system when two users like the same movie

## Monorepo Structure

This project is organized as a **monorepo** with two main apps:

- **`apps/web`** → Next.js frontend
- **`apps/api`** → NestJS backend

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swipe-movie.git
   ```
2. Navigate to the project directory:
   ```bash
   cd swipe-movie
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Available scripts (root)

- `npm run dev:web` → Start the **frontend** only
- `npm run dev:api` → Start the **backend** only
- `npm run dev` → Start both frontend & backend concurrently (default for development)
- `npm run db:migrate` → Run Prisma migrations
- `npm run db:studio` → Open Prisma Studio (GUI for database)
- `npm run db:generate` → Regenerate Prisma client
- `npm run db:reset` → Drop, re-migrate, and reset the database (⚠️ destructive)

After installing, simply run:

```bash
npm run dev
```

This will start:
- Web app at [http://localhost:3000](http://localhost:3000)
- API at [http://localhost:3001](http://localhost:3001)

## Usage

- Open the web app and log in with your account.
- Create or join a room to start swiping.
- Swipe right 👍 to like a movie or left 👎 to pass.
- If two users like the same movie → a match is created!

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
