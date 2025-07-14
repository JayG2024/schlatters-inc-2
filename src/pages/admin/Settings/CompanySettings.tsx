import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  Save, 
  X, 
  Upload, 
  Image, 
  Palette, 
  FileText, 
  DollarSign, 
  Clock, 
  Info
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const CompanySettings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'billing' | 'business-hours'>('general');
  
  const handleSaveChanges = () => {
    setIsEditing(false);
    // In a real app, this would save the settings to the backend
    console.log('Saving company settings');
  };
  
  const handleCancelChanges = () => {
    setIsEditing(false);
    // In a real app, this would reset the form to the original values
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company information and preferences</p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                leftIcon={<X size={16} />}
                onClick={handleCancelChanges}
              >
                Cancel
              </Button>
              <Button 
                leftIcon={<Save size={16} />}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
            >
              Edit Settings
            </Button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General Information
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'branding'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('branding')}
          >
            Branding
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'billing'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('billing')}
          >
            Billing Settings
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'business-hours'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('business-hours')}
          >
            Business Hours
          </button>
        </div>
      </div>
      
      {/* General Information */}
      {activeTab === 'general' && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Basic information about your company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Legal Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="Schlatter's Inc."
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    DBA (if applicable)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Doing Business As"
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="12-3456789"
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="professional-services"
                    disabled={!isEditing}
                  >
                    <option value="professional-services">Professional Services</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue="schlatersinc.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Business Address
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    defaultValue="123 Business Street, Suite 100
San Francisco, CA 94103
United States"
                    disabled={!isEditing}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="info@schlatersinc.com"
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="+1 (555) 123-4567"
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time Zone
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="America/Los_Angeles"
                    disabled={!isEditing}
                  >
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Anchorage">Alaska</option>
                    <option value="Pacific/Honolulu">Hawaii</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Branding */}
      {activeTab === 'branding' && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Branding Settings</CardTitle>
            <CardDescription>
              Customize your company's visual identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Logo</h3>
                <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-750 h-40">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-brand-gold text-brand-navy rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">S</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current logo</p>
                  </div>
                </div>
                
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    leftIcon={<Upload size={16} />}
                  >
                    Upload New Logo
                  </Button>
                )}
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Brand Colors</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Primary Color
                      </label>
                      <div className="flex">
                        <div className="w-10 h-10 rounded-l-md bg-brand-navy border border-gray-300 dark:border-gray-600"></div>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          defaultValue="#001233"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex">
                        <div className="w-10 h-10 rounded-l-md bg-brand-gold border border-gray-300 dark:border-gray-600"></div>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          defaultValue="#FFD700"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Email Templates</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Email Signature
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={6}
                      defaultValue={`Best regards,

Admin User
Schlatter's Inc.
+1 (555) 123-4567
www.schlatersinc.com`}
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Email Footer Text
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      defaultValue="This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed."
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Document Branding</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="include-logo"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="include-logo" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include logo on documents
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="include-address"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="include-address" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include address on documents
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="include-tax-id"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="include-tax-id" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Include Tax ID on invoices
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
            <CardDescription>
              Configure your company's billing preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Payment Terms
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="net-15"
                    disabled={!isEditing}
                  >
                    <option value="due-on-receipt">Due on Receipt</option>
                    <option value="net-7">Net 7</option>
                    <option value="net-15">Net 15</option>
                    <option value="net-30">Net 30</option>
                    <option value="net-60">Net 60</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invoice Numbering Format
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="INV-{YEAR}-{NUM}"
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use {'{YEAR}'}, {'{MONTH}'}, {'{NUM}'} as placeholders
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Hourly Rate
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue="150.00"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="usd"
                    disabled={!isEditing}
                  >
                    <option value="usd">USD - US Dollar</option>
                    <option value="eur">EUR - Euro</option>
                    <option value="gbp">GBP - British Pound</option>
                    <option value="cad">CAD - Canadian Dollar</option>
                    <option value="aud">AUD - Australian Dollar</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax Settings
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      id="charge-tax"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked
                      disabled={!isEditing}
                    />
                    <label htmlFor="charge-tax" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Charge tax on invoices
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Tax Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        defaultValue="Sales Tax"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        defaultValue="8.5"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Methods
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="accept-credit-card"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="accept-credit-card" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Credit Card
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="accept-ach"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="accept-ach" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        ACH Bank Transfer
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="accept-check"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="accept-check" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Check
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="accept-wire"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                        disabled={!isEditing}
                      />
                      <label htmlFor="accept-wire" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Wire Transfer
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invoice Notes (Default)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    defaultValue="Thank you for your business. Please make payment by the due date."
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Business Hours */}
      {activeTab === 'business-hours' && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              Set your company's operating hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <input
                  id="use-business-hours"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  defaultChecked
                  disabled={!isEditing}
                />
                <label htmlFor="use-business-hours" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable business hours
                </label>
              </div>
              
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id={`day-${index}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked={index < 5} // Mon-Fri checked by default
                        disabled={!isEditing}
                      />
                      <label htmlFor={`day-${index}`} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-28">
                        {day}
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        defaultValue="09:00"
                        disabled={!isEditing || (index >= 5)}
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 dark:text-gray-400">to</span>
                      <select
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        defaultValue="17:00"
                        disabled={!isEditing || (index >= 5)}
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {index >= 5 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Closed
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Holidays</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">New Year's Day</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">January 1, 2025</div>
                      </div>
                    </div>
                    {isEditing && (
                      <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400">
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Memorial Day</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">May 26, 2025</div>
                      </div>
                    </div>
                    {isEditing && (
                      <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400">
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Independence Day</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">July 4, 2025</div>
                      </div>
                    </div>
                    {isEditing && (
                      <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400">
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    leftIcon={<Calendar size={14} />}
                  >
                    Add Holiday
                  </Button>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Time Zone</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  defaultValue="America/Los_Angeles"
                  disabled={!isEditing}
                >
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="America/Denver">Mountain Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Anchorage">Alaska</option>
                  <option value="Pacific/Honolulu">Hawaii</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanySettings;