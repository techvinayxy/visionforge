import { useEffect, useState } from "react";

function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;

    setIsExiting(false);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 3350);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`vf-toast vf-toast-${toast.type} ${
        isExiting ? "vf-toast-exit" : ""
      }`}
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      <span className="vf-toast-icon" aria-hidden="true">
        {toast.type === "success"
          ? "✓"
          : toast.type === "warning"
            ? "⚠"
            : "!"}
      </span>

      <div className="vf-toast-content">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button
        type="button"
        className="vf-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>

      <span className="vf-toast-progress" />
    </div>
  );
}

export default Toast;