import { Table, TableBody } from "@/components/ui/table";
import { User } from "../../types";
import { UsersTableHeader } from "./TableHeader";
import { UserRow } from "./UserRow";

interface TableContainerProps {
  users: User[];
  onDelete: (userId: string) => void;
  onPasswordChange: (userId: string) => void;
}

export function TableContainer({ 
  users, 
  onDelete, 
  onPasswordChange 
}: TableContainerProps) {
  return (
    <Table>
      <UsersTableHeader />
      <TableBody>
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onDelete={onDelete}
            onPasswordChange={onPasswordChange}
          />
        ))}
      </TableBody>
    </Table>
  );
}