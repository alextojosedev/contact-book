import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle;
        let typeClass = "toast-success";
        if (toast.type === "error") {
          Icon = AlertCircle;
          typeClass = "toast-error";
        } else if (toast.type === "info") {
          Icon = Info;
          typeClass = "toast-info";
        }

        return (
          <div
            key={toast.id}
            className={`toast ${typeClass} animate-scale-in`}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ color: "var(--text-muted)", padding: "2px" }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
