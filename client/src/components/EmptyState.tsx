import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-12 px-6 bg-white rounded-lg border border-gray-200 shadow-sm space-y-3 max-w-lg mx-auto ${className}`}
    >
      <div className="text-4xl select-none">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {actionText && (actionHref || onAction) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              to={actionHref}
              className="inline-block bg-amazon-amber hover:bg-yellow-400 text-gray-900 px-5 py-2 rounded-full text-xs font-bold transition shadow-sm"
            >
              {actionText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-block bg-amazon-amber hover:bg-yellow-400 text-gray-900 px-5 py-2 rounded-full text-xs font-bold transition shadow-sm cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
