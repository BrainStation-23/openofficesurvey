export type Response = {
  id: string;
  assignment_id: string;
  user_id: string;
  response_data: Record<string, any>;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  campaign_instance_id: string | null;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  assignment?: {
    survey?: {
      json_data: {
        pages: Array<{
          elements: Array<{
            name: string;
            title?: string;
            type: string;
            rateMax?: number;
          }>;
        }>;
      };
    };
  };
};

export type SortOption = "date" | "name";
export type SortDirection = "asc" | "desc";

export type FilterOptions = {
  search: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
};