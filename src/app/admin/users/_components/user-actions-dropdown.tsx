
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Loader2, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { Role, User } from '@prisma/client';
import { updateUserRole, updateUserStatus } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';

interface UserActionsDropdownProps {
    user: User;
}

export function UserActionsDropdown({ user }: UserActionsDropdownProps) {
    const adminUser = useCurrentUser();
    const { toast } = useToast();
    const [role, setRole] = useState(user.role);
    const [isBlocked, setIsBlocked] = useState(user.isBlocked);
    const [isLoading, setIsLoading] = useState< 'role' | 'status' | null>(null);

    const onRoleChange = async (newRole: Role) => {
        if (newRole === role) return;

        setIsLoading('role');
        try {
            await updateUserRole({ userId: user.id, role: newRole });
            setRole(newRole);
            toast({ title: "User role updated successfully." });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Failed to update role." });
        } finally {
            setIsLoading(null);
        }
    };
    
    const onStatusChange = async () => {
        setIsLoading('status');
        try {
            await updateUserStatus({ userId: user.id, isBlocked: !isBlocked });
            setIsBlocked(!isBlocked);
            toast({ title: `User has been ${!isBlocked ? 'blocked' : 'unblocked'}.` });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: (error as Error).message || "Failed to update status." });
        } finally {
            setIsLoading(null);
        }
    };

    if (user.id === adminUser?.id) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!!isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <MoreVertical />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={role} onValueChange={(value) => onRoleChange(value as Role)}>
                    <DropdownMenuRadioItem value={Role.USER}>User</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={Role.ADMIN}>Admin</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onStatusChange} className={isBlocked ? "text-green-600 focus:text-green-600" : "text-destructive focus:text-destructive"}>
                     {isBlocked ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Unblock User</span>
                        </>
                    ) : (
                         <>
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Block User</span>
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
