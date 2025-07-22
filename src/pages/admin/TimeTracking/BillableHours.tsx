import React, { useState } from 'react';
import { 
  Download, 
  Send, 
  Filter, 
  Calendar,
  DollarSign,
  Clock,
  PieChart,
  Users,
  BarChart,
  Zap,
  Eye,
  Printer,
  Mail,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronRight,
  FileText,
  X
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { mockTimeEntries, formatDuration } from './mockData';

// Mock data for the commented-out sections
const clientHours = {
  'Client A': { billable: 1200, nonBillable: 300 },
  'Client B': { billable: 800, nonBillable: 150 },
  'Client C': { billable: 600, nonBillable: 200 }
};

const teamMembers = [
  { id: '1', name: 'John Doe', hours: 35, billablePercentage: 85 },
  { id: '2', name: 'Jane Smith', hours: 42, billablePercentage: 92 },
  { id: '3', name: 'Mike Johnson', hours: 28, billablePercentage: 75 }
];

type CategoryHours = {
  [category: string]: {
    billable: number;
    entries: number;
  };
};

const categoryHours: CategoryHours = {
  'Consulting': { billable: 900, entries: 12 },
  'Development': { billable: 1200, entries: 18 },
  'Design': { billable: 600, entries: 7 },
  'Support': { billable: 300, entries: 5 },
};

const BillableHours: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [showBillingModal, setShowBillingModal] = useState(false);
  
  // Calculate total and billable hours
  const totalHours = mockTimeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0) / 60;
  const billableHours = mockTimeEntries
    .filter(entry => entry.billable)
    .reduce((acc, entry) => acc + (entry.duration || 0), 0) / 60;
  
  // Calculate billable rate
  const billableRate = (billableHours / totalHours) * 100;
  
  // Calculate estimated revenue (assuming $150/hour rate)
  const hourlyRate = 150;
  const estimatedRevenue = billableHours * hourlyRate;
  
  // Calculate unbilled hours
  const unbilledHours = mockTimeEntries
    .filter(entry => entry.billable && entry.endTime)
    .reduce((acc, entry) => acc + (entry.duration || 0), 0) / 60;
  
  const handleExportReport = () => {
    console.log('Exporting billable hours report');
    // In a real app, this would generate a report for download
  };
  
  const handleSendInvoice = () => {
    setShowBillingModal(true);
  };

  const [showCategoryChart, setShowCategoryChart] = useState(true); // Feature flag
  const [categoryChartLoading, setCategoryChartLoading] = useState(false); // Loading state

  return (
    <div className="space-y-6">
      {/* Page filters/controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex space-x-2 items-center">
          <label className="text-sm text-gray-600">Date Range:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        {dateRange === 'custom' && (
          <div className="flex space-x-2">
            <input 
              type="date" 
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
            <span className="flex items-center text-gray-500">to</span>
            <input 
              type="date" 
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}
        
        <Button leftIcon={<Filter size={16} />} variant="outline" className="ml-auto">
          More Filters
        </Button>
        
        <Button leftIcon={<Send size={16} />} onClick={handleSendInvoice}>
          Generate Invoice
        </Button>
        
        <Button leftIcon={<Download size={16} />} variant="outline" onClick={handleExportReport}>
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Billable Hours</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{billableHours.toFixed(1)}h</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <Clock size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                <span className="font-medium">{billableRate.toFixed(0)}%</span> of total time
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Est. Revenue</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{formatCurrency(estimatedRevenue)}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <DollarSign size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                At <span className="font-medium">${hourlyRate}/hour</span> rate
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Unbilled Time</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">{unbilledHours.toFixed(1)}h</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-md">
                <FileText size={20} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-amber-600 font-medium">
                {formatCurrency(unbilledHours * hourlyRate)}
              </span>
              <span className="text-gray-500 ml-1">unbilled</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Rate</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">${hourlyRate}/h</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Zap size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                Based on current billing rates
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Hours Breakdown */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Client Hours Breakdown
          </CardTitle>
          <CardDescription>
            Distribution of billable and non-billable hours by client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Object.entries(categoryHours).map(([client, hours]) => { */}
            {/*   const totalClientHours = hours.billable + hours.nonBillable; */}
            {/*   const billablePercentage = (hours.billable / totalClientHours) * 100; */}
            {/*   const totalHoursFormatted = formatDuration(totalClientHours); */}
            {/*   const billableHoursFormatted = formatDuration(hours.billable); */}
            {/*   const nonBillableHoursFormatted = formatDuration(hours.nonBillable); */}
              
            {/*   return ( */}
            {/*     <div key={client} className="space-y-2"> */}
            {/*       <div className="flex justify-between items-center"> */}
            {/*         <div className="flex items-center"> */}
            {/*           <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div> */}
            {/*           <span className="font-medium text-gray-900">{client}</span> */}
            {/*         </div> */}
            {/*         <div className="text-sm text-gray-500 flex items-center gap-2"> */}
            {/*           <span>Total: {totalHoursFormatted}</span> */}
            {/*           <Button size="sm" variant="ghost" className="text-blue-600" rightIcon={<ChevronRight size={14} />}> */}
            {/*             View Details */}
            {/*           </Button> */}
            {/*         </div> */}
            {/*       </div> */}
              
            {/*       <div className="flex space-x-2"> */}
            {/*         <div className="flex-grow"> */}
            {/*           <div className="h-2 flex rounded-full overflow-hidden"> */}
            {/*             <div  */}
            {/*               className="bg-green-500"  */}
            {/*               style={{ width: `${billablePercentage}%` }} */}
            {/*             /> */}
            {/*             <div  */}
            {/*               className="bg-gray-300"  */}
            {/*               style={{ width: `${100 - billablePercentage}%` }} */}
            {/*             /> */}
            {/*           </div> */}
            {/*         </div> */}
            {/*         <div className="text-xs flex items-center"> */}
            {/*           <span className="text-green-600 font-medium">{billableHoursFormatted}</span> */}
            {/*           <span className="text-gray-400 mx-1">/</span> */}
            {/*           <span className="text-gray-500">{nonBillableHoursFormatted}</span> */}
            {/*         </div> */}
            {/*       </div> */}
              
            {/*       <div className="text-xs flex justify-between"> */}
            {/*         <span className="text-green-600"> */}
            {/*           Billable: {billablePercentage.toFixed(0)}% */}
            {/*         </span> */}
            {/*         <span className="text-gray-500"> */}
            {/*           Est. Revenue: {formatCurrency(hours.billable / 60 * hourlyRate)} */}
            {/*         </span> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   ); */}
            {/* })} */}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart size={20} className="text-purple-600" />
            Category Breakdown
          </CardTitle>
          <CardDescription>
            Billable hours by work category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryChartLoading ? (
              <div className="flex items-center justify-center h-48">
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></span>
                <span className="ml-2 text-purple-600">Loading chart...</span>
              </div>
            ) : !showCategoryChart ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                Category breakdown chart is disabled.
              </div>
            ) : (
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {Object.entries(categoryHours).map(([category, data], index, arr) => {
                    const billableOnly = data.billable;
                    const total = Object.values(categoryHours).reduce((sum, cat) => sum + cat.billable, 0);
                    const percentage = (billableOnly / total) * 100;
                    let startAngle = 0;
                    for (let i = 0; i < index; i++) {
                      const prevCategory = arr[i][0];
                      const prevData = categoryHours[prevCategory];
                      startAngle += (prevData.billable / total) * 360;
                    }
                    const endAngle = startAngle + (percentage * 3.6);
                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);
                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);
                    const largeArcFlag = percentage > 50 ? 1 : 0;
                    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
                    const color = colors[index % colors.length];
                    return (
                      <path
                        key={category}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={color}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>
            )}
            
            {/* Category listing */}
            <div className="space-y-4">
              {/* Object.entries(categoryHours).map(([category, data], index) => { */}
              {/*   const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500', 'bg-cyan-500', 'bg-pink-500']; */}
              {/*   const billableHoursFormatted = formatDuration(data.billable); */}
              {/*   const billableHoursDecimal = (data.billable / 60).toFixed(1); */}
                
              {/*   return ( */}
              {/*     <div key={category} className="space-y-1"> */}
              {/*       <div className="flex items-center justify-between"> */}
              {/*         <div className="flex items-center"> */}
              {/*           <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-sm mr-2`}></div> */}
              {/*           <span className="text-sm font-medium text-gray-700">{category}</span> */}
              {/*         </div> */}
              {/*         <span className="text-sm font-medium"> */}
              {/*           {billableHoursDecimal}h ({billableHoursFormatted}) */}
              {/*         </span> */}
              {/*       </div> */}
              {/*       <div className="flex justify-between text-xs text-gray-500"> */}
              {/*         <span>{data.entries} entries</span> */}
              {/*         <span>Est. ${(data.billable / 60 * hourlyRate).toFixed(2)}</span> */}
              {/*       </div> */}
              {/*     </div> */}
              {/*   ); */}
              {/* })} */}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-100 px-6 py-4">
          <Button variant="outline" className="ml-auto" leftIcon={<BarChart size={16} />}>
            Detailed Analytics
          </Button>
        </CardFooter>
      </Card>

      {/* Team Billable Hours Performance */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Team Billable Hours
          </CardTitle>
          <CardDescription>
            Billable hours by team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* teamMembers.map((member, index) => { */}
            {/*   // Calculate what percentage of member's hours are billable (mock data) */}
            {/*   const billablePercent = 65 + Math.floor(Math.random() * 25); */}
            {/*   const billableHours = Math.round((member.hours * billablePercent) / 100); */}
            {/*   const nonBillableHours = member.hours - billableHours; */}
              
            {/*   return ( */}
            {/*     <div key={index} className="space-y-2"> */}
            {/*       <div className="flex justify-between items-center"> */}
            {/*         <div className="font-medium">{member.name}</div> */}
            {/*         <div className="text-sm text-gray-500"> */}
            {/*           {member.hours}h tracked ({billableHours}h billable) */}
            {/*         </div> */}
            {/*       </div> */}
              
            {/*       <div className="flex space-x-2"> */}
            {/*         <div className="flex-grow"> */}
            {/*           <div className="h-2 flex rounded-full overflow-hidden"> */}
            {/*             <div  */}
            {/*               className="bg-green-500"  */}
            {/*               style={{ width: `${billablePercent}%` }} */}
            {/*             /> */}
            {/*             <div  */}
            {/*               className="bg-gray-300"  */}
            {/*               style={{ width: `${100 - billablePercent}%` }} */}
            {/*             /> */}
            {/*           </div> */}
            {/*         </div> */}
            {/*         <div className="text-xs"> */}
            {/*           <span className="font-medium">{billablePercent}%</span> */}
            {/*         </div> */}
            {/*       </div> */}
              
            {/*       <div className="flex justify-between text-xs text-gray-500"> */}
            {/*         <span> */}
            {/*           <span className="text-green-600">{billableHours}h billable</span> */}
            {/*           {" / "} */}
            {/*           <span>{nonBillableHours}h non-billable</span> */}
            {/*         </span> */}
            {/*         <span> */}
            {/*           Est. ${(billableHours * hourlyRate).toFixed(2)} */}
            {/*         </span> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   ); */}
            {/* })} */}
          </div>
        </CardContent>
      </Card>

      {/* Generate Invoice Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Generate Invoice</h3>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={() => setShowBillingModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                  {Object.keys(clientHours).map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                  {/*   <option key={client} value={client}>{client}</option> */}
                  {/* ))} */}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Notes
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  rows={3}
                  placeholder="Add any additional information to include on the invoice"
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Invoice Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Billable Hours:</span>
                    <span className="font-medium">{billableHours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Hourly Rate:</span>
                    <span className="font-medium">${hourlyRate.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(billableHours * hourlyRate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                leftIcon={<Eye size={16} />} 
                onClick={() => console.log('Preview invoice')}
              >
                Preview
              </Button>
              <Button 
                variant="outline" 
                leftIcon={<Printer size={16} />}
                onClick={() => console.log('Print invoice')}
              >
                Print
              </Button>
              <Button 
                leftIcon={<Mail size={16} />}
                onClick={() => {
                  console.log('Send invoice');
                  setShowBillingModal(false);
                }}
              >
                Send Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillableHours;