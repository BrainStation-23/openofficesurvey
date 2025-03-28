import { useState } from "react";
import { Power, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AIPrompt {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  prompt_text: string;
  category: 'general_analysis' | 'demographic_insights' | 'response_patterns' | 'improvement_suggestions' | 'action_items';
}

interface AIPromptsTableProps {
  items: AIPrompt[];
  onEdit: (item: AIPrompt) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: 'active' | 'inactive') => void;
  isLoading?: boolean;
  sortOrder: 'asc' | 'desc';
  onSort: () => void;
}

export function AIPromptsTable({ 
  items, 
  onEdit, 
  onDelete,
  onToggleStatus,
  isLoading,
  sortOrder,
  onSort
}: AIPromptsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={onSort} className="h-8 p-0">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Prompt Text</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {item.category.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">
                {item.prompt_text}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={item.status === 'active' ? "success" : "secondary"}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(item.id, item.status === 'active' ? 'inactive' : 'active')}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete AI Prompt</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {item.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(item.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && (!items || items.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No AI prompts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
