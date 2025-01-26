import { Search, Upload, Download, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onExport: () => void;
  onImport: () => void;
  sbus: Array<{ id: string; name: string; }>;
  totalResults?: number;
  isSearching?: boolean;
  selectedSBU?: string;
  setSelectedSBU?: (value: string) => void;
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedSBU = "all",
  setSelectedSBU = () => {},
  onExport,
  onImport,
  sbus,
  isSearching,
  totalResults
}: SearchFiltersProps) {
  const addFilter = (key: string, value: string) => {
    const currentFilters = searchTerm.split(' ').filter(term => !term.startsWith(`${key}:`));
    const newSearchTerm = [...currentFilters, `${key}:${value}`].join(' ').trim();
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users... (Try status:active or role:admin)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[300px] pr-8"
          />
          {searchTerm && !isSearching && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-2 top-2.5">
              <LoadingSpinner size={16} />
            </div>
          )}
        </div>
        {totalResults !== undefined && (
          <span className="text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </span>
        )}
        <Select value={selectedSBU} onValueChange={setSelectedSBU}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by SBU" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SBUs</SelectItem>
            {sbus.map((sbu) => (
              <SelectItem key={sbu.id} value={sbu.id}>
                {sbu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addFilter('status', 'active')}
          >
            Active Users
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addFilter('role', 'admin')}
          >
            Admins
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onImport} variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import Users
        </Button>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Users
        </Button>
      </div>
    </div>
  );
}