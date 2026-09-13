import { useState } from "react";
import { Star, Trash2, Send, X } from "lucide-react";

import { useTranslation } from "react-i18next";

export default function ReviewCard({
  review,
  isOwner,
  isOwnReview,
  onReply,
  onDelete,
  isReplying = false,
}) {
  const { t } = useTranslation();

  const [replyText, setReplyText] = useState("");

  const [replying, setReplying] = useState(false);

  const hasReply = Boolean(review.ownerReply?.comment);

  function startReply() {
    setReplyText("");
    setReplying(true);
  }

  function cancelReply() {
    setReplyText("");
    setReplying(false);
  }

  function submitReply() {
    const trimmed = replyText.trim();

    if (!trimmed) {
      return;
    }

    onReply?.(review._id, trimmed);

    setReplying(false);
    setReplyText("");
  }

  return (
    <div
      className="
        rounded-[20px]
        border border-stone
        bg-bg p-4
      "
    >
      {/* RENTER REVIEW */}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">
            {review.reviewer?.name ?? "Anonymous"}
          </p>

          <div className="mt-1 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Number(review.rating)
                    ? "fill-brass text-brass"
                    : "text-stone"
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
              className="
                flex h-7 w-7
                items-center
                justify-center
                rounded-full
                text-text/40
                transition-colors
                hover:bg-red-50
                hover:text-red-600
                dark:hover:bg-red-400/10
              "
              aria-label="Delete your review"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text/80">
        {review.comment}
      </p>

      {/* OWNER'S SINGLE RESPONSE */}

      {hasReply && (
        <div
          className="
            ml-3 mt-4
            rounded-r-xl
            border-l-2
            border-brass
            bg-ivory/35
            px-4 py-3
            sm:ml-5
            dark:bg-white/[0.025]
          "
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brass">
            {t("reviews.ownerReply", "Owner response")}
          </p>

          <p className="mt-1.5 text-sm leading-relaxed text-text/70">
            {review.ownerReply.comment}
          </p>

          {review.ownerReply?.repliedAt && (
            <p className="mt-2 text-[10px] text-text/35">
              Replied{" "}
              {new Date(review.ownerReply.repliedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* OWNER CAN REPLY ONLY WHEN NO REPLY EXISTS */}

      {isOwner && !hasReply && !replying && (
        <button
          type="button"
          onClick={startReply}
          className="
              mt-4 inline-flex
              items-center gap-1.5
              rounded-full
              border border-black/[0.08]
              bg-white/40
              px-3 py-2
              text-xs font-semibold
              text-[#2b2d31]/65
              transition-colors
              hover:bg-white/75
              hover:text-[#17191d]
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
              dark:text-white/60
              dark:hover:bg-white/[0.07]
              dark:hover:text-white
            "
        >
          <Send size={12} strokeWidth={1.9} />
          Reply to review
        </button>
      )}

      {isOwner && !hasReply && replying && (
        <div
          className="
              mt-4 rounded-[16px]
              border border-stone
              bg-ivory/60 p-3
              dark:bg-white/[0.025]
            "
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text/40">
            Owner response
          </p>

          <textarea
            autoFocus
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Write one response to this renter's review..."
            className="
                w-full resize-none
                bg-transparent
                text-sm text-text
                outline-none
                placeholder:text-text/35
              "
          />

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancelReply}
              disabled={isReplying}
              className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3 py-1.5
                  text-xs
                  font-medium
                  text-text/60
                  transition-colors
                  hover:bg-bg
                  disabled:opacity-50
                "
            >
              <X size={12} />
              Cancel
            </button>

            <button
              type="button"
              onClick={submitReply}
              disabled={!replyText.trim() || isReplying}
              className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-ink
                  px-4 py-1.5
                  text-xs
                  font-medium
                  text-ivory
                  disabled:opacity-50
                "
            >
              <Send size={12} />

              {isReplying ? "Replying..." : "Post response"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
