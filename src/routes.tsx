import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { HomePage } from './components/user/HomePage';
import { LibraryPage } from './components/user/LibraryPage';
import { SearchPage } from './components/user/SearchPage';
import { AllSongsPage } from './components/user/AllSongsPage';
import { AllAlbumsPage } from './components/user/AllAlbumsPage';
import { AllArtistsPage } from './components/user/AllArtistsPage';
import { NotificationsPage } from './components/user/NotificationsPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
    path: '/artists',
    element: <AllArtistsPage />,
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