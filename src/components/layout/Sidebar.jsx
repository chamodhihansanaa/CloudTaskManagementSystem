import React from 'react';
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    LogOut,
    Menu,
    X,
    User,
    Settings,
    Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();

    const isAdmin = user?.role === 'admin';

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/tasks', icon: CheckSquare, label: 'All Tasks' },
        { to: '/admin/users', icon: Users, label: 'User Management' },
        { to: '/admin/profile', icon: User, label: 'Profile' },
    ];

    const userLinks = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    const handleNavigation = (to) => {
        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 bg-slate-800 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <CheckSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
                            {isAdmin && (
                                <span className="block text-xs text-blue-400 font-medium">Admin Panel</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = window.location.pathname === link.to;
                        return (
                            <button
                                key={link.to}
                                onClick={() => handleNavigation(link.to)}
                                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                }
                `}
                            >
                                <Icon className={`
                  w-5 h-5 mr-3 transition-colors
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                `} />
                                {link.label}
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                            </button>
                        );
                    })}
                </nav>

                {/* User info & Logout */}
                <div className="p-4 border-t border-slate-800 flex-shrink-0">
                    <div className="flex items-center px-4 py-3 mb-3 rounded-xl bg-slate-800/50">
                        <img
                            src={user?.avatar}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-600"
                        />
                        <div className="ml-3 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <div className="flex items-center text-xs text-gray-400">
                                {isAdmin && <Shield className="w-3 h-3 mr-1 text-purple-400" />}
                                <span className="capitalize">{user?.role}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    >
                        <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;