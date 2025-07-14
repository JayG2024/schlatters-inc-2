import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Edit, 
  Trash, 
  Mail, 
  Shield, 
  CheckCircle, 
  X, 
  Save,
  User,
  Lock,
  Key
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatDateTime } from '../../../lib/utils';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'client';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
  permissions: string[];
}

// Data will be fetched from Supabase
const mockUsers: UserAccount[] = [];

const getRoleBadge = (role: UserAccount['role']) => {
  switch (role) {
    case 'admin':
      return <Badge variant="primary">Admin</Badge>;
    case 'manager':
      return <Badge variant="success">Manager</Badge>;
    case 'user':
      return <Badge variant="info">User</Badge>;
    case 'client':
      return <Badge variant="secondary">Client</Badge>;
  }
};

const getStatusBadge = (status: UserAccount['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'inactive':
      return <Badge variant="default">Inactive</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
  }
};

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  
  const filteredUsers = mockUsers.filter(user => {
    // Filter by tab
    if (activeTab !== 'all' && user.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search) || 
        user.role.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (userId: string) => {
    setSelectedUser(mockUsers.find(user => user.id === userId) || null);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log(`Deleting user ${selectedUser?.id}`);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
    // In a real app, this would delete the user
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleSaveUser = () => {
    console.log('Saving user changes');
    setSelectedUser(null);
    // In a real app, this would save the user changes
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filter
          </Button>
          
          <Button leftIcon={<Download size={16} />} variant="outline">
            Export
          </Button>
          
          <Button leftIcon={<UserPlus size={16} />} onClick={handleAddUser}>
            Add User
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Users
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'inactive'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('inactive')}
          >
            Inactive
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>
      </div>
      
      {/* User Edit Form */}
      {selectedUser && !showDeleteConfirm && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Edit User</CardTitle>
              <CardDescription>
                Update user information and permissions
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              leftIcon={<X size={16} />}
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">User Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={selectedUser.name}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={selectedUser.email}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={selectedUser.role}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                      <option value="client">Client</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={selectedUser.status}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="perm-view-clients"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked={selectedUser.permissions.includes('view_clients')}
                    />
                    <label htmlFor="perm-view-clients" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      View Clients
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="perm-edit-clients"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked={selectedUser.permissions.includes('edit_clients')}
                    />
                    <label htmlFor="perm-edit-clients" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Edit Clients
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="perm-view-billing"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked={selectedUser.permissions.includes('view_billing')}
                    />
                    <label htmlFor="perm-view-billing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      View Billing
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="perm-edit-billing"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked={selectedUser.permissions.includes('edit_billing')}
                    />
                    <label htmlFor="perm-edit-billing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Edit Billing
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="perm-manage-users"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked={selectedUser.permissions.includes('all')}
                    />
                    <label htmlFor="perm-manage-users" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Manage Users
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="perm-view-reports"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked={selectedUser.permissions.includes('all')}
                    />
                    <label htmlFor="perm-view-reports" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      View Reports
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Security</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-2"
                    leftIcon={<Key size={14} />}
                  >
                    Reset Password
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    leftIcon={<Lock size={14} />}
                  >
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button 
              variant="outline" 
              leftIcon={<X size={16} />}
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
            <Button 
              leftIcon={<Save size={16} />}
              onClick={handleSaveUser}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedUser && (
        <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Delete User</CardTitle>
            <CardDescription>
              Are you sure you want to delete this user?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-300 mb-2">
                You are about to delete the following user:
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{selectedUser.name}</p>
              <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
              <p className="mt-4 text-red-800 dark:text-red-300">
                This action cannot be undone. All data associated with this user will be permanently removed.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              leftIcon={<X size={16} />}
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              leftIcon={<Trash size={16} />}
              onClick={confirmDelete}
            >
              Delete User
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>
                Create a new user account
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              leftIcon={<X size={16} />}
              onClick={() => setShowAddUserModal(false)}
            >
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">User Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select a role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                      <option value="client">Client</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <input
                        id="send-invite"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="send-invite" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Send invitation email
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      An email will be sent to the user with instructions to set up their account.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="new-perm-view-clients"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="new-perm-view-clients" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      View Clients
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="new-perm-edit-clients"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="new-perm-edit-clients" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Edit Clients
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="new-perm-view-billing"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="new-perm-view-billing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      View Billing
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="new-perm-edit-billing"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="new-perm-edit-billing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Edit Billing
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="new-perm-manage-users"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="new-perm-manage-users" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Manage Users
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="new-perm-view-reports"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="new-perm-view-reports" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      View Reports
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button 
              variant="outline" 
              leftIcon={<X size={16} />}
              onClick={() => setShowAddUserModal(false)}
            >
              Cancel
            </Button>
            <Button 
              leftIcon={<UserPlus size={16} />}
              onClick={() => {
                console.log('Adding new user');
                setShowAddUserModal(false);
              }}
            >
              Add User
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Users Table */}
      {!selectedUser && !showAddUserModal && !showDeleteConfirm && (
        <Card className="bg-white dark:bg-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Last Login</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Created {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" 
                          title="Edit"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300" 
                          title="Email"
                        >
                          <Mail size={16} />
                        </button>
                        <button 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" 
                          title="Delete"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-10">
              <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? `No results for "${searchTerm}"`
                  : "No users match the current filter."}
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Clear Filter
              </Button>
            </div>
          )}
        </Card>
      )}
      
      {/* Role Permissions */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Default permissions for each user role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Permission</th>
                  <th className="px-6 py-3 text-center">Admin</th>
                  <th className="px-6 py-3 text-center">Manager</th>
                  <th className="px-6 py-3 text-center">User</th>
                  <th className="px-6 py-3 text-center">Client</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    View Clients
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Edit Clients
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    View Billing
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Edit Billing
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Manage Users
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    View Reports
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={16} className="mx-auto text-green-500 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X size={16} className="mx-auto text-red-500 dark:text-red-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;