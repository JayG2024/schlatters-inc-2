import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building,
  Mail,
  Phone,
  CheckCircle,
  X,
  Save,
  Plus,
  ArrowLeft,
  Tag,
  Clock,
  CreditCard,
  FileText,
  Shield
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    website: '',
    type: 'standard',
    source: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      
      // Redirect after a brief delay to show the confirmation
      setTimeout(() => {
        navigate('/admin/clients');
      }, 2000);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate('/admin/clients');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Clients</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600 mt-1">Create a new client record in the system</p>
        </div>
      </div>
      
      {showConfirmation ? (
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-green-100 rounded-full">
                <CheckCircle size={36} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Client Added Successfully!</h2>
              <p className="text-green-700 mb-4">
                The new client has been added to your database.
              </p>
              <div className="space-x-4">
                <Button
                  onClick={() => navigate('/admin/clients')}
                >
                  View All Clients
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmation(false);
                    setFormState({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      address: '',
                      city: '',
                      state: '',
                      zip: '',
                      website: '',
                      type: 'standard',
                      source: '',
                      notes: ''
                    });
                  }}
                >
                  Add Another Client
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Basic contact information for the client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Smith"
                      value={formState.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Acme Corp"
                      value={formState.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                      value={formState.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Business St"
                  value={formState.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New York"
                    value={formState.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="NY"
                    value={formState.state}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="zip">
                    ZIP
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10001"
                    value={formState.zip}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.example.com"
                  value={formState.website}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Client Settings */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Client Settings</CardTitle>
              <CardDescription>Configure client type and additional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                    Client Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="type"
                      name="type"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                      value={formState.type}
                      onChange={handleInputChange}
                    >
                      <option value="premium">Premium</option>
                      <option value="standard">Standard</option>
                      <option value="basic">Basic</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="source">
                    Lead Source
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="source"
                      name="source"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                      value={formState.source}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a source</option>
                      <option value="referral">Referral</option>
                      <option value="website">Website</option>
                      <option value="email_campaign">Email Campaign</option>
                      <option value="conference">Conference/Event</option>
                      <option value="social_media">Social Media</option>
                      <option value="cold_call">Cold Call</option>
                      <option value="partner">Partner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional information about the client..."
                    value={formState.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <Clock size={16} className="mr-2 text-amber-600" />
                  After creating the client
                </h3>
                <div className="text-sm text-amber-700 space-y-2">
                  <p className="flex items-center">
                    <CheckCircle size={14} className="mr-2 text-amber-600" />
                    You'll be able to assign services and set up billing
                  </p>
                  <p className="flex items-center">
                    <CheckCircle size={14} className="mr-2 text-amber-600" />
                    Configure communication preferences and notification settings
                  </p>
                  <p className="flex items-center">
                    <CheckCircle size={14} className="mr-2 text-amber-600" />
                    Set up the client onboarding process
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              leftIcon={<X size={16} />}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              leftIcon={<Save size={16} />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
          </div>
        </form>
      )}
      
      {/* Quick Links */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Quick Setup Actions</CardTitle>
          <CardDescription>Additional steps to complete after creating a client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="font-medium">Set Up Billing</h3>
              </div>
              <p className="text-sm text-gray-600">
                Configure payment methods and billing preferences
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="font-medium">Create Contract</h3>
              </div>
              <p className="text-sm text-gray-600">
                Generate and send a service agreement
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                <h3 className="font-medium">Setup Permissions</h3>
              </div>
              <p className="text-sm text-gray-600">
                Configure access rights and user accounts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClientPage;