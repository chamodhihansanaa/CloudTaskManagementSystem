import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle2, Clock, Edit2, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/stats/StatCard';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ myTasks: 0, completed: 0, dueToday: 0 });
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        const allTasks = await apiService.getTasks();
        const myTasks = allTasks.filter(t => t.assigneeId === user?.id);
        const today = new Date().toISOString().split('T')[0];

        setStats({
            myTasks: myTasks.length,
            completed: myTasks.filter(t => t.status === 'completed').length,
            dueToday: myTasks.filter(t => t.dueDate === today).length
        });
        setTasks(myTasks);
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
                        <p className="text-gray-600 mt-1">Here's what's happening with your tasks today.</p>
                    </div>
                    <Button>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        New Task
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="My Tasks" value={stats.myTasks} icon={CheckSquare} color="blue" />
                    <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green" />
                    <StatCard title="Due Today" value={stats.dueToday} icon={Clock} color="yellow" />
                </div>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Recent Tasks</h3>
                    <DataTable
                        columns={[
                            { header: 'Task', accessor: 'title' },
                            { header: 'Status', accessor: 'status', cell: (row) => (
                                    <Badge variant={
                                        row.status === 'completed' ? 'success' :
                                            row.status === 'in-progress' ? 'info' : 'warning'
                                    }>
                                        {row.status}
                                    </Badge>
                                )},
                            { header: 'Due Date', accessor: 'dueDate' },
                            { header: 'Priority', accessor: 'priority', cell: (row) => (
                                    <Badge variant={
                                        row.priority === 'high' ? 'danger' :
                                            row.priority === 'medium' ? 'warning' : 'default'
                                    }>
                                        {row.priority}
                                    </Badge>
                                )}
                        ]}
                        data={tasks}
                        actions={(row) => (
                            <>
                                <Button variant="ghost" size="sm">
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <CheckCircle className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                    />
                </Card>
            </div>
        </Layout>
    );
};

export default UserDashboard;