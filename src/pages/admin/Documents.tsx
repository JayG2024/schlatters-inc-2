import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  FileText,
  Folder,
  FolderOpen,
  Edit,
  Trash2,
  Clock,
  User,
  Tag,
  Download,
  Upload,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileCode,
  FileCheck,
  Users,
  Phone,
  DollarSign,
  Settings,
  AlertCircle,
  Info
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate, formatRelativeTime } from '../../lib/utils';

interface Document {
  id: string;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  relatedDocs?: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  description: string;
}

const categories: Category[] = [
  {
    id: 'support',
    name: 'Support Procedures',
    icon: <Phone size={20} />,
    count: 0,
    description: 'Phone support processes and scripts'
  },
  {
    id: 'billing',
    name: 'Billing & Subscriptions',
    icon: <DollarSign size={20} />,
    count: 0,
    description: 'Billing processes and subscription management'
  },
  {
    id: 'onboarding',
    name: 'Client Onboarding',
    icon: <Users size={20} />,
    count: 0,
    description: 'New client setup and onboarding guides'
  },
  {
    id: 'technical',
    name: 'Technical Guides',
    icon: <FileCode size={20} />,
    count: 0,
    description: 'Technical troubleshooting and solutions'
  },
  {
    id: 'policies',
    name: 'Policies & Compliance',
    icon: <FileCheck size={20} />,
    count: 0,
    description: 'Company policies and compliance docs'
  }
];

// Data will be fetched from Supabase
const mockDocuments: Document[] = [];

const DocumentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['support', 'billing']);

  const filteredDocuments = mockDocuments.filter(doc => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        doc.title.toLowerCase().includes(search) ||
        doc.excerpt.toLowerCase().includes(search) ||
        doc.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    return true;
  });

  const handleCreateDocument = () => {
    setEditingDoc({
      id: 'new',
      title: 'New Document',
      category: selectedCategory === 'all' ? 'support' : selectedCategory,
      content: '# New Document\n\nStart writing your documentation here...',
      excerpt: '',
      author: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: [],
      status: 'draft'
    });
    setShowEditor(true);
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDoc(doc);
    setShowEditor(true);
  };

  const handleSaveDocument = () => {
    console.log('Saving document:', editingDoc);
    setShowEditor(false);
    setEditingDoc(null);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || <FileText size={16} />;
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" size="sm">Published</Badge>;
      case 'draft':
        return <Badge variant="warning" size="sm">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary" size="sm">Archived</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Process Documentation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Support procedures, billing guides, and company documentation
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button leftIcon={<Upload size={16} />} variant="outline">
            Import
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={handleCreateDocument}>
            New Document
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search documentation by title, content, or tags..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedCategory === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={20} />
                  <span className="font-medium">All Documents</span>
                </div>
                <span className="text-sm text-gray-500">0</span>
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedCategory === category.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Category Description */}
          {selectedCategory !== 'all' && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map(doc => (
              <Card 
                key={doc.id} 
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleEditDocument(doc)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(doc.category)}
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {doc.title}
                      </h3>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {doc.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {doc.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Updated {formatRelativeTime(new Date(doc.updatedAt))}
                    </span>
                    <span>v{doc.version}</span>
                  </div>
                  
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {doc.tags.map(tag => (
                        <Badge key={tag} variant="secondary" size="xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No documents found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm 
                    ? `No results for "${searchTerm}"`
                    : "No documents in this category yet."}
                </p>
                <Button leftIcon={<Plus size={16} />} onClick={handleCreateDocument}>
                  Create Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Document Editor Modal */}
      {showEditor && editingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <input
                    type="text"
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({...editingDoc, title: e.target.value})}
                    className="text-xl font-bold bg-transparent border-none outline-none dark:text-gray-100"
                    placeholder="Document Title"
                  />
                  <div className="flex items-center gap-4 mt-2">
                    <select 
                      value={editingDoc.category}
                      onChange={(e) => setEditingDoc({...editingDoc, category: e.target.value})}
                      className="text-sm bg-transparent border-gray-300 dark:border-gray-600 rounded"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {getStatusBadge(editingDoc.status)}
                    <span className="text-sm text-gray-500">Version {editingDoc.version}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowEditor(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <textarea
                value={editingDoc.content}
                onChange={(e) => setEditingDoc({...editingDoc, content: e.target.value})}
                className="w-full h-full min-h-[400px] p-6 bg-transparent border-none outline-none font-mono text-sm dark:text-gray-100"
                placeholder="Start writing your documentation..."
              />
            </CardContent>
            <div className="border-t dark:border-gray-700 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tags (comma separated)"
                  value={editingDoc.tags.join(', ')}
                  onChange={(e) => setEditingDoc({
                    ...editingDoc, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  className="text-sm px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveDocument} leftIcon={<Save size={16} />}>
                  Save Document
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;