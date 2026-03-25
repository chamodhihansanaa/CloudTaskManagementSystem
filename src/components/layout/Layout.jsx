import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        const handleRouteChange = () => setSidebarOpen(false);
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarOpen && !e.target.closest('aside') && !e.target.closest('button')) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Navbar setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                        <p>&copy; 2024 TaskFlow. All rights reserved.</p>
                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                            <a href="#" className="hover:text-gray-700">Privacy</a>
                            <a href="#" className="hover:text-gray-700">Terms</a>
                            <a href="#" className="hover:text-gray-700">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;