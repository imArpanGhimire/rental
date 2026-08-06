import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/Button.jsx";

export default function ReviewForm({ onSubmit, isSubmitting }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    onSubmit({ rating, comment }, { onSuccess: () => setComment("") && setRating(0) });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-stone rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)}>
            <Star size={20} className={n <= rating ? "fill-brass text-brass" : "text-stone"} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("reviews.placeholder", "Share your experience...")}
        rows={3}
        className="border border-stone rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brass resize-none bg-transparent"
      />
      <Button type="submit" disabled={isSubmitting || !rating || !comment.trim()} className="self-start">
        {isSubmitting ? t("reviews.posting", "Posting...") : t("reviews.submit", "Post review")}
      </Button>
    </form>
  );
}