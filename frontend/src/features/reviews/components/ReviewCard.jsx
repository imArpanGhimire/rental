import { Star, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ReviewCard({ review, isOwner, isOwnReview, onReply, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="border border-stone rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">{review.reviewer?.name ?? "Anonymous"}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < review.rating ? "fill-brass text-brass" : "text-stone"}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text/40">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
          {isOwnReview && (
            <button
              onClick={() => onDelete?.(review._id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-text/40 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete your review"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-text/80 mt-3 leading-relaxed">{review.comment}</p>

      {review.ownerReply?.comment && (
        <div className="mt-3 ml-4 border-l-2 border-brass pl-3">
          <p className="text-xs font-medium text-brass">{t("reviews.ownerReply", "Owner reply")}</p>
          <p className="text-sm text-text/70 mt-1">{review.ownerReply.comment}</p>
        </div>
      )}

      {isOwner && !review.ownerReply?.comment && (
        <button
          onClick={() => onReply(review._id)}
          className="text-xs text-brass font-medium mt-3"
        >
          {t("reviews.reply", "Reply")}
        </button>
      )}
    </div>
  );
}
