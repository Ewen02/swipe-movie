'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, X, Star, Clock, Film } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemoMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  genre: string;
  poster: string;
  gradient: string;
}

const demoMovies: DemoMovie[] = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    duration: '2h28',
    genre: 'Sci-Fi',
    poster: '🎬',
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    id: 2,
    title: 'Interstellar',
    year: 2014,
    rating: 8.7,
    duration: '2h49',
    genre: 'Sci-Fi',
    poster: '🚀',
    gradient: 'from-indigo-600 to-cyan-600',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    duration: '2h32',
    genre: 'Action',
    poster: '🦇',
    gradient: 'from-gray-800 to-gray-600',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    year: 1994,
    rating: 8.9,
    duration: '2h34',
    genre: 'Crime',
    poster: '🎭',
    gradient: 'from-yellow-600 to-red-600',
  },
  {
    id: 5,
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    duration: '2h12',
    genre: 'Thriller',
    poster: '🏠',
    gradient: 'from-emerald-600 to-teal-600',
  },
];

interface SwipeCardProps {
  movie: DemoMovie;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

function SwipeCard({ movie, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Indicators opacity
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      whileTap={isTop ? { scale: 1.02 } : undefined}
    >
      <Card className="h-full overflow-hidden border-2 border-white/10 bg-background/90 backdrop-blur-sm shadow-2xl">
        {/* Movie Poster Area */}
        <div className={`relative h-48 bg-gradient-to-br ${movie.gradient} flex items-center justify-center`}>
          <span className="text-7xl">{movie.poster}</span>

          {/* Like indicator */}
          <motion.div
            className="absolute top-4 right-4 px-4 py-2 bg-green-500 rounded-lg border-4 border-green-400 rotate-12"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-white font-bold text-xl">LIKE</span>
          </motion.div>

          {/* Nope indicator */}
          <motion.div
            className="absolute top-4 left-4 px-4 py-2 bg-red-500 rounded-lg border-4 border-red-400 -rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-white font-bold text-xl">NOPE</span>
          </motion.div>
        </div>

        {/* Movie Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <p className="text-muted-foreground">{movie.year}</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              {movie.rating}
            </Badge>
          </div>

          <div className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {movie.duration}
            </span>
            <span className="flex items-center gap-1">
              <Film className="w-4 h-4" />
              {movie.genre}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface InteractiveSwipeDemoProps {
  className?: string;
}

export function InteractiveSwipeDemo({ className = '' }: InteractiveSwipeDemoProps) {
  const [movies, setMovies] = useState(demoMovies);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    const current = movies[0];
    if (!current) return;

    if (direction === 'right') {
      setLiked(prev => [...prev, current.title]);
    } else {
      setPassed(prev => [...prev, current.title]);
    }

    // Remove the swiped card and add it back at the end for infinite loop
    setMovies(prev => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect behind cards */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Cards container */}
      <div
        ref={containerRef}
        className="relative w-72 h-80 mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {movies.slice(0, 3).map((movie, index) => (
            <SwipeCard
              key={movie.id}
              movie={movie}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <motion.button
          className="w-14 h-14 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleButtonSwipe('left')}
        >
          <X className="w-7 h-7" />
        </motion.button>

        <motion.button
          className="w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-500 hover:bg-green-500/20 hover:border-green-500/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleButtonSwipe('right')}
        >
          <Heart className="w-7 h-7" />
        </motion.button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-green-500" />
          {liked.length} likés
        </span>
        <span className="flex items-center gap-1">
          <X className="w-4 h-4 text-red-500" />
          {passed.length} passés
        </span>
      </div>

      {/* Instruction */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        Glissez la carte ou utilisez les boutons
      </p>
    </div>
  );
}
