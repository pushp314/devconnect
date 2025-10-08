import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CommentSection } from "./comment-section";
import { ScrollArea } from "../ui/scroll-area";

interface CommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippetId?: string;
  documentId?: string;
  bugId?: string;
}

export function CommentsSheet({ open, onOpenChange, snippetId, documentId, bugId }: CommentsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="font-headline text-2xl">Comments</SheetTitle>
          <SheetDescription>
            Join the conversation.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
            <div className="px-6 pb-6">
                <CommentSection snippetId={snippetId} documentId={documentId} bugId={bugId} isSheet={true} />
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
