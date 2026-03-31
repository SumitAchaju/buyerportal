import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

// ── Remove confirmation modal ─────────────────────────────────────────────────
export function RemoveModal({
  propertyName,
  onConfirm,
  onCancel,
}: {
  propertyName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-6 max-w-sm w-full">
        <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <Trash2 className="w-4 h-4 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1">
          Remove from favourites?
        </h3>
        <p className="text-sm text-zinc-500 mb-5">
          <span className="font-medium text-zinc-700">{propertyName}</span> will
          be removed from your saved list.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-9 text-sm border-zinc-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-9 text-sm bg-red-500 hover:bg-red-600 text-white border-0"
            onClick={onConfirm}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
