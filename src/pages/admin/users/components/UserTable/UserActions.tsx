import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { User } from "../../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export default function UserActions({ user, onDelete }: UserActionsProps) {
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent successfully");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to send password reset email");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleResetPassword}>
          Reset Password
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}