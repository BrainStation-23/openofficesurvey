
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UserIssueBoard } from "../types";

export function useIssueBoards() {
  return useQuery({
    queryKey: ['user-issue-boards'],
    queryFn: async () => {
      console.log('Fetching issue boards...');
      
      const { data: boardsData, error: boardsError } = await supabase
        .from('issue_boards')
        .select(`
          id,
          name,
          description,
          status,
          created_at,
          created_by,
          issue_board_permissions!inner (
            can_view,
            can_create,
            can_vote
          )
        `)
        .eq('status', 'active');

      if (boardsError) {
        console.error('Error fetching boards:', boardsError);
        throw boardsError;
      }

      console.log('Fetched boards:', boardsData);

      // Map the data to match our UserIssueBoard type
      const boards = boardsData.map(board => ({
        id: board.id,
        name: board.name,
        description: board.description,
        status: board.status,
        created_at: board.created_at,
        created_by: board.created_by,
        permissions: {
          can_view: board.issue_board_permissions[0]?.can_view ?? false,
          can_create: board.issue_board_permissions[0]?.can_create ?? false,
          can_vote: board.issue_board_permissions[0]?.can_vote ?? false
        }
      })) as UserIssueBoard[];

      console.log('Mapped boards:', boards);
      return boards;
    }
  });
}
