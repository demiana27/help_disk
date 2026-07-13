import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SubmitRequest from './pages/SubmitRequest';
import MyRequests from './pages/MyRequests';
import SupportDashboard from './pages/SupportDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import RequestDetails from './pages/RequestDetails';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      dark: '#4f46e5',
      light: '#818cf8',
    },
    secondary: {
      main: '#fb923c',
    },
    background: {
      default: '#0b0f19',
      paper: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    error: {
      main: '#f43f5e',
    },
    success: {
      main: '#4ade80',
    },
    warning: {
      main: '#fb923c',
    },
    info: {
      main: '#38bdf8',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Employee Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <Layout>
                    <EmployeeDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-request"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <Layout>
                    <SubmitRequest />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <Layout>
                    <MyRequests />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Support Routes */}
            <Route
              path="/support"
              element={
                <ProtectedRoute allowedRoles={['Support', 'Manager']}>
                  <Layout>
                    <SupportDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <Layout>
                    <ManagerDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Common Details Route */}
            <Route
              path="/requests/:id"
              element={
                <ProtectedRoute allowedRoles={['Employee', 'Support', 'Manager']}>
                  <Layout>
                    <RequestDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
