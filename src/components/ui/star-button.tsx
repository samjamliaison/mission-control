import { Star } from 'lucide-react'
import { useStarred, StarredItem } from '@/hooks/use-starred'
import { cn } from '@/lib/utils'

interface StarButtonProps {
  item: Omit<StarredItem, 'timestamp'>
  className?: string
  size?: number
}

export function StarButton({ item, className, size = 16 }: StarButtonProps) {
  const { isStarred, toggleStar } = useStarred()
  const starred = isStarred(item.id, item.type)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleStar(item)
      }}
      className={cn(
        "p-1 rounded hover:bg-accent transition-colors",
        className
      )}
      title={starred ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        size={size}
        className={cn(
          "transition-colors",
          starred
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground hover:text-foreground"
        )}
      />
    </button>
  )
}