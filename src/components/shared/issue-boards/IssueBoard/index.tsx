
import React from "react";
import { useBoardData } from "../hooks/useBoardData";
import { BoardHeader } from "./BoardHeader";
import { IssuesList } from "./IssuesList";
import { CreateIssueButton } from "./CreateIssueButton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { BoardViewProps } from "../types";

export function IssueBoard({ boardId }: BoardViewProps) {
  const { data: board, isLoading, error } = useBoardData(boardId);

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading board. Please try again.
      </div>
    );
  }

  const permissions = board.permissions[0] || {
    can_create: false,
    can_vote: false,
    can_view: false
  };

  return (
    <div className="space-y-4">
      <BoardHeader board={board} onBack={handleBack} />
      
      <div className="flex justify-end">
        {permissions.can_create && (
          <CreateIssueButton boardId={boardId} />
        )}
      </div>

      <IssuesList 
        boardId={boardId} 
        canVote={permissions.can_vote} 
      />
    </div>
  );
}
