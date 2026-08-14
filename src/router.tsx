import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Pages
import { LoginPage } from '@/pages/Login'
import { PropertiesPage } from '@/pages/Properties/PropertiesPage'
import { PropertyDetailPage } from '@/pages/Properties/PropertyDetailPage'
import { NewPropertyPage } from '@/pages/Properties/NewPropertyPage'
import { EditPropertyPage } from '@/pages/Properties/EditPropertyPage'
import { RoomDetailPage } from '@/pages/Properties/RoomDetailPage'
import { TenantsPage } from '@/pages/Tenants/TenantsPage'
import { NewTenantPage } from '@/pages/Tenants/NewTenantPage'
import { SettingsPage } from '@/pages/Settings/SettingsPage'
import { Layout } from '@/components/layouts/Layout'

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

// Public route wrapper (redirect to dashboard if logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/properties" replace />,
  },
  {
    path: '/dashboard',
    element: <Navigate to="/properties" replace />,
  },
  {
    path: '/properties',
    element: (
      <ProtectedRoute>
        <PropertiesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/properties/new',
    element: (
      <ProtectedRoute>
        <NewPropertyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/properties/:id',
    element: (
      <ProtectedRoute>
        <PropertyDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/properties/:id/edit',
    element: (
      <ProtectedRoute>
        <EditPropertyPage />
      </ProtectedRoute>
    ),
  },
  // Room routes (flat URL - accessible from anywhere)
  {
    path: '/rooms/:id',
    element: (
      <ProtectedRoute>
        <RoomDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tenants',
    element: (
      <ProtectedRoute>
        <TenantsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tenants/new',
    element: (
      <ProtectedRoute>
        <NewTenantPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
