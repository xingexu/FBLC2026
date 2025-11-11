/**
 * Category chips component
 * Displays clickable category filters
 */
import { useAppStore } from '../store'

const CATEGORIES = [
  'food',
  'retail',
  'services',
  'health',
  'arts',
  'fitness',
  'repair',
  'books',
]

export function CategoryChips() {
  const { filters, setCategory } = useAppStore()
  const selectedCategory = filters.category

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
      <button
        onClick={() => setCategory(null)}
        className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          selectedCategory === null
            ? 'bg-black text-white border border-black glass-hover'
            : 'glass text-gray-700 hover:glass-light border border-gray-300 hover:animate-bounce-gentle'
        }`}
        aria-pressed={selectedCategory === null}
      >
        All
      </button>
      {CATEGORIES.map((category, index) => (
        <button
          key={category}
          onClick={() => setCategory(category)}
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 capitalize ${
            selectedCategory === category
              ? 'bg-black text-white border border-black glass-hover'
              : 'glass text-gray-700 hover:glass-light border border-gray-300 hover:animate-bounce-gentle'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
          aria-pressed={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

