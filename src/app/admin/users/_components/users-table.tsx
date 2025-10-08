
import type { User } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserActionsDropdown } from './user-actions-dropdown';
import { ClientTime } from '@/components/client-time';
import { cn } from '@/lib/utils';

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                    <TableRow key={user.id} className={cn(user.isBlocked && 'bg-destructive/10 hover:bg-destructive/20')}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} data-ai-hint="person face"/>
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                           <Badge variant={user.isBlocked ? 'destructive' : 'secondary'}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                        </TableCell>
                         <TableCell>
                            <ClientTime date={user.createdAt} format={{ year: 'numeric', month: 'short', day: 'numeric' }} />
                        </TableCell>
                        <TableCell className="text-right">
                            <UserActionsDropdown user={user} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
