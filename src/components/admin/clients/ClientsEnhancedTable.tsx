import React from 'react';
import { ClientsTable } from './ClientsTable';
import { useClientTable } from './hooks/useClientTable';
import { ClientViewPreference } from '@/types/client.types';
import { 
  Search,
  Filter,
  Plus,
  RefreshCw,
  Download,
  Upload,
  // ViewColumns - removed this invalid icon import
  Columns
} from 'lucide-react';
