"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { reportUser } from '@/app/actions/users';
import { Loader2 } from 'lucide-react';

interface ReportUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
}

export function ReportUserDialog({ isOpen, onClose, targetUserId }: ReportUserDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (reason.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Reason is too short",
        description: "Please provide a more detailed reason for your report.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reportUser({ targetUserId, reason });
      toast({
        title: "User Reported",
        description: "Thank you. Our moderation team will review your report.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit report",
        description: (error as Error).message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
      setReason('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report User</DialogTitle>
          <DialogDescription>
            Why are you reporting this user? Your report is anonymous.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="reason">Reason for reporting</Label>
          <Textarea
            id="reason"
            placeholder="Please provide details about spam, harassment, or other rule violations."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting || reason.trim().length < 10}>
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
