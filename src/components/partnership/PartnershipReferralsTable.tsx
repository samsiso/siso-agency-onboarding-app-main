import * as React from "react";
import { useRef, useMemo, useState, useId } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleX,
  Columns3,
  Filter,
  ListFilter,
  Plus,
  Trash,
  Ellipsis,
  CircleAlert,
  Edit,
  Check,
  X,
  ExternalLink,
  Image,
  MessageCircle,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  Row
} from "@tanstack/react-table";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AirtableTable } from "@/components/common/AirtableTable";

// Partnership referral data type
interface PartnershipReferral {
  id: string;
  client_name: string;
  client_email: string;
  business_name: string;
  business_description?: string; // What they do
  logo_url?: string; // Company logo
  website_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  phone?: string;
  whatsapp_number?: string; // WhatsApp contact
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'mvp_ready' | 'converted' | 'rejected';
  source: string;
  project_type: string;
  estimated_value: number;
  commission_rate: number;
  expected_commission: number;
  referral_date: string;
  mvp_notes?: string; // Notes for MVP creation
  notes?: string;
}

// Inline editable cell component
interface EditableCellProps {
  value: string | number | undefined;
  onSave: (value: string) => void;
  type?: 'text' | 'select' | 'number' | 'email' | 'phone';
  options?: { value: string; label: string }[];
  className?: string;
}

function EditableCell({ value, onSave, type = 'text', options, className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value || ''));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        {type === 'select' && options ? (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            type={type === 'number' ? 'number' : type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        )}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-6 w-6 p-0 text-green-400 hover:bg-green-400/20"
          >
            <Check size={12} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/20"
          >
            <X size={12} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer px-2 py-1 rounded hover:bg-gray-800/50 min-h-[32px] flex items-center group",
        className
      )}
    >
      <span className="flex-1">{value || '-'}</span>
      <Edit size={12} className="opacity-0 group-hover:opacity-50 text-gray-400 ml-2" />
    </div>
  );
}

// Map status to badge color
function statusToBadge(status: string) {
  switch (status) {
    case 'converted':
      return <Badge className="bg-green-500/20 text-green-400">Converted</Badge>;
    case 'mvp_ready':
      return <Badge className="bg-emerald-500/20 text-emerald-400">MVP Ready</Badge>;
    case 'proposal_sent':
      return <Badge className="bg-blue-500/20 text-blue-400">Proposal Sent</Badge>;
    case 'qualified':
      return <Badge className="bg-purple-500/20 text-purple-400">Qualified</Badge>;
    case 'contacted':
      return <Badge className="bg-yellow-500/20 text-yellow-400">Contacted</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
    case 'new':
    default:
      return <Badge className="bg-amber-500/20 text-amber-400">New</Badge>;
  }
}

// Status options for dropdown
const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'mvp_ready', label: 'MVP Ready' },
  { value: 'converted', label: 'Converted' },
  { value: 'rejected', label: 'Rejected' }
];

// Source options
const sourceOptions = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'referral', label: 'Direct Referral' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' }
];

// Project type options
const projectTypeOptions = [
  { value: 'web_app', label: 'Web Application' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'e_commerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'website', label: 'Website' },
  { value: 'custom', label: 'Custom Development' },
  { value: 'consultation', label: 'Consultation' }
];

// Enhanced columns with inline editing
const createColumns = (
  onUpdateField: (id: string, field: string, value: string) => void
): ColumnDef<PartnershipReferral>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-600 data-[state=checked]:bg-orange-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-600 data-[state=checked]:bg-orange-600"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Client Name",
    accessorKey: "client_name",
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("client_name")}
        onSave={(value) => onUpdateField(row.original.id, 'client_name', value)}
        className="font-medium"
      />
    ),
    size: 180,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const rowValue = [row.original.client_name, row.original.client_email || "", row.original.business_name || ""].join(" ").toLowerCase();
      return rowValue.includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    header: "Email",
    accessorKey: "client_email",
    size: 210,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("client_email")}
        onSave={(value) => onUpdateField(row.original.id, 'client_email', value)}
        type="email"
      />
    )
  },
  {
    header: "Business",
    accessorKey: "business_name",
    size: 170,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("business_name")}
        onSave={(value) => onUpdateField(row.original.id, 'business_name', value)}
      />
    )
  },
  {
    header: "Phone",
    accessorKey: "phone",
    size: 130,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("phone")}
        onSave={(value) => onUpdateField(row.original.id, 'phone', value)}
        type="phone"
      />
    )
  },
  {
    header: "WhatsApp",
    accessorKey: "whatsapp_number",
    size: 130,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-3 w-3 text-green-500" />
        <EditableCell
          value={row.getValue("whatsapp_number")}
          onSave={(value) => onUpdateField(row.original.id, 'whatsapp_number', value)}
          type="phone"
        />
      </div>
    )
  },
  {
    header: "What They Do",
    accessorKey: "business_description",
    size: 200,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("business_description")}
        onSave={(value) => onUpdateField(row.original.id, 'business_description', value)}
        className="text-sm"
      />
    )
  },
  {
    header: "Logo",
    accessorKey: "logo_url",
    size: 80,
    cell: ({ row }) => {
      const logoUrl = row.getValue("logo_url") as string;
      return logoUrl ? (
        <div className="flex items-center justify-center">
          <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover" />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Image className="h-4 w-4 text-gray-500" />
        </div>
      );
    }
  },
  {
    header: "Social Links",
    accessorKey: "social_links",
    size: 120,
    cell: ({ row }) => (
      <div className="flex items-center space-x-1">
        {row.original.website_url && (
          <a href={row.original.website_url} target="_blank" rel="noopener noreferrer">
            <Globe className="h-3 w-3 text-blue-400 hover:text-blue-300" />
          </a>
        )}
        {row.original.linkedin_url && (
          <a href={row.original.linkedin_url} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-3 w-3 text-blue-600 hover:text-blue-500" />
          </a>
        )}
        {row.original.instagram_url && (
          <a href={row.original.instagram_url} target="_blank" rel="noopener noreferrer">
            <Instagram className="h-3 w-3 text-pink-500 hover:text-pink-400" />
          </a>
        )}
        {row.original.facebook_url && (
          <a href={row.original.facebook_url} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-3 w-3 text-blue-500 hover:text-blue-400" />
          </a>
        )}
        {row.original.twitter_url && (
          <a href={row.original.twitter_url} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-3 w-3 text-sky-400 hover:text-sky-300" />
          </a>
        )}
      </div>
    )
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("status")}
        onSave={(value) => onUpdateField(row.original.id, 'status', value)}
        type="select"
        options={statusOptions}
      />
    ),
    size: 140,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      const status = row.getValue(columnId) as string;
      return filterValue.includes(status);
    },
  },
  {
    header: "Source",
    accessorKey: "source",
    size: 120,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("source")}
        onSave={(value) => onUpdateField(row.original.id, 'source', value)}
        type="select"
        options={sourceOptions}
      />
    )
  },
  {
    header: "Project Type",
    accessorKey: "project_type",
    size: 140,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("project_type")}
        onSave={(value) => onUpdateField(row.original.id, 'project_type', value)}
        type="select"
        options={projectTypeOptions}
      />
    )
  },
  {
    header: "Est. Value",
    accessorKey: "estimated_value",
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("estimated_value")}
        onSave={(value) => onUpdateField(row.original.id, 'estimated_value', value)}
        type="number"
        className="text-right"
      />
    ),
    size: 120,
  },
  {
    header: "Commission",
    accessorKey: "expected_commission",
    cell: ({ row }) => {
      const value = row.getValue("expected_commission") as number;
      return (
        <div className="text-right text-green-400 font-medium">
          £{value?.toLocaleString() || 0}
        </div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} onUpdateField={onUpdateField} />,
    size: 60,
    enableHiding: false,
  }
];

function RowActions({ 
  row, 
  onUpdateField 
}: { 
  row: Row<PartnershipReferral>;
  onUpdateField: (id: string, field: string, value: string) => void;
}) {
  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete referral:', row.original.id);
  };

  const handleContact = () => {
    // Open email client or phone
    if (row.original.client_email) {
      window.open(`mailto:${row.original.client_email}`, '_blank');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button 
            size="icon" 
            variant="ghost" 
            className="shadow-none text-gray-400 hover:text-white hover:bg-gray-800" 
            aria-label="Referral actions"
          >
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
        <DropdownMenuLabel className="text-gray-200">Referral Actions</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={handleContact}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <ExternalLink size={14} className="mr-2" />
          Contact Client
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
        >
          <Trash size={14} className="mr-2" />
          Delete Referral
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Add new row component
interface AddNewRowProps {
  onAddReferral: (referralData: Partial<PartnershipReferral>) => void;
  columnsCount: number;
}

function AddNewRow({ onAddReferral, columnsCount }: AddNewRowProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newReferral, setNewReferral] = useState<Partial<PartnershipReferral>>({
    client_name: '',
    client_email: '',
    business_name: '',
    business_description: '',
    logo_url: '',
    website_url: '',
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    phone: '',
    whatsapp_number: '',
    status: 'new',
    source: 'linkedin',
    project_type: 'web_app',
    estimated_value: 0,
    commission_rate: 15,
    expected_commission: 0,
    referral_date: new Date().toISOString().split('T')[0],
    mvp_notes: '',
    notes: ''
  });

  const handleSave = () => {
    if (newReferral.client_name || newReferral.business_name) {
      // Calculate expected commission
      const commission = (newReferral.estimated_value || 0) * ((newReferral.commission_rate || 15) / 100);
      onAddReferral({
        ...newReferral,
        expected_commission: commission
      });
      setNewReferral({
        client_name: '',
        client_email: '',
        business_name: '',
        business_description: '',
        logo_url: '',
        website_url: '',
        linkedin_url: '',
        instagram_url: '',
        facebook_url: '',
        twitter_url: '',
        phone: '',
        whatsapp_number: '',
        status: 'new',
        source: 'linkedin',
        project_type: 'web_app',
        estimated_value: 0,
        commission_rate: 15,
        expected_commission: 0,
        referral_date: new Date().toISOString().split('T')[0],
        mvp_notes: '',
        notes: ''
      });
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewReferral({
      client_name: '',
      client_email: '',
      business_name: '',
      business_description: '',
      logo_url: '',
      website_url: '',
      linkedin_url: '',
      instagram_url: '',
      facebook_url: '',
      twitter_url: '',
      phone: '',
      whatsapp_number: '',
      status: 'new',
      source: 'linkedin',
      project_type: 'web_app',
      estimated_value: 0,
      commission_rate: 15,
      expected_commission: 0,
      referral_date: new Date().toISOString().split('T')[0],
      mvp_notes: '',
      notes: ''
    });
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <TableRow className="border-orange-500/30 bg-gray-800/30">
        <TableCell>
          <Checkbox disabled className="border-gray-600" />
        </TableCell>
        <TableCell>
          <Input
            value={newReferral.client_name || ''}
            onChange={(e) => setNewReferral(prev => ({ ...prev, client_name: e.target.value }))}
            placeholder="Client Name"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={newReferral.client_email || ''}
            onChange={(e) => setNewReferral(prev => ({ ...prev, client_email: e.target.value }))}
            placeholder="Email"
            type="email"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={newReferral.business_name || ''}
            onChange={(e) => setNewReferral(prev => ({ ...prev, business_name: e.target.value }))}
            placeholder="Business Name"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={newReferral.phone || ''}
            onChange={(e) => setNewReferral(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone"
            type="tel"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Select 
            value={newReferral.status || 'new'} 
            onValueChange={(value) => setNewReferral(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {statusOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select 
            value={newReferral.source || 'linkedin'} 
            onValueChange={(value) => setNewReferral(prev => ({ ...prev, source: value }))}
          >
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {sourceOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select 
            value={newReferral.project_type || 'web_app'} 
            onValueChange={(value) => setNewReferral(prev => ({ ...prev, project_type: value }))}
          >
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {projectTypeOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            value={newReferral.estimated_value || ''}
            onChange={(e) => setNewReferral(prev => ({ ...prev, estimated_value: parseFloat(e.target.value) || 0 }))}
            placeholder="0"
            type="number"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <div className="text-right text-green-400">
            £{((newReferral.estimated_value || 0) * 0.15).toLocaleString()}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
            >
              <Check size={12} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/20"
            >
              <X size={12} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow 
      className="border-dashed border-gray-600 hover:bg-gray-800/50 cursor-pointer"
      onClick={() => setIsAdding(true)}
    >
      <TableCell colSpan={columnsCount} className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-orange-400">
          <Plus size={16} />
          <span>Add new referral</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PartnershipReferralsTable() {
  const id = useId();
  const { toast } = useToast();

  // Mock data for now - replace with real API calls
  const [referrals] = useState<PartnershipReferral[]>([
    {
      id: '1',
      client_name: 'John Smith',
      client_email: 'john@techstartup.com',
      business_name: 'Tech Startup Ltd',
      business_description: 'B2B SaaS platform for project management',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop&crop=entropy',
      website_url: 'https://techstartup.com',
      linkedin_url: 'https://linkedin.com/company/techstartup',
      instagram_url: 'https://instagram.com/techstartup',
      phone: '+44 7123 456789',
      whatsapp_number: '+44 7123 456789',
      status: 'qualified',
      source: 'linkedin',
      project_type: 'web_app',
      estimated_value: 15000,
      commission_rate: 15,
      expected_commission: 2250,
      referral_date: '2024-01-15',
      mvp_notes: 'Need demo with project management features',
      notes: 'Interested in e-commerce platform'
    },
    {
      id: '2',
      client_name: 'Sarah Johnson',
      client_email: 'sarah@designco.com',
      business_name: 'Design Co',
      business_description: 'Creative agency specializing in brand identity',
      logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=entropy',
      website_url: 'https://designco.com',
      linkedin_url: 'https://linkedin.com/company/designco',
      facebook_url: 'https://facebook.com/designco',
      phone: '+44 7987 654321',
      whatsapp_number: '+44 7987 654321',
      status: 'mvp_ready',
      source: 'referral',
      project_type: 'mobile_app',
      estimated_value: 25000,
      commission_rate: 15,
      expected_commission: 3750,
      referral_date: '2024-01-20',
      mvp_notes: 'Portfolio showcase app MVP completed',
      notes: 'iOS and Android app needed'
    },
    {
      id: '3',
      client_name: 'Mike Brown',
      client_email: 'mike@retailbiz.com',
      business_name: 'Retail Business',
      business_description: 'Multi-location retail chain with online presence',
      logo_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f9da2c?w=64&h=64&fit=crop&crop=entropy',
      website_url: 'https://retailbiz.com',
      linkedin_url: 'https://linkedin.com/company/retailbiz',
      twitter_url: 'https://twitter.com/retailbiz',
      phone: '+44 7456 123789',
      whatsapp_number: '+44 7456 123789',
      status: 'converted',
      source: 'networking',
      project_type: 'e_commerce',
      estimated_value: 35000,
      commission_rate: 15,
      expected_commission: 5250,
      referral_date: '2024-01-10',
      mvp_notes: 'Custom e-commerce solution delivered',
      notes: 'Shopify to custom solution migration'
    }
  ]);

  // Table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "client_name", desc: false }]);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle field updates
  const handleUpdateField = async (id: string, field: string, value: string) => {
    try {
      // TODO: Implement actual API call to update referral
      console.log('Updating referral:', { id, field, value });
      
      toast({
        title: "Referral Updated",
        description: `${field} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update referral. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle adding new referral
  const handleAddReferral = async (referralData: Partial<PartnershipReferral>) => {
    try {
      // TODO: Implement actual API call to create referral
      console.log('Adding new referral:', referralData);
      
      toast({
        title: "Referral Added",
        description: "New referral has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add new referral. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo(() => createColumns(handleUpdateField), []);

  const table = useReactTable({
    data: referrals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    enableSortingRemoval: false,
    manualPagination: false,
  });

  return (
    <div className="w-full">
      <AirtableTable
        table={table}
        columns={columns}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        renderRowActions={(row) => <RowActions row={row} onUpdateField={handleUpdateField} />}
        statusBadge={statusToBadge}
        addButton={
          <Button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white" variant="default">
            <Plus className="-ms-1 me-2 opacity-90" size={16} strokeWidth={2} aria-hidden="true" />
            Add referral
          </Button>
        }
        deleteSelectedTitle="Delete referral(s)"
        addNewRow={<AddNewRow onAddReferral={handleAddReferral} columnsCount={columns.length} />}
      />
    </div>
  );
}