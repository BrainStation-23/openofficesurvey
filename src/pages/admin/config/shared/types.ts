
export interface ConfigItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  color_code?: string;
  prompt_text?: string;
  category?: 'general_analysis' | 'demographic_insights' | 'response_patterns' | 'improvement_suggestions' | 'action_items';
  created_at?: string;
  updated_at?: string;
}

export interface ConfigFormProps {
  onSubmit: (values: { 
    name: string; 
    color_code?: string;
    prompt_text?: string;
    category?: 'general_analysis' | 'demographic_insights' | 'response_patterns' | 'improvement_suggestions' | 'action_items';
  }) => void;
  initialValues?: { 
    name: string; 
    color_code?: string;
    prompt_text?: string;
    category?: 'general_analysis' | 'demographic_insights' | 'response_patterns' | 'improvement_suggestions' | 'action_items';
  };
  submitLabel?: string;
  showPromptField?: boolean;
}

export interface ConfigTableProps<T extends ConfigItem> {
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: 'active' | 'inactive') => void;
  isLoading?: boolean;
  sortOrder: 'asc' | 'desc';
  onSort: () => void;
}

export interface ConfigPageProps<T extends ConfigItem> {
  title: string;
  items: T[];
  isLoading: boolean;
  sortOrder: 'asc' | 'desc';
  onSort: () => void;
  onCreate: (values: { name: string; color_code?: string }) => void;
  onUpdate: (id: string, values: { name: string; color_code?: string }) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: 'active' | 'inactive') => void;
}
