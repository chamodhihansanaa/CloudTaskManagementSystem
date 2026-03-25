import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, CheckCircle2, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/stats/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { apiService } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, tasks: 0, completed: 0, pending: 0 });
    const [recentTasks, setRecentTasks] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [users, tasks] = await Promise.all([
            apiService.getUsers(),
            apiService.getTasks()
        ]);

        setStats({
            users: users.length,
            tasks: tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            pending: tasks.filter(t => t.status === 'pending').length
        });
        setRecentTasks(tasks.slice(0, 5));
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button className="btn-primary">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={stats.users} icon={Users} color="blue" trend={12} />
                    <StatCard title="Total Tasks" value={stats.tasks} icon={CheckSquare} color="purple" trend={8} />
                    <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green" trend={24} />
                    <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" trend={-5} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                            <a href="/admin/tasks" className="text-sm text-blue-600 hover:text-blue-700">View all</a>
                        </div>
                        <div className="space-y-4">
                            {recentTasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full ${
                                            task.status === 'completed' ? 'bg-green-500' :
                                                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                                        }`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{task.title}</p>
                                            <p className="text-sm text-gray-500">Due {task.dueDate}</p>
                                        </div>
                                    </div>
                                    <Badge variant={
                                        task.priority === 'high' ? 'danger' :
                                            task.priority === 'medium' ? 'warning' : 'default'
                                    }>
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                            <Badge variant="success">Operational</Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Server Status</span>
                                <div className="flex items-center text-green-600">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Database</span>
                                <div className="flex items-center text-green-600">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">Connected</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">API Response</span>
                                <span className="text-sm font-medium text-gray-900">45ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Active Sessions</span>
                                <span className="text-sm font-medium text-gray-900">12</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;