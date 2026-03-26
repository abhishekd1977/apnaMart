import { Link } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import BookCard from '@/components/books/BookCard'

const stats = [
  { value: '10,000+', label: 'Books' },
  { value: '2,000+',  label: 'Authors' },
  { value: '50,000+', label: 'Readers' },
  { value: '50+',     label: 'Genres' },
]

const categories = [
  { name: 'Fiction',     emoji: '📖', from: 'from-violet-500', to: 'to-indigo-500' },
  { name: 'Science',     emoji: '🔬', from: 'from-blue-500',   to: 'to-cyan-400'  },
  { name: 'History',     emoji: '🏛️', from: 'from-amber-500',  to: 'to-orange-400'},
  { name: 'Self Help',   emoji: '🌱', from: 'from-green-500',  to: 'to-emerald-400'},
  { name: 'Technology',  emoji: '💻', from: 'from-slate-600',  to: 'to-gray-500'  },
  { name: 'Art & Design',emoji: '🎨', from: 'from-pink-500',   to: 'to-rose-400'  },
]

export default function HomePage() {
  const { data, isLoading } = useBooks({ size: 8, sort: 'createdAt,desc' })

  return (
    <div className="space-y-16">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-10 md:p-16 text-white">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl" />

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/15 text-primary-300 text-xs font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-dot" />
            New arrivals every week
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-5">
            Your next great{' '}
            <span className="bg-gradient-to-r from-primary-400 to-amber-300 bg-clip-text text-transparent">
              read
            </span>
            {' '}awaits
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
            Discover thousands of books across every genre — from bestsellers to hidden gems, curated just for you.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/books"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary-900/60 hover:-translate-y-px hover:shadow-xl"
            >
              Explore Books →
            </Link>
            <Link
              to="/register"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 transition-all hover:-translate-y-px"
            >
              Join Free
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 px-3">
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Genre ── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Discover</p>
            <h2 className="text-2xl font-bold text-gray-900">Browse by Genre</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/books"
              className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.from} ${cat.to} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-200`}>
                {cat.emoji}
              </div>
              <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-900 text-center transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Fresh In</p>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          <Link
            to="/books"
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 group"
          >
            View All
            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-2/3" />
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            {data?.content.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
