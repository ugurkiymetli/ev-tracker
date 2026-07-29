"use client";

import { useState } from "react";
import { Trash2, Check, X } from "lucide-react";
import { deleteChargingSessionAction } from "@/app/actions";
import { ChargingSessionDialog } from "@/components/charging/charging-session-dialog";
import { useToast } from "@/components/ui/toast";
import { ChargingSession } from "@/types";

interface ProviderSimple {
  id: string;
  name: string;
  stationCount?: number;
}

interface ChargingRowActionsProps {
  session: ChargingSession;
  providers: ProviderSimple[];
  userTopProviderIds?: string[];
}

export function ChargingRowActions({
  session,
  providers,
  userTopProviderIds = [],
}: ChargingRowActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteChargingSessionAction(session.id);
      toast({
        title: "Oturum Silindi",
        description: "Şarj oturumu başarıyla silindi.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err.message || "Oturum silinemedi.",
        variant: "error",
      });
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-1.5 animate-fade-in">
        {/* Red Check Mark Icon Button to confirm deletion */}
        <button
          type="button"
          disabled={deleting}
          onClick={handleConfirmDelete}
          title="Confirm Delete"
          className="p-1.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[3]" />
        </button>

        {/* Regular X button to cancel and return to original config */}
        <button
          type="button"
          disabled={deleting}
          onClick={() => setConfirming(false)}
          title="Cancel"
          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <ChargingSessionDialog
        session={session}
        providers={providers}
        userTopProviderIds={userTopProviderIds}
      />
      <button
        type="button"
        onClick={() => setConfirming(true)}
        title="Delete Session"
        className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
