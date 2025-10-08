"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { approveComponent, rejectComponent } from "@/app/actions/marketplace";
import { Check, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminActionsProps {
    componentId: string;
}

export function AdminActions({ componentId }: AdminActionsProps) {
    const [isLoading, setIsLoading] = useState< 'approve' | 'reject' | null>(null);
    const { toast } = useToast();

    const handleApprove = async () => {
        setIsLoading('approve');
        try {
            await approveComponent(componentId);
            toast({ title: "Component Approved" });
        } catch (error) {
            toast({ variant: 'destructive', title: "Failed to approve" });
        } finally {
            setIsLoading(null);
        }
    };

    const handleReject = async () => {
        setIsLoading('reject');
         try {
            await rejectComponent(componentId);
            toast({ title: "Component Rejected" });
        } catch (error) {
            toast({ variant: 'destructive', title: "Failed to reject" });
        } finally {
            setIsLoading(null);
        }
    };


    return (
        <div className="flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={!!isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading === 'approve' ? <Loader2 className="animate-spin" /> : <Check />}
                Approve
            </Button>
            <Button variant="destructive" size="sm" onClick={handleReject} disabled={!!isLoading}>
                {isLoading === 'reject' ? <Loader2 className="animate-spin" /> : <X />}
                Reject
            </Button>
        </div>
    );
}
