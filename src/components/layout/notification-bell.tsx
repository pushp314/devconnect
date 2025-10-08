"use client";
import * as React from "react";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { getNotifications, markAsRead } from "@/app/actions/notifications";
import type { Notification } from '@prisma/client';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ClientTime } from "../client-time";

export function NotificationBell() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchNotifications = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedNotifications = await getNotifications();
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast({ variant: 'destructive', title: "Failed to load notifications." });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    React.useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    
    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            toast({ title: "Notification marked as read." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Failed to mark as read." });
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                            {unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                    <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : notifications.length === 0 ? (
                    <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} asChild className="cursor-pointer" style={{ opacity: notification.read ? 0.6 : 1 }}>
                           <Link href={notification.link} className="flex items-start gap-2">
                                <div className="flex-grow">
                                     <p className="text-sm leading-snug">{notification.message}</p>
                                     <p className="text-xs text-muted-foreground mt-1">
                                        <ClientTime date={notification.createdAt} />
                                     </p>
                                </div>
                                {!notification.read && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleMarkAsRead(notification.id, e)}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                )}
                           </Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
