"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteUserAction } from "@/server/actions/admin";
import { useToast } from "@/components/ui/toast";

interface DeleteUserDialogProps {
  userId: string;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteUserDialog({ userId, username, isOpen, onClose, onSuccess }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteUserAction(userId);
    setIsDeleting(false);

    if (result.success) {
      toast({ title: "User deleted successfully", variant: "success" });
      onSuccess();
      onClose();
    } else {
      toast({ title: "Failed to delete user", description: result.error, variant: "error" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-fade-in relative">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-outfit text-neutral-900 dark:text-neutral-100">
            Delete User "{username}"?
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-sans">
            This action cannot be undone. All of the user's vehicles, charging sessions, expenses, and settings will be permanently deleted.
          </p>
          
          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
