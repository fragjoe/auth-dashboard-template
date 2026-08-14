import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { RefreshCw } from '@phosphor-icons/react'

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  className?: string
}

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only start pulling if at top of page
    if (window.scrollY === 0 && !refreshing) {
      startY.current = e.touches[0].clientY
      isPulling.current = true
      setPulling(true)
    }
  }, [refreshing])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || refreshing) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)

    // Max pull distance 100px
    const clampedDistance = Math.min(distance, 100)
    setPullDistance(clampedDistance)
  }, [refreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return

    isPulling.current = false
    setPulling(false)

    // If pulled enough (50px), trigger refresh
    if (pullDistance >= 50 && !refreshing) {
      setRefreshing(true)

      // Haptic feedback
      navigator.vibrate?.(10)

      try {
        await onRefresh()
        // Success haptic
        navigator.vibrate?.([10, 30, 10])
      } catch (error) {
        // Error haptic
        navigator.vibrate?.([50, 30, 50, 30, 50])
      } finally {
        setRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [pullDistance, refreshing, onRefresh])

  // Calculate indicator opacity based on pull distance
  const indicatorOpacity = Math.min(pullDistance / 50, 1)

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden transition-all duration-150"
        style={{
          height: pullDistance > 0 ? pullDistance : 0,
          opacity: pulling ? indicatorOpacity : 0,
        }}
      >
        <div
          className={cn(
            'w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-150',
            refreshing && 'animate-spin'
          )}
          style={{
            transform: `rotate(${refreshing ? 360 : pullDistance * 3}deg)`,
          }}
        >
          <RefreshCw
            className={cn(
              'w-4 h-4 text-primary transition-colors',
              pullDistance >= 50 ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: pulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>

      {/* Loading Overlay */}
      {refreshing && (
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center animate-spin">
            <RefreshCw weight="bold" className="w-4 h-4 text-primary" />
          </div>
        </div>
      )}
    </div>
  )
}
