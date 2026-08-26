import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  className = '',
}) => {
  return (
    <div
      className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 shadow-xs ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
          <div>
            {title && <h4 className="text-sm font-bold text-red-900">{title}</h4>}
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{message}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2.5 inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 rounded text-xs font-semibold transition cursor-pointer"
              >
                🔄 Try Again
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="text-red-500 hover:text-red-800 text-lg leading-none cursor-pointer font-bold px-1"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};
