import { X } from "lucide-react";
import { useEffect } from "react";

export default function PropertyModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[780px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 shrink-0">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition text-foreground"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
          {title && (
            <h2 className="text-[16px] font-bold text-foreground ml-2">
              {title}
            </h2>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}
