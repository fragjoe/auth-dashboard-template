import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

interface AlertDialogContentProps {
  className?: string
  children: ReactNode
}

interface AlertDialogHeaderProps {
  className?: string
  children: ReactNode
}

interface AlertDialogFooterProps {
  className?: string
  children: ReactNode
}

interface AlertDialogTitleProps {
  className?: string
  children: ReactNode
}

interface AlertDialogDescriptionProps {
  className?: string
  children: ReactNode
}

interface AlertDialogActionProps {
  onClick?: () => void
  variant?: 'default' | 'destructive' | 'outline'
  children: ReactNode
  className?: string
  disabled?: boolean
}

interface AlertDialogCancelProps {
  onClick?: () => void
  children: ReactNode
  className?: string
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      {/* Content */}
      <div
        className="relative bg-white rounded-2xl shadow-lg border max-w-md w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

function AlertDialogContent({ className, children }: AlertDialogContentProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}

function AlertDialogHeader({ className, children }: AlertDialogHeaderProps) {
  return <div className={cn('flex flex-col space-y-2 mb-4', className)}>{children}</div>
}

function AlertDialogFooter({ className, children }: AlertDialogFooterProps) {
  return (
    <div className={cn('flex justify-end gap-3 mt-6', className)}>
      {children}
    </div>
  )
}

function AlertDialogTitle({ className, children }: AlertDialogTitleProps) {
  return <h2 className={cn('text-lg font-semibold text-foreground', className)}>{children}</h2>
}

function AlertDialogDescription({ className, children }: AlertDialogDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

function AlertDialogAction({
  onClick,
  variant = 'default',
  children,
  className,
  disabled,
}: AlertDialogActionProps) {
  return (
    <Button variant={variant} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </Button>
  )
}

function AlertDialogCancel({ onClick, children, className }: AlertDialogCancelProps) {
  return (
    <Button variant="outline" onClick={onClick} className={className}>
      {children}
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
