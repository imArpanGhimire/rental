export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`border border-stone bg-bg text-text rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}