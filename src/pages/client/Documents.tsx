import React, { useState } from 'react';
import { 
  Search,
  Download,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  ExternalLink,
  Folder,
  FolderOpen,
  ChevronRight,
  Eye,
  Clock,
  Lock,
  Share
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../lib/utils';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'folder' | 'other';
  category: 'contract' | 'guide' | 'report' | 'folder' | 'other';
  createdAt: string;
  fileSize?: number; // in bytes, not for folders
  path: string;
  description?: string;
  shared?: boolean;
}

// Data will be fetched from Supabase

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getDocumentIcon = (type: Document['type']) => {
  switch (type) {
    case 'folder':
      return <Folder size={20} className="text-amber-500" />;
    case 'pdf':
      return <FileText size={20} className="text-red-500" />;
    case 'doc':
      return <FileText size={20} className="text-blue-500" />;
    case 'image':
      return <FileImage size={20} className="text-purple-500" />;
    case 'spreadsheet':
      return <FileSpreadsheet size={20} className="text-green-500" />;
    case 'other':
      return <File size={20} className="text-gray-500" />;
  }
};

const getCategoryBadge = (category: Document['category']) => {
  if (category === 'folder') return null;
  
  switch (category) {
    case 'contract':
      return <Badge variant="primary">Contract</Badge>;
    case 'guide':
      return <Badge variant="info">Guide</Badge>;
    case 'report':
      return <Badge variant="success">Report</Badge>;
    case 'other':
      return <Badge variant="default">Other</Badge>;
  }
};

