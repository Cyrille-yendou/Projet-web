import type { ReactNode } from "react";

interface ModalConfirmProps {
  title: string;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ModalConfirm({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}: ModalConfirmProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 max-w-sm animate-fadeIn">
        
        <h2 className="text-xl font-bold mb-3 text-gray-800">{title}</h2>
        
        <div className="text-gray-600 mb-6">
          {message}
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end gap-3">
          {/* Bouton Annuler */}
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition"
          >
            {cancelText}
          </button>
          
          {/* Bouton Confirmer */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}