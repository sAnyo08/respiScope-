import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`min-w-[250px] p-4 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-xl border pointer-events-auto ${
              toast.type === "success" 
                ? "bg-[#0b2b22]/80 border-teal-500/30 text-teal-100" 
                : "bg-red-900/80 border-red-500/30 text-red-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-teal-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