const DocumentsPage: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // Get current directory contents
  const getCurrentDocuments = () => {
    let documents: Document[] = [];
    
    // Filter by current path
    if (currentPath === '/') {
      documents = documents.filter(doc => {
        // If it's a direct child of the root
        const pathParts = doc.path.split('/').filter(Boolean);
        return pathParts.length === 1;
      });
    } else {
      documents = documents.filter(doc => {
        return doc.path.startsWith(currentPath + '/') && 
          doc.path.split('/').filter(Boolean).length === currentPath.split('/').filter(Boolean).length + 1;
      });
    }
    
    // Filter by category if not "all"
    if (currentCategory !== 'all') {
      documents = documents.filter(doc => doc.category === currentCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      documents = documents.filter(
        doc => doc.name.toLowerCase().includes(search) || (doc.description || '').toLowerCase().includes(search)
      );
    }
    
    return documents;
  };
  
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };
  
  const navigateUp = () => {
    // If at root, stay at root
    if (currentPath === '/') return;
    
    // Otherwise, go up one level
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    
    if (pathParts.length === 0) {
      setCurrentPath('/');
    } else {
      setCurrentPath('/' + pathParts.join('/'));
    }
  };
  
  const handleViewDocument = (document: Document) => {
    if (document.type === 'folder') {
      navigateToFolder(document.path);
    } else {
      setSelectedDocument(document);
    }
  };
  
  const handleDownloadDocument = (documentId: string) => {
    // In a real app, this would trigger download logic
  };
  
  const handleCloseDocumentDetail = () => {
    setSelectedDocument(null);
  };
  
  const displayedDocuments = getCurrentDocuments();
  const pathParts = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean);
  
  // Group documents by category for featured section
  const recentDocuments = [...displayedDocuments]
    .filter(doc => doc.type !== 'folder')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const guidesAndResources = displayedDocuments.filter(doc => 
    doc.category === 'guide' && doc.type !== 'folder'
  ).slice(0, 3);
  
  const contractsAndReports = displayedDocuments.filter(doc => 
    (doc.category === 'contract' || doc.category === 'report') && doc.type !== 'folder'
  ).slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents & Resources</h1>
          <p className="text-gray-600 mt-1">Access and manage your important documents</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Featured Documents Section (shown only at root level) */}
      {currentPath === '/' && !searchTerm && currentCategory === 'all' && !selectedDocument && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Recently added or updated</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentDocuments.map(doc => (
                  <li key={doc.id} className="flex items-start">
                    <div className="mr-3 p-2 bg-gray-50 rounded-md border border-gray-100">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block w-full text-left"
                        onClick={() => handleViewDocument(doc)}
                      >
                        {doc.name}
                      </button>
                      <p className="text-xs text-gray-500 truncate">
                        {doc.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        <span>Added {formatDateTime(doc.createdAt)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-blue-600"
                onClick={() => setCurrentCategory('all')}
                rightIcon={<ChevronRight size={16} />}
              >
                View All Documents
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Guides & Resources</CardTitle>
              <CardDescription>Helpful guides and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {guidesAndResources.map(doc => (
                  <li key={doc.id} className="flex items-start">
                    <div className="mr-3 p-2 bg-gray-50 rounded-md border border-gray-100">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block w-full text-left"
                        onClick={() => handleViewDocument(doc)}
                      >
                        {doc.name}
                      </button>
                      <p className="text-xs text-gray-500 truncate">
                        {doc.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-blue-600"
                onClick={() => setCurrentCategory('guide')}
                rightIcon={<ChevronRight size={16} />}
              >
                View All Guides
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Contracts & Reports</CardTitle>
              <CardDescription>Important business documents</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {contractsAndReports.map(doc => (
                  <li key={doc.id} className="flex items-start">
                    <div className="mr-3 p-2 bg-gray-50 rounded-md border border-gray-100">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block w-full text-left"
                        onClick={() => handleViewDocument(doc)}
                      >
                        {doc.name}
                      </button>
                      <p className="text-xs text-gray-500 truncate">
                        {doc.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-blue-600"
                onClick={() => setCurrentCategory('contract')}
                rightIcon={<ChevronRight size={16} />}
              >
                View All Contracts
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Category Filter */}
      {!selectedDocument && (
        <div className="border-b border-gray-200">
          <div className="flex space-x-6 overflow-x-auto pb-1">
            <button
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentCategory === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentCategory('all')}
            >
              All Documents
            </button>
            <button
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentCategory === 'contract'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentCategory('contract')}
            >
              Contracts
            </button>
            <button
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentCategory === 'guide'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentCategory('guide')}
            >
              Guides
            </button>
            <button
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                currentCategory === 'report'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentCategory('report')}
            >
              Reports
            </button>
          </div>
        </div>
      )}
      
      {/* Breadcrumb Navigation */}
      {!selectedDocument && (
        <div className="flex items-center text-sm">
          <button 
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setCurrentPath('/')}
          >
            Root
          </button>
          
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="mx-2 text-gray-500">/</span>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => navigateToFolder('/' + pathParts.slice(0, index + 1).join('/'))}
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Document Detail View */}
      {selectedDocument ? (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                  {getDocumentIcon(selectedDocument.type)}
                </div>
                <CardTitle>{selectedDocument.name}</CardTitle>
              </div>
              <CardDescription className="mt-1">
                {selectedDocument.description || "No description available"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getCategoryBadge(selectedDocument.category)}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCloseDocumentDetail}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Document Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">File Type:</span>
                    <span className="font-medium">{selectedDocument.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span>{formatFileSize(selectedDocument.fileSize || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date Added:</span>
                    <span>{formatDateTime(selectedDocument.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="capitalize">{selectedDocument.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span>{selectedDocument.path}</span>
                  </div>
                </div>
              </div>
              
              <div>
                {selectedDocument.type === 'pdf' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-3 text-red-500" />
                      <p className="text-gray-700 font-medium">PDF Document Preview</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Click "View" to open this document in a viewer
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedDocument.type === 'image' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      <FileImage size={48} className="mx-auto mb-3 text-purple-500" />
                      <p className="text-gray-700 font-medium">Image Preview</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Click "View" to see this image
                      </p>
                    </div>
                  </div>
                )}
                
                {(selectedDocument.type === 'doc' || selectedDocument.type === 'spreadsheet' || selectedDocument.type === 'other') && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      {getDocumentIcon(selectedDocument.type)}
                      <p className="text-gray-700 font-medium mt-3">
                        {selectedDocument.type === 'doc' ? 'Document' : 
                         selectedDocument.type === 'spreadsheet' ? 'Spreadsheet' : 
                         'File'} Preview
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Download this file to view its contents
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                leftIcon={<Eye size={16} />}
                onClick={() => console.log(`View document ${selectedDocument.id}`)}
              >
                View
              </Button>
              <Button 
                leftIcon={<Download size={16} />}
                onClick={() => handleDownloadDocument(selectedDocument.id)}
              >
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Document Grid/List */}
          <Card className="bg-white">
            {currentPath !== '/' && (
              <div className="p-4 border-b border-gray-200">
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={navigateUp}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M19 12H6M12 5l-7 7 7 7" />
                  </svg>
                  Back
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
              {displayedDocuments.map(doc => (
                <div 
                  key={doc.id} 
                  className="border rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleViewDocument(doc)}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gray-50 rounded-md mr-3 border border-gray-100">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-medium text-gray-900 truncate">
                        {doc.name}
                      </div>
                      {doc.type !== 'folder' && getCategoryBadge(doc.category)}
                    </div>
                  </div>
                  
                  {doc.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 flex justify-between items-center">
                    <div>
                      {doc.type !== 'folder' ? formatFileSize(doc.fileSize || 0) : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {doc.type !== 'folder' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                      <Button size="sm" variant="ghost" leftIcon={<Eye size={14} />}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" leftIcon={<Download size={14} />}>
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {displayedDocuments.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? `No results for "${searchTerm}"`
                      : "This folder is empty or no documents match the current filter."}
                  </p>
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          {/* Document Help */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Document Support</CardTitle>
              <CardDescription>Need help with your documents?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Accessing Documents</h3>
                  <p className="text-sm text-blue-700">
                    Click on any document to view details. You can view online or download files to your device.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Document Security</h3>
                  <p className="text-sm text-green-700">
                    All documents are securely stored and encrypted. Only authorized users can access your files.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Need More Documents?</h3>
                  <p className="text-sm text-purple-700">
                    Contact your account manager if you need additional documents or have specific requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DocumentsPage;