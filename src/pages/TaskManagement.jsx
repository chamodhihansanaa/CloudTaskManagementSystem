import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Calendar, AlertTriangle, Filter, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import FileUpload from '../components/ui/FileUpload';
import { apiService } from '../services/api';

const TaskManagement = ({ isAdmin = false }) => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [tasksData, usersData] = await Promise.all([
            apiService.getTasks(),
            apiService.getUsers()
        ]);
        setTasks(tasksData);
        setUsers(usersData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const task = {
            title: formData.get('title'),
            description: formData.get('description'),
            status: formData.get('status'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate'),
            assigneeId: parseInt(formData.get('assigneeId'))
        };

        if (editingTask) {
            await apiService.updateTask(editingTask.id, task);
        } else {
            await apiService.createTask(task);
        }

        loadData();
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await apiService.deleteTask(id);
            loadData();
        }
    };

    const openTaskDetails = async (task) => {
        setSelectedTask(task);
        const taskAttachments = await apiService.getAttachments(task.id);
        setAttachments(taskAttachments);
    };

    const handleFileUpload = async (file) => {
        if (selectedTask) {
            await apiService.uploadAttachment(selectedTask.id, file);
            const updatedAttachments = await apiService.getAttachments(selectedTask.id);
            setAttachments(updatedAttachments);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                    <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Task
                    </Button>
                </div>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter tasks..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <Button variant="secondary" size="sm">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        columns={[
                            { header: 'Task', accessor: 'title', cell: (row) => (
                                    <div>
                                        <p className="font-medium text-gray-900">{row.title}</p>
                                        <p className="text-sm text-gray-500">{row.description}</p>
                                    </div>
                                )},
                            { header: 'Assignee', accessor: 'assigneeId', cell: (row) => {
                                    const assignee = users.find(u => u.id === row.assigneeId);
                                    return assignee ? (
                                        <div className="flex items-center">
                                            <img src={assignee.avatar} alt="" className="w-6 h-6 rounded-full mr-2" />
                                            <span className="text-sm">{assignee.name}</span>
                                        </div>
                                    ) : 'Unassigned';
                                }},
                            { header: 'Status', accessor: 'status', cell: (row) => (
                                    <Badge variant={
                                        row.status === 'completed' ? 'success' :
                                            row.status === 'in-progress' ? 'info' : 'warning'
                                    }>
                                        {row.status}
                                    </Badge>
                                )},
                            { header: 'Priority', accessor: 'priority', cell: (row) => (
                                    <div className="flex items-center">
                                        <AlertTriangle className={`w-4 h-4 mr-1 ${
                                            row.priority === 'high' ? 'text-red-500' :
                                                row.priority === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                                        }`} />
                                        <Badge variant={
                                            row.priority === 'high' ? 'danger' :
                                                row.priority === 'medium' ? 'warning' : 'default'
                                        }>
                                            {row.priority}
                                        </Badge>
                                    </div>
                                )},
                            { header: 'Due Date', accessor: 'dueDate', cell: (row) => (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {row.dueDate}
                                    </div>
                                )}
                        ]}
                        data={tasks}
                        actions={(row) => (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => openTaskDetails(row)}>
                                    <FileText className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingTask(row); setIsModalOpen(true); }}>
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
                onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                title={editingTask ? 'Edit Task' : 'Create New Task'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Title" name="title" defaultValue={editingTask?.title} required />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={editingTask?.description}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Status"
                            name="status"
                            defaultValue={editingTask?.status || 'pending'}
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'in-progress', label: 'In Progress' },
                                { value: 'completed', label: 'Completed' }
                            ]}
                        />
                        <Select
                            label="Priority"
                            name="priority"
                            defaultValue={editingTask?.priority || 'medium'}
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' }
                            ]}
                        />
                    </div>
                    <Input label="Due Date" name="dueDate" type="date" defaultValue={editingTask?.dueDate} required />
                    <Select
                        label="Assign To"
                        name="assigneeId"
                        defaultValue={editingTask?.assigneeId || ''}
                        options={users.map(u => ({ value: u.id, label: u.name }))}
                    />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                title={selectedTask?.title}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Status:</span>
                            <Badge variant={
                                selectedTask?.status === 'completed' ? 'success' :
                                    selectedTask?.status === 'in-progress' ? 'info' : 'warning'
                            } className="ml-2">
                                {selectedTask?.status}
                            </Badge>
                        </div>
                        <div>
                            <span className="text-gray-500">Priority:</span>
                            <Badge variant={
                                selectedTask?.priority === 'high' ? 'danger' :
                                    selectedTask?.priority === 'medium' ? 'warning' : 'default'
                            } className="ml-2">
                                {selectedTask?.priority}
                            </Badge>
                        </div>
                        <div>
                            <span className="text-gray-500">Due Date:</span>
                            <span className="ml-2 font-medium">{selectedTask?.dueDate}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {selectedTask?.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Attachments</h4>
                        <FileUpload onUpload={handleFileUpload} />

                        <div className="mt-4 space-y-2">
                            {attachments.map(attachment => (
                                <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{attachment.filename}</p>
                                            <p className="text-xs text-gray-500">{attachment.size} • {attachment.uploadedAt}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Download
                                    </Button>
                                </div>
                            ))}
                            {attachments.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No attachments yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default TaskManagement;