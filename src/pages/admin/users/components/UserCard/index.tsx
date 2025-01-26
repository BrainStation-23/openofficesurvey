import { User } from "../../types";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  user: User;
  selected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onPasswordChange: (userId: string) => void;
  onRoleToggle: (userId: string, isAdmin: boolean) => void;
  onStatusToggle: (userId: string, isActive: boolean) => void;
}

export function UserCard({
  user,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onPasswordChange,
  onRoleToggle,
  onStatusToggle,
}: UserCardProps) {
  const isAdmin = user.user_roles.role === "admin";
  const isActive = user.status === "active";
  const primarySbu = user.user_sbus?.find((sbu) => sbu.is_primary)?.sbu.name;

  return (
    <Card className={`relative ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="absolute top-4 right-4">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(user.id, checked as boolean)}
        />
      </div>
      
      <CardHeader className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profile_image_url || undefined} />
            <AvatarFallback>
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold leading-none">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.org_id && (
              <Badge variant="outline" className="mt-1">
                {user.org_id}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Admin</span>
            <Switch
              checked={isAdmin}
              onCheckedChange={(checked) => onRoleToggle(user.id, checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active</span>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => onStatusToggle(user.id, checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          {primarySbu && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Primary SBU</span>
              <span>{primarySbu}</span>
            </div>
          )}
          {user.designation && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Designation</span>
              <span>{user.designation}</span>
            </div>
          )}
          {user.level && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <span>{user.level}</span>
            </div>
          )}
          {user.location && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span>{user.location}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPasswordChange(user.id)}>
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(user.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}