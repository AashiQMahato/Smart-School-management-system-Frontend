/**
 * ErrorState
 * Something failed to load; offers a retry when one is provided.
 */

import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorState = ({
  title = "Couldn't load this",
  description = "Check your connection and try again.",
  onRetry,
}) => (
  <div className="ssd-empty ssd-tone--red" role="alert">
    <span className="ssd-empty__icon">
      <AlertTriangle size={20} aria-hidden="true" />
    </span>
    <b>{title}</b>
    {description && <p>{description}</p>}
    {onRetry && (
      <button
        type="button"
        className="ssd-btn ssd-btn--ghost mt-2"
        onClick={onRetry}>
        <RefreshCw size={15} aria-hidden="true" />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
