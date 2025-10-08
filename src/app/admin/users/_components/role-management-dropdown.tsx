
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Loader2, MoreVertical } from 'lucide-react';
import { Role } from '@prisma/client';
import { updateUserRole } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';

interface RoleManagementDropdownProps {
    userId: string;
    currentRole: Role;
}

export function RoleManagementDropdown({ userId, currentRole }: RoleManagementDropdownProps) {
    const { toast } = useToast();
    const [role, setRole] = useState(currentRole);
    const [isLoading, setIsLoading] = useState(false);

    const onRoleChange = async (newRole: Role) => {
        if (newRole === role) return;

        setIsLoading(true);
        try {
            await updateUserRole({ userId, role: newRole });
            setRole(newRole);
            toast({ title: "User role updated successfully." });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Failed to update role." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <MoreVertical />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={role} onValueChange={(value) => onRoleChange(value as Role)}>
                    <DropdownMenuRadioItem value={Role.USER}>User</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={Role.ADMIN}>Admin</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
