import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { FileText, ArrowRight, Plus, Download, ExternalLink, File, FileImage, FileSpreadsheet, Lock, Clock } from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'other';
  category: 'contract' | 'guide' | 'report' | 'proposal' | 'other';
  createdAt: string;
  fileSize: number; // in bytes
  restricted: boolean;
}

interface DocumentsWidgetProps {
  documents: Document[];
  onViewAll?: () => void;
  onUploadDocument?: () => void;
  onDownloadDocument?: (documentId: string) => void;
  onViewDocument?: (documentId: string) => void;
  className?: string;
  loading?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getDocumentIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText size={16} className="text-red-500" />;
    case 'doc':
      return <FileText size={16} className="text-blue-500" />;
    case 'image':
      return <FileImage size={16} className="text-purple-500" />;
    case 'spreadsheet':
      return <FileSpreadsheet size={16} className="text-green-500" />;
    case 'other':
      return <File size={16} className="text-gray-500" />;
  }
};

const getCategoryBadge = (category: Document['category']) => {
  switch (category) {
    case 'contract':
      return <Badge variant="primary">Contract</Badge>;
    case 'guide':
      return <Badge variant="info">Guide</Badge>;
    case 'report':
      return <Badge variant="success">Report</Badge>;
    case 'proposal':
      return <Badge variant="warning">Proposal</Badge>;
    case 'other':
      return <Badge variant="default">Other</Badge>;
  }
};

export const DocumentsWidget: React.FC<DocumentsWidgetProps> = ({
  documents,
  onViewAll,
  onUploadDocument,
  onDownloadDocument,
  onViewDocument,
  className,
  loading = false,
}) => {
  // Sort documents by date (newest first)
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documents & Resources</CardTitle>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onUploadDocument}
          >
            Upload
          </Button>
        </div>
        <CardDescription>
          Access and manage important documents
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
          </div>
        ) : (
          <>
            {sortedDocuments.slice(0, 5).map((document) => (
              <div 
                key={document.id} 
                className="p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                      {getDocumentIcon(document.type)}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-1">
                        {document.name}
                        {document.restricted && (
                          <Lock size={14} className="text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{formatFileSize(document.fileSize)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{formatDateTime(document.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {getCategoryBadge(document.category)}
                </div>
                
                <div className="mt-3 flex justify-end items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={() => onViewDocument?.(document.id)}
                    title="View Document"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download size={14} />}
                    onClick={() => onDownloadDocument?.(document.id)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <FileText size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No documents</p>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-blue-600 hover:text-blue-700"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAll}
        >
          View All Documents
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentsWidget;