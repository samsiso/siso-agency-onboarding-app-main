
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  ArrowUpDown,
  FileDown,
  FilePlus,
  Edit,
  Trash,
  Eye,
  Send,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample data - in a real app, this would come from your API
const revenues = [
  {
    id: "1",
    client: "Acme Corp",
    project: "Website Redesign",
    amount: 5000.00,
    date: "2025-04-05",
    status: "Paid",
    invoiceNumber: "INV-001",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "2",
    client: "Tech Solutions",
    project: "Mobile App Development",
    amount: 15000.00,
    date: "2025-04-10",
    status: "Pending",
    invoiceNumber: "INV-002",
    paymentMethod: "Credit Card"
  },
  {
    id: "3",
    client: "Global Enterprises",
    project: "E-commerce Platform",
    amount: 12000.00,
    date: "2025-04-15",
    status: "Overdue",
    invoiceNumber: "INV-003",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "4",
    client: "Modern Marketing",
    project: "SEO Optimization",
    amount: 3500.00,
    date: "2025-04-20",
    status: "Paid",
    invoiceNumber: "INV-004",
    paymentMethod: "PayPal"
  },
  {
    id: "5",
    client: "Startup Inc",
    project: "Branding Package",
    amount: 7500.00,
    date: "2025-04-25",
    status: "Draft",
    invoiceNumber: "INV-005",
    paymentMethod: "Pending"
  }
];

export function RevenueTable() {
  const [searchQuery, setSearchQuery] = useState("");

  // Simple client-side filtering - in a real app, you'd use a more sophisticated approach
  const filteredRevenues = revenues.filter(revenue => 
    revenue.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    revenue.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    revenue.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Revenue Tracking</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search revenue..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9">
            <FilePlus className="h-4 w-4 mr-2" />
            Add Invoice
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center">
                  Client
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Project</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRevenues.length > 0 ? (
              filteredRevenues.map(revenue => (
                <TableRow key={revenue.id}>
                  <TableCell className="font-medium">{revenue.client}</TableCell>
                  <TableCell>{revenue.project}</TableCell>
                  <TableCell>£{revenue.amount.toFixed(2)}</TableCell>
                  <TableCell>{revenue.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={revenue.status} />
                  </TableCell>
                  <TableCell>{revenue.invoiceNumber}</TableCell>
                  <TableCell>{revenue.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Send Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No revenue records found. Try adjusting your filters or add a new invoice.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "bg-gray-100 text-gray-800";
  let icon = null;

  switch (status) {
    case "Paid":
      color = "bg-green-100 text-green-800";
      icon = <Check className="h-3 w-3 mr-1" />;
      break;
    case "Pending":
      color = "bg-amber-100 text-amber-800";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "Overdue":
      color = "bg-red-100 text-red-800";
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      break;
    case "Draft":
      color = "bg-blue-100 text-blue-800";
      icon = <Edit className="h-3 w-3 mr-1" />;
      break;
  }

  return (
    <Badge variant="outline" className={`${color} flex items-center w-fit`}>
      {icon}
      {status}
    </Badge>
  );
}
