
import React, { useState } from 'react';
import { ClientData } from '@/types/client.types';
import { useClientDocuments } from '@/hooks/client/useClientDocuments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  FileCode, 
  FileImage, 
  PlusCircle, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ClientDocuments({ client }: { client: ClientData }) {
  const { documents, createDocument, updateDocument, deleteDocument } = useClientDocuments(client.id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    document_type: 'app_plan'
  });

  const documentTypes = [
    { value: 'app_plan', label: 'App Plan', icon: <FileText className="h-5 w-5 text-blue-500" /> },
    { value: 'functionalities', label: 'Functionalities', icon: <FileCode className="h-5 w-5 text-green-500" /> },
    { value: 'wireframes', label: 'Wireframe Inspiration', icon: <FileImage className="h-5 w-5 text-purple-500" /> },
    { value: 'inspiration', label: 'Design Inspiration', icon: <FileImage className="h-5 w-5 text-orange-500" /> }
  ];

  const handleCreateDocument = () => {
    createDocument(newDocument);
    setIsCreateModalOpen(false);
    setNewDocument({ title: '', content: '', document_type: 'app_plan' });
  };

  const handleUpdateDocument = () => {
    if (selectedDocument) {
      updateDocument({ 
        id: selectedDocument.id, 
        title: selectedDocument.title, 
        content: selectedDocument.content 
      });
      setSelectedDocument(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Client Documents</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents?.map((doc) => {
          const docType = documentTypes.find(type => type.value === doc.document_type);
          return (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  {docType?.icon}
                  {doc.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {doc.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Document</SheetTitle>
            <SheetDescription>
              Create a new document for this client project
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Document Type</label>
              <Select 
                value={newDocument.document_type} 
                onValueChange={(value) => setNewDocument(prev => ({ ...prev, document_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input 
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea 
                value={newDocument.content}
                onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your document content here"
                rows={10}
              />
            </div>
            <Button 
              onClick={handleCreateDocument} 
              className="w-full"
              disabled={!newDocument.title.trim()}
            >
              Create Document
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {selectedDocument && (
        <Sheet open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Document</SheetTitle>
              <SheetDescription>
                Edit the details of your document
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input 
                  value={selectedDocument.title}
                  onChange={(e) => setSelectedDocument(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter document title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea 
                  value={selectedDocument.content}
                  onChange={(e) => setSelectedDocument(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your document content here"
                  rows={10}
                />
              </div>
              <Button 
                onClick={handleUpdateDocument} 
                className="w-full"
                disabled={!selectedDocument.title.trim()}
              >
                Save Changes
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
