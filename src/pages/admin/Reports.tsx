import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Filter, 
  BarChart3,
  DollarSign,
  PhoneCall,
  Users,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

// Import sub-pages
import FinancialReports from './Reports/FinancialReports';
import CallAnalytics from './Reports/CallAnalytics';
import TeamPerformance from './Reports/TeamPerformance';

const ReportsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/admin/reports';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">Performance metrics and business insights</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button leftIcon={<Filter size={16} />} variant="outline">
                  Filter
                </Button>
                
                <Button leftIcon={<Download size={16} />}>
                  Export Reports
                </Button>
              </div>
            </div>
            
            {/* Reports Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => handleNavigate('/admin/reports/financials')}>
                <CardContent className="p-6">
                  <div className="p-4 rounded-full bg-blue-100 inline-block mb-4">
                    <DollarSign size={24} className="text-blue-600" />
                  </div>
                  
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription className="mt-2">
                    Comprehensive reports on revenue, expenses, and profitability metrics
                  </CardDescription>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(0)}</div>
                      <div className="text-sm text-gray-500">Revenue this month</div>
                    </div>
                    
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => handleNavigate('/admin/reports/calls')}>
                <CardContent className="p-6">
                  <div className="p-4 rounded-full bg-green-100 inline-block mb-4">
                    <PhoneCall size={24} className="text-green-600" />
                  </div>
                  
                  <CardTitle>Call Analytics</CardTitle>
                  <CardDescription className="mt-2">
                    Detailed metrics on call volume, duration, and sentiment analysis
                  </CardDescription>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">0</div>
                      <div className="text-sm text-gray-500">Calls this month</div>
                    </div>
                    
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => handleNavigate('/admin/reports/team')}>
                <CardContent className="p-6">
                  <div className="p-4 rounded-full bg-purple-100 inline-block mb-4">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription className="mt-2">
                    Performance metrics for individuals and teams across key indicators
                  </CardDescription>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">0%</div>
                      <div className="text-sm text-gray-500">Team score</div>
                    </div>
                    
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Other Reports */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Additional Reports</CardTitle>
                <CardDescription>Other analytics and reporting options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-50 rounded-md">
                        <BarChart3 size={18} className="text-amber-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Executive Dashboard</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      High-level overview of key business metrics and performance indicators
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => handleNavigate('/admin/reports/dashboard')}
                    >
                      View Dashboard
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-50 rounded-md">
                        <Users size={18} className="text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Client Reports</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Detailed reports on client acquisition, retention, and satisfaction metrics
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => handleNavigate('/admin/reports/clients')}
                    >
                      View Reports
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-50 rounded-md">
                        <DollarSign size={18} className="text-green-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Forecast Reports</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Revenue forecasts, projections, and trend analysis for future planning
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => handleNavigate('/admin/reports/forecast')}
                    >
                      View Forecasts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } 
      />
      <Route path="/financials" element={<FinancialReports />} />
      <Route path="/calls" element={<CallAnalytics />} />
      <Route path="/team" element={<TeamPerformance />} />
      <Route path="*" element={
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
            <p className="text-gray-600 mb-4">The report you're looking for does not exist or is still in development.</p>
            <Button onClick={() => navigate('/admin/reports')}>
              Back to Reports
            </Button>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default ReportsPage;