
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImportLead } from "@/hooks/useLeadImport";

interface DataPreviewProps {
  data: string[][];
  columnMappings: { sourceColumn: string; targetField: string; }[];
}

export const DataPreview = ({ data, columnMappings }: DataPreviewProps) => {
  if (!data.length) return null;

  return (
    <div className="max-h-[300px] overflow-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columnMappings.map((mapping, index) => (
              <TableHead key={index}>
                {mapping.targetField || 'Skip'}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 5).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
