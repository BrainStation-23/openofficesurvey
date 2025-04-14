
export interface Response {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  response_data: Record<string, any>;
  campaign_instance_id: string;
  assignment: {
    id: string;
    campaign_id: string;
    campaign: {
      id: string;
      name: string;
      anonymous: boolean;
    };
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_sbus: {
      is_primary: boolean;
      sbu: {
        id: string;
        name: string;
      };
    }[];
    user_supervisors: {
      is_primary: boolean;
      supervisor: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
      };
    }[];
  };
  total_count?: number;
  primary_sbu_name?: string;
  primary_supervisor_name?: string;
}

export interface FilterOptions {
  search: string;
  sortBy: "date" | "name";
  sortDirection: "asc" | "desc";
  // Additional filters can be added here in the future
}

// Define the RPC response structure matching what the database returns
export interface RPCResponseItem {
  id: string;
  assignment_id: string;
  user_id: string;
  campaign_instance_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  status: string;
  response_data: Record<string, any>;
  state_data: Record<string, any> | null;
  total_count: number;
  campaign_anonymous: boolean;
  primary_sbu_name: string | null;
  primary_supervisor_name: string | null;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    user_sbus: {
      is_primary: boolean;
      sbu: {
        id: string;
        name: string;
      };
    }[] | null;
    user_supervisors: {
      is_primary: boolean;
      supervisor: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        email: string;
      };
    }[] | null;
  };
  assignment: {
    id: string;
    campaign_id: string;
    campaign: {
      id: string;
      name: string;
      anonymous: boolean;
    };
  };
}

// Define the database RPC function type
export type GetPaginatedCampaignResponsesFunction = (
  args: {
    p_campaign_id: string;
    p_instance_id: string;
    p_search_term: string | null;
    p_page: number;
    p_page_size: number;
    p_sort_by: string;
    p_sort_direction: string;
  }
) => RPCResponseItem[];
