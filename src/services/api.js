// Mock Database
const mockDb = {
    users: [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=1', department: 'IT', createdAt: '2024-01-15' },
        { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', avatar: 'https://i.pravatar.cc/150?u=2', department: 'Engineering', createdAt: '2024-02-20' },
        { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', avatar: 'https://i.pravatar.cc/150?u=3', department: 'Design', createdAt: '2024-03-10' },
    ],
    tasks: [
        { id: 1, title: 'Complete project documentation', description: 'Write comprehensive API documentation and user guides', status: 'in-progress', priority: 'high', dueDate: '2024-12-20', assigneeId: 2, createdBy: 1, createdAt: '2024-12-01', tags: ['documentation', 'api'] },
        { id: 2, title: 'Review code changes', description: 'Review pull request #234 for the authentication module', status: 'pending', priority: 'medium', dueDate: '2024-12-15', assigneeId: 3, createdBy: 1, createdAt: '2024-12-02', tags: ['code-review', 'auth'] },
        { id: 3, title: 'Update server configuration', description: 'Apply security patches and update SSL certificates', status: 'completed', priority: 'high', dueDate: '2024-12-10', assigneeId: 2, createdBy: 1, createdAt: '2024-11-28', tags: ['devops', 'security'] },
        { id: 4, title: 'Design new landing page', description: 'Create mockups for the new marketing site', status: 'pending', priority: 'low', dueDate: '2024-12-25', assigneeId: 3, createdBy: 2, createdAt: '2024-12-05', tags: ['design', 'marketing'] },
    ],
    attachments: [
        { id: 1, taskId: 1, filename: 'requirements.pdf', size: '2.4 MB', type: 'application/pdf', uploadedAt: '2024-12-01', uploadedBy: 1, url: '#' },
        { id: 2, taskId: 1, filename: 'design-mockup.png', size: '1.8 MB', type: 'image/png', uploadedAt: '2024-12-02', uploadedBy: 2, url: '#' },
        { id: 3, taskId: 2, filename: 'code-review-notes.docx', size: '856 KB', type: 'application/docx', uploadedAt: '2024-12-03', uploadedBy: 3, url: '#' },
    ],
    notifications: [
        { id: 1, userId: 2, title: 'New task assigned', message: 'You have been assigned to "Complete project documentation"', read: false, createdAt: '2024-12-01' },
        { id: 2, userId: 3, title: 'Task due soon', message: 'Task "Review code changes" is due in 2 days', read: false, createdAt: '2024-12-13' },
    ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API Service
export const apiService = {
    // Auth
    login: async (email, password) => {
        await delay(500);
        const user = mockDb.users.find(u => u.email === email);
        if (!user) throw new Error('User not found');
        return { ...user, token: 'mock-jwt-token-' + Date.now() };
    },

    register: async (userData) => {
        await delay(500);
        const newUser = {
            id: Date.now(),
            ...userData,
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            role: 'user',
            createdAt: new Date().toISOString().split('T')[0]
        };
        mockDb.users.push(newUser);
        return newUser;
    },

    // Users
    getUsers: async () => {
        await delay(300);
        return [...mockDb.users];
    },

    getUserById: async (id) => {
        await delay(200);
        const user = mockDb.users.find(u => u.id === parseInt(id));
        if (!user) throw new Error('User not found');
        return user;
    },

    createUser: async (userData) => {
        await delay(400);
        const newUser = {
            id: Date.now(),
            ...userData,
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0]
        };
        mockDb.users.push(newUser);
        return newUser;
    },

    updateUser: async (id, updates) => {
        await delay(300);
        const index = mockDb.users.findIndex(u => u.id === parseInt(id));
        if (index === -1) throw new Error('User not found');
        mockDb.users[index] = { ...mockDb.users[index], ...updates };
        return mockDb.users[index];
    },

    deleteUser: async (id) => {
        await delay(300);
        const index = mockDb.users.findIndex(u => u.id === parseInt(id));
        if (index === -1) throw new Error('User not found');
        mockDb.users.splice(index, 1);
        return { success: true };
    },

    // Tasks
    getTasks: async (filters = {}) => {
        await delay(300);
        let tasks = [...mockDb.tasks];

        if (filters.status) tasks = tasks.filter(t => t.status === filters.status);
        if (filters.priority) tasks = tasks.filter(t => t.priority === filters.priority);
        if (filters.assigneeId) tasks = tasks.filter(t => t.assigneeId === parseInt(filters.assigneeId));
        if (filters.search) {
            const search = filters.search.toLowerCase();
            tasks = tasks.filter(t =>
                t.title.toLowerCase().includes(search) ||
                t.description.toLowerCase().includes(search)
            );
        }

        return tasks.map(task => ({
            ...task,
            assignee: mockDb.users.find(u => u.id === task.assigneeId),
            creator: mockDb.users.find(u => u.id === task.createdBy)
        }));
    },

    getTaskById: async (id) => {
        await delay(200);
        const task = mockDb.tasks.find(t => t.id === parseInt(id));
        if (!task) throw new Error('Task not found');
        return {
            ...task,
            assignee: mockDb.users.find(u => u.id === task.assigneeId),
            creator: mockDb.users.find(u => u.id === task.createdBy)
        };
    },

    createTask: async (taskData) => {
        await delay(400);
        const newTask = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString().split('T')[0],
            status: taskData.status || 'pending'
        };
        mockDb.tasks.push(newTask);
        return newTask;
    },

    updateTask: async (id, updates) => {
        await delay(300);
        const index = mockDb.tasks.findIndex(t => t.id === parseInt(id));
        if (index === -1) throw new Error('Task not found');
        mockDb.tasks[index] = { ...mockDb.tasks[index], ...updates };
        return mockDb.tasks[index];
    },

    deleteTask: async (id) => {
        await delay(300);
        const index = mockDb.tasks.findIndex(t => t.id === parseInt(id));
        if (index === -1) throw new Error('Task not found');
        mockDb.tasks.splice(index, 1);
        // Clean up attachments
        mockDb.attachments = mockDb.attachments.filter(a => a.taskId !== parseInt(id));
        return { success: true };
    },

    // Attachments
    getAttachments: async (taskId) => {
        await delay(200);
        return mockDb.attachments
            .filter(a => a.taskId === parseInt(taskId))
            .map(a => ({
                ...a,
                uploadedByUser: mockDb.users.find(u => u.id === a.uploadedBy)
            }));
    },

    uploadAttachment: async (taskId, file) => {
        await delay(800); // Simulate upload time
        const newAttachment = {
            id: Date.now(),
            taskId: parseInt(taskId),
            filename: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type,
            uploadedAt: new Date().toISOString().split('T')[0],
            uploadedBy: 1, // Current user
            url: URL.createObjectURL(file)
        };
        mockDb.attachments.push(newAttachment);
        return newAttachment;
    },

    deleteAttachment: async (id) => {
        await delay(200);
        const index = mockDb.attachments.findIndex(a => a.id === parseInt(id));
        if (index === -1) throw new Error('Attachment not found');
        mockDb.attachments.splice(index, 1);
        return { success: true };
    },

    // Notifications
    getNotifications: async (userId) => {
        await delay(200);
        return mockDb.notifications
            .filter(n => n.userId === parseInt(userId))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    markNotificationRead: async (id) => {
        await delay(100);
        const notification = mockDb.notifications.find(n => n.id === parseInt(id));
        if (notification) notification.read = true;
        return notification;
    },

    // Dashboard Stats
    getAdminStats: async () => {
        await delay(300);
        const today = new Date().toISOString().split('T')[0];
        return {
            totalUsers: mockDb.users.length,
            totalTasks: mockDb.tasks.length,
            completedTasks: mockDb.tasks.filter(t => t.status === 'completed').length,
            pendingTasks: mockDb.tasks.filter(t => t.status === 'pending').length,
            inProgressTasks: mockDb.tasks.filter(t => t.status === 'in-progress').length,
            tasksDueToday: mockDb.tasks.filter(t => t.dueDate === today).length,
            highPriorityTasks: mockDb.tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
        };
    },

    getUserStats: async (userId) => {
        await delay(300);
        const userTasks = mockDb.tasks.filter(t => t.assigneeId === parseInt(userId));
        const today = new Date().toISO().split('T')[0];

        return {
            myTasks: userTasks.length,
            myCompletedTasks: userTasks.filter(t => t.status === 'completed').length,
            myPendingTasks: userTasks.filter(t => t.status === 'pending').length,
            myInProgressTasks: userTasks.filter(t => t.status === 'in-progress').length,
            dueToday: userTasks.filter(t => t.dueDate === today && t.status !== 'completed').length,
            overdue: userTasks.filter(t => t.dueDate < today && t.status !== 'completed').length
        };
    }
};

export default apiService;