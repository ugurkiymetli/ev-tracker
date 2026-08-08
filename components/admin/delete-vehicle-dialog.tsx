"use client";

import { useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { deleteVehicleAction } from "@/server/actions/admin";
import { useToast } from "@/components/ui/toast";
import { createPortal } from "react-dom";
import type { AdminVehicle } from "./admin-vehicles-table";

interface DeleteVehicleDialogProps {
  vehicle: AdminVehicle | null;
  onClose: () => void;
  onDeleted: (vehicleId: string) => void;
}

export function DeleteVehicleDialog({ vehicle, onClose, onDeleted }: DeleteVehicleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!vehicle) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteVehicleAction(vehicle.id);
      
      if (result.success) {
        toast({
          title: "Vehicle Deleted",
          description: `${vehicle.name} has been permanently deleted.`,
          variant: "success",
        });
        onDeleted(vehicle.id);
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-scale-in">
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-outfit mb-2">
            Delete Vehicle
          </h3>
          
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Are you sure you want to permanently delete <strong className="text-neutral-900 dark:text-white">{vehicle.name}</strong>? 
            This will also delete all associated charging sessions and expenses. This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white transition-colors flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
