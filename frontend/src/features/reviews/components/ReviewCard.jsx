import { useState } from "react";

import { Star, Trash2, Pencil, Send, X } from "lucide-react";

import { useTranslation } from "react-i18next";

export default function ReviewCard({
  review,
  isOwner,
  isOwnReview,
  onReply,
  onEditReply,
  onDelete,
  isReplying = false,
  isEditingReply = false,
}) {
  const { t } = useTranslation();

  const [replyText, setReplyText] = useState(review.ownerReply?.comment || "");

  const [replying, setReplying] = useState(false);

  const [editing, setEditing] = useState(false);

  const hasReply = Boolean(review.ownerReply?.comment);

  function startReply() {
    setReplyText("");
    setReplying(true);
    setEditing(false);
  }

  function startEdit() {
    setReplyText(review.ownerReply?.comment || "");

    setEditing(true);
    setReplying(false);
  }

  function cancelEditor() {
    setReplying(false);
    setEditing(false);

    setReplyText(review.ownerReply?.comment || "");
  }

  function submitReply() {
    const trimmed = replyText.trim();

    if (!trimmed) {
      return;
    }

    if (editing) {
      onEditReply?.(review._id, trimmed);
    } else {
      onReply?.(review._id, trimmed);
    }

    setReplying(false);
    setEditing(false);
  }

  return (
    <div className="border border-stone rounded-2xl p-4 bg-bg">
      {/* REVIEW HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text">
            {review.reviewer?.name ?? "Anonymous"}
          </p>

          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < review.rating ? "fill-brass text-brass" : "text-stone"
                }
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text/40">
            {review.createdAt
              ? new Date(review.createdAt).toLocaleDateString()
              : ""}
          </span>

          {isOwnReview && (
            <button
              type="button"
              onClick={() => onDelete?.(review._id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-text/40 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete your review"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* REVIEW COMMENT */}
      <p className="text-sm text-text/80 mt-3 leading-relaxed">
        {review.comment}
      </p>

      {/* EXISTING OWNER REPLY */}
      {hasReply && !editing && (
        <div className="mt-4 ml-3 sm:ml-5 border-l-2 border-brass pl-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-brass">
              {t("reviews.ownerReply", "Owner reply")}
            </p>

            {isOwner && (
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-1 text-xs text-text/50 hover:text-brass transition-colors"
              >
                <Pencil size={11} />
                Edit
              </button>
            )}
          </div>

          <p className="text-sm text-text/70 mt-1.5 leading-relaxed">
            {review.ownerReply.comment}
          </p>
        </div>
      )}

      {/* OWNER REPLY EDITOR */}
      {isOwner && (replying || editing) && (
        <div className="mt-4 rounded-xl border border-stone bg-ivory p-3">
          <textarea
            autoFocus
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            placeholder="Write your reply..."
            className="w-full resize-none bg-transparent border-0 outline-none text-sm text-text placeholder:text-text/35"
          />

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={cancelEditor}
              disabled={isReplying || isEditingReply}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-text/60 hover:bg-bg transition-colors"
            >
              <X size={12} />
              Cancel
            </button>

            <button
              type="button"
              onClick={submitReply}
              disabled={!replyText.trim() || isReplying || isEditingReply}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ink text-ivory text-xs font-medium disabled:opacity-50"
            >
              <Send size={12} />

              {isReplying || isEditingReply
                ? "Saving..."
                : editing
                  ? "Save reply"
                  : "Reply"}
            </button>
          </div>
        </div>
      )}

      {/* REPLY BUTTON */}
      {isOwner && !hasReply && !replying && !editing && (
        <button
          type="button"
          onClick={startReply}
          className="inline-flex items-center gap-1.5 text-xs text-brass font-medium mt-4 hover:text-ink transition-colors"
        >
          <Send size={12} />

          {t("reviews.reply", "Reply")}
        </button>
      )}
    </div>
  );
}
