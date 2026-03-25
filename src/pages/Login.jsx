import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { CheckSquare, Eye, EyeOff, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const { login } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const validateForm = () => {
        if (isRegistering) {
            if (!formData.name.trim()) return 'Name is required';
            if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
            if (formData.password.length < 6) return 'Password must be at least 6 characters';
        }
        if (!formData.email.trim()) return 'Email is required';
        if (!formData.password) return 'Password is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            let user;
            if (isRegistering) {
                user = await apiService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            } else {
                user = await apiService.login(formData.email, formData.password);
            }

            login(user);
            window.location.href = user.role === 'admin' ? '/admin' : '/dashboard';
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = (type) => {
        if (type === 'admin') {
            setFormData(prev => ({ ...prev, email: 'admin@example.com', password: 'password' }));
        } else {
            setFormData(prev => ({ ...prev, email: 'john@example.com', password: 'password' }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                        <CheckSquare className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {isRegistering ? 'Create account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isRegistering
                            ? 'Start managing your tasks efficiently today'
                            : 'Sign in to access your TaskFlow dashboard'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {isRegistering && (
                            <Input
                                label="Full Name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                icon={UserPlus}
                                placeholder="John Doe"
                                required
                            />
                        )}

                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                            placeholder="you@example.com"
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                icon={Lock}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {isRegistering && (
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                icon={Lock}
                                placeholder="••••••••"
                                required
                            />
                        )}
                    </div>

                    {!isRegistering && (
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full group"
                        isLoading={loading}
                        size="lg"
                    >
                        {isRegistering ? 'Create account' : 'Sign in'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isRegistering
                                ? 'Already have an account? Sign in'
                                : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </form>

                {/* Demo credentials */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 text-center">
                        Quick Demo Access
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('admin')}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Admin Demo
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('user')}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            User Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;