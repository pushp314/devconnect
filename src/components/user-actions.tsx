"use client";

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal, ShieldAlert, UserX, Loader2 } from 'lucide-react';
import { ReportUserDialog } from './report-user-dialog';
import { blockUser } from '@/app/actions/users';
import { useToast } from '../hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
  targetUserId: string;
}

export function UserActions({ targetUserId }: UserActionsProps) {
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
        await blockUser(targetUserId);
        toast({
            title: "User Blocked",
            description: "You will no longer see this user's profile or content.",
        });
        router.refresh();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to block user",
            description: (error as Error).message,
        });
    } finally {
        setIsBlocking(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleBlock} disabled={isBlocking} className="text-destructive focus:text-destructive">
            {isBlocking ? <Loader2 className="mr-2 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
            <span>Block User</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            <span>Report User</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ReportUserDialog 
        isOpen={isReportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        targetUserId={targetUserId}
      />
    </>
  );
}
