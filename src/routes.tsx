import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ConfirmEmailPage } from './components/ConfirmEmailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { HomePage } from './components/user/HomePage';
import { LibraryPage } from './components/user/LibraryPage';
import { SearchPage } from './components/user/SearchPage';
import { AllSongsPage } from './components/user/AllSongsPage';
import { AllAlbumsPage } from './components/user/AllAlbumsPage';
import { AllArtistsPage } from './components/user/AllArtistsPage';
import { ArtistDetailPage } from './components/user/ArtistDetailPage';
import { AlbumDetailPage } from './components/user/AlbumDetailPage';
import { NotificationsPage } from './components/user/NotificationsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UnauthorizedRoute } from './components/UnauthorizedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/login',
    element: (
      <UnauthorizedRoute avoidRoles={['admin', 'authorized']}>
        <LoginPage />
      </UnauthorizedRoute>
    )
  },  {
    path: '/register',
    element: (
      <UnauthorizedRoute avoidRoles={['admin', 'authorized']}>
        <RegisterPage />
      </UnauthorizedRoute>
    ),
  },
  {
    path: '/confirm-email',
    element: (
      <UnauthorizedRoute avoidRoles={['admin', 'authorized']}>
        <ConfirmEmailPage />
      </UnauthorizedRoute>
    )
  },
  {
    path: '/home',
    element: <HomePage />,
  },  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/songs',
    element: <AllSongsPage />,
  },
  {
    path: '/albums',
    element: <AllAlbumsPage />,
  },
  {
    path: '/albums/:albumId',
    element: <AlbumDetailPage />,
  },
  {
    path: '/artists',
    element: <AllArtistsPage />,
  },
  {
    path: '/artists/:artistId',
    element: <ArtistDetailPage />,
  },
  {
    path: '/library',
    element: (
      <ProtectedRoute allowedRoles={['authorized', 'admin']}>
        <LibraryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute allowedRoles={['authorized', 'admin']}>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['authorized', 'admin']}>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);