import { AlertCircle, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 border border-stone rounded-2xl px-4 py-3 bg-brass-light/30">
      <AlertCircle size={18} className="text-red-600 shrink-0" />
      <p className="text-sm text-text/80 flex-1">
        {message || t("dashboard.error", "Something went wrong.")}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-sm text-brass font-medium shrink-0"
        >
          <RotateCw size={14} />
          {t("dashboard.retry", "Retry")}
        </button>
      )}
    </div>
  );
}