import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import TaskManagement from './pages/TaskManagement';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                </PrivateRoute>
            } />
            <Route path="/admin/tasks" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <TaskManagement isAdmin={true} />
                </PrivateRoute>
            } />
            <Route path="/admin/users" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <UserManagement />
                </PrivateRoute>
            } />
            <Route path="/admin/profile" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <Profile />
                </PrivateRoute>
            } />

            {/* User Routes */}
            <Route path="/dashboard" element={
                <PrivateRoute allowedRoles={['user', 'admin']}>
                    <UserDashboard />
                </PrivateRoute>
            } />
            <Route path="/tasks" element={
                <PrivateRoute allowedRoles={['user', 'admin']}>
                    <TaskManagement isAdmin={false} />
                </PrivateRoute>
            } />
            <Route path="/profile" element={
                <PrivateRoute allowedRoles={['user', 'admin']}>
                    <Profile />
                </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;