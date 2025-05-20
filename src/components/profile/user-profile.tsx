import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building, Key, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabTrigger, TabContent } from '../ui/tabs';
import { useToast } from '../ui/toast';
import { Badge } from '../ui/badge';
import { getCurrentUser } from '../../lib/storage';

export function UserProfile() {
  const { addToast } = useToast();
  const user = getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold">Account Settings</h1>
      
      <Tabs defaultTab="profile" className="space-y-6">
        <TabsList className="mb-6">
          <TabTrigger value="profile">Profile</TabTrigger>
          <TabTrigger value="security">Security</TabTrigger>
          <TabTrigger value="api">API Keys</TabTrigger>
          <TabTrigger value="organization">Organization</TabTrigger>
        </TabsList>
        
        <TabContent value="profile">
          <ProfileTab user={user} />
        </TabContent>
        
        <TabContent value="security">
          <SecurityTab />
        </TabContent>
        
        <TabContent value="api">
          <ApiKeysTab />
        </TabContent>
        
        <TabContent value="organization">
          <OrganizationTab />
        </TabContent>
      </Tabs>
    </div>
  );
}

function ProfileTab({ user }: { user: { id: string; email: string; role: string } }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: user.email.split('@')[0],
    email: user.email,
    jobTitle: 'Marketing Manager',
    company: 'Demo Company',
    timezone: 'UTC-5 (Eastern Time)',
    language: 'English'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the API
    
    addToast({
      title: 'Profile Updated',
      description: 'Your profile information has been updated successfully.',
      variant: 'success',
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <User className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium">{formData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Avatar
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Input 
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Input 
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
              />
              
              <Input 
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
              
              <Input 
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                  <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                  <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                  <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                  <option value="UTC+8 (China Standard Time)">UTC+8 (China Standard Time)</option>
                  <option value="UTC+9 (Japan Standard Time)">UTC+9 (Japan Standard Time)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Portuguese">Portuguese</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SecurityTab() {
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match.',
        variant: 'error',
      });
      return;
    }
    
    // In a real app, this would send the data to the API
    
    addToast({
      title: 'Password Updated',
      description: 'Your password has been updated successfully.',
      variant: 'success',
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <div className="relative">
                <Input 
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="relative">
                <Input 
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Protect your account with 2FA</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account by requiring access to your phone as well as your password when you sign in.
              </p>
            </div>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Computer className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium">Current Session</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chrome on Windows • 192.168.1.1 • Active now
                  </p>
                </div>
              </div>
              <Badge variant="success">Current</Badge>
            </div>
            
            <Button variant="danger" className="text-error-500 border-error-300 hover:bg-error-50 dark:border-error-800 dark:hover:bg-error-950/50 w-full">
              Log Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Computer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h2" />
      <path d="M12 18h6" />
    </svg>
  );
}

function ApiKeysTab() {
  const { addToast } = useToast();
  const [apiKeys, setApiKeys] = useState([
    { id: 'key1', name: 'Production Key', key: 'pk_live_51H2Eu...', createdAt: '2023-06-15', lastUsed: '2023-06-20' },
    { id: 'key2', name: 'Development Key', key: 'pk_test_51H2Eu...', createdAt: '2023-06-10', lastUsed: 'Never' }
  ]);
  
  const handleCreateKey = () => {
    const newKey = {
      id: `key${apiKeys.length + 1}`,
      name: `New API Key ${apiKeys.length + 1}`,
      key: `pk_test_${Math.random().toString(36).substring(2, 15)}...`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    
    setApiKeys([...apiKeys, newKey]);
    
    addToast({
      title: 'API Key Created',
      description: 'Your new API key has been created successfully.',
      variant: 'success',
    });
  };
  
  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    addToast({
      title: 'API Key Deleted',
      description: 'The API key has been deleted successfully.',
      variant: 'success',
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button onClick={handleCreateKey}>
            Generate New Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Key</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Last Used</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((apiKey) => (
                    <tr key={apiKey.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm">{apiKey.name}</td>
                      <td className="px-4 py-3 text-sm font-mono">{apiKey.key}</td>
                      <td className="px-4 py-3 text-sm">{apiKey.createdAt}</td>
                      <td className="px-4 py-3 text-sm">{apiKey.lastUsed}</td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="text-error-500 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/50"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">API Key Security</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Your API keys carry many privileges, so be sure to keep them secure! Do not share your API keys in publicly accessible areas such as GitHub, client-side code, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OrganizationTab() {
  const { addToast } = useToast();
  const [orgData, setOrgData] = useState({
    name: 'Demo Company',
    address: '123 Main St, San Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    website: 'https://demo-company.example.com',
    industry: 'Technology'
  });
  
  const [teamMembers, setTeamMembers] = useState([
    { id: 'u1', name: 'Admin User', email: 'admin@demo.io', role: 'admin' },
    { id: 'u2', name: 'Analyst User', email: 'analyst@demo.io', role: 'analyst' }
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addToast({
      title: 'Organization Updated',
      description: 'Your organization information has been updated successfully.',
      variant: 'success',
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrgData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Input 
                label="Organization Name"
                name="name"
                value={orgData.name}
                onChange={handleChange}
                required
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry
                </label>
                <select
                  name="industry"
                  value={orgData.industry}
                  onChange={(e) => setOrgData({ ...orgData, industry: e.target.value })}
                  className="flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  name="address"
                  value={orgData.address}
                  onChange={handleChange}
                  rows={2}
                  className="flex w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              
              <Input 
                label="Phone Number"
                name="phone"
                value={orgData.phone}
                onChange={handleChange}
              />
              
              <Input 
                label="Website"
                name="website"
                value={orgData.website}
                onChange={handleChange}
                type="url"
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button>
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-sm">{member.name}</td>
                    <td className="px-4 py-3 text-sm">{member.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={member.role === 'admin' ? 'primary' : 'secondary'}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}