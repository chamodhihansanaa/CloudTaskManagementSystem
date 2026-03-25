import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { apiService } from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await apiService.getUsers();
        setUsers(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = {
            name: formData.get('name'),
            email: formData.get('email'),
            role: formData.get('role')
        };

        if (editingUser) {
            await apiService.updateUser(editingUser.id, user);
        } else {
            await apiService.createUser(user);
        }

        loadUsers();
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await apiService.deleteUser(id);
            loadUsers();
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>

                <Card className="p-6">
                    <DataTable
                        columns={[
                            { header: 'User', accessor: 'name', cell: (row) => (
                                    <div className="flex items-center">
                                        <img src={row.avatar} alt="" className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">{row.name}</p>
                                            <p className="text-sm text-gray-500">{row.email}</p>
                                        </div>
                                    </div>
                                )},
                            { header: 'Role', accessor: 'role', cell: (row) => (
                                    <Badge variant={row.role === 'admin' ? 'purple' : 'default'}>
                                        {row.role === 'admin' ? (
                                            <span className="flex items-center"><Shield className="w-3 h-3 mr-1" /> Admin</span>
                                        ) : 'User'}
                                    </Badge>
                                )},
                            { header: 'Joined', accessor: 'id', cell: () => 'Dec 2024' }
                        ]}
                        data={users}
                        actions={(row) => (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingUser(row); setIsModalOpen(true); }}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </>
                        )}
                    />
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
                title={editingUser ? 'Edit User' : 'Add New User'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" name="name" defaultValue={editingUser?.name} required />
                    <Input label="Email" name="email" type="email" defaultValue={editingUser?.email} required />
                    <Select
                        label="Role"
                        name="role"
                        defaultValue={editingUser?.role || 'user'}
                        options={[
                            { value: 'user', label: 'User' },
                            { value: 'admin', label: 'Admin' }
                        ]}
                    />
                    {!editingUser && (
                        <Input label="Password" name="password" type="password" placeholder="Set temporary password" />
                    )}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default UserManagement;