import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { ErrorMessage } from './ErrorMessage';
import type { Review, ReviewsResponse } from '../types';

interface ReviewsSectionProps {
  productId: string;
  ratingAvg?: number;
  numReviews?: number;
  onReviewAdded?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  ratingAvg = 0,
  numReviews = 0,
  onReviewAdded,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      setFetchError(null);
      const data = await apiGet<ReviewsResponse>(`/api/products/${productId}/reviews`);
      if (data && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFetchError(err.message);
      } else {
        setFetchError('Failed to load customer reviews');
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    if (!comment.trim()) {
      setSubmitError('Please write a review comment.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      await apiPost(`/api/products/${productId}/reviews`, {
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      setSubmitSuccess('Thank you! Your review has been submitted successfully.');
      setTitle('');
      setComment('');
      setRating(5);
      setShowForm(false);

      // Refresh reviews list
      await fetchReviews();

      // Notify parent to re-fetch product rating
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const ratingDescriptions: Record<number, string> = {
    1: '1 star - Poor',
    2: '2 stars - Fair',
    3: '3 stars - Average',
    4: '4 stars - Good',
    5: '5 stars - Excellent',
  };

  // Check if logged-in user already submitted a review
  const userHasReviewed =
    isAuthenticated &&
    user &&
    reviews.some((r) => {
      const reviewUserId = typeof r.user === 'object' ? r.user?._id : r.user;
      const currentUserId = user._id || user.id;
      return reviewUserId && currentUserId && reviewUserId === currentUserId;
    });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm space-y-6 sm:space-y-8 mt-6">
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Customer Reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Rating Summary & Write Review CTA */}
        <div className="md:col-span-4 space-y-5 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="flex items-center text-amber-500 text-lg sm:text-xl font-bold">
                {'★'.repeat(Math.round(ratingAvg))}
                {'☆'.repeat(5 - Math.round(ratingAvg))}
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900">
                {ratingAvg.toFixed(1)} out of 5
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {numReviews.toLocaleString()} global customer ratings
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3">
            <h3 className="text-base font-bold text-gray-900">Review this product</h3>
            <p className="text-xs text-gray-600">
              Share your thoughts with other customers
            </p>

            {userHasReviewed ? (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md">
                ✓ You have already reviewed this product.
              </div>
            ) : isAuthenticated ? (
              !showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-xs font-semibold text-gray-800 hover:bg-gray-50 transition shadow-sm cursor-pointer"
                >
                  Write a customer review
                </button>
              ) : null
            ) : (
              <Link
                to="/login"
                className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-xs font-semibold text-gray-800 hover:bg-gray-50 transition shadow-sm"
              >
                Sign in to write a review
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Review Submission Form or Reviews List */}
        <div className="md:col-span-8 space-y-6">
          {/* Submission Success Banner */}
          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-md flex items-center justify-between">
              <span>{submitSuccess}</span>
              <button
                onClick={() => setSubmitSuccess(null)}
                className="text-emerald-800 hover:text-emerald-950 font-bold ml-2 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          {/* Submission Form */}
          {showForm && !userHasReviewed && (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-sm font-bold text-gray-900">Create Review</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSubmitError(null);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {submitError && (
                <ErrorMessage
                  title="Could not submit review"
                  message={submitError}
                  onDismiss={() => setSubmitError(null)}
                />
              )}

              {/* Star Rating Picker */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Overall rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-2xl text-amber-500 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    >
                      {star <= (hoverRating || rating) ? '★' : '☆'}
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-1">
                <label htmlFor="review-title" className="block text-xs font-bold text-gray-700">
                  Add a headline (optional)
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's most important to know?"
                  maxLength={100}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label htmlFor="review-comment" className="block text-xs font-bold text-gray-700">
                  Add a written review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike? What did you use this product for?"
                  maxLength={1000}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:border-amber-500 resize-y"
                />
                <span className="text-[11px] text-gray-400 block text-right">
                  {comment.length}/1000 characters
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSubmitError(null);
                  }}
                  className="px-4 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer flex items-center space-x-1"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-gray-800" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Top Reviews from Customers
            </h3>

            {loading && (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2 border-b border-gray-100 pb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}

            {fetchError && !loading && (
              <ErrorMessage
                title="Could not load reviews"
                message={fetchError}
                onRetry={fetchReviews}
              />
            )}

            {!loading && !fetchError && reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500 space-y-2">
                <p className="text-sm">No customer reviews yet.</p>
                <p className="text-xs">Be the first to share your thoughts on this product!</p>
              </div>
            )}

            {!loading &&
              reviews.map((rev) => {
                const authorName =
                  typeof rev.user === 'object' && rev.user?.name
                    ? rev.user.name
                    : 'Amazon Customer';

                const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div key={rev._id} className="border-b border-gray-100 pb-5 space-y-2">
                    {/* User profile / Name */}
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold uppercase">
                        {authorName.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{authorName}</span>
                    </div>

                    {/* Star Rating and Title */}
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-500 text-sm font-bold tracking-tight">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                      {rev.title && (
                        <span className="text-xs font-bold text-gray-900">{rev.title}</span>
                      )}
                    </div>

                    {/* Review Date & Verified Purchase badge */}
                    <div className="text-[11px] text-gray-500 flex items-center space-x-2">
                      <span>Reviewed on {formattedDate}</span>
                      <span>|</span>
                      <span className="text-amber-800 font-semibold">Verified Purchase</span>
                    </div>

                    {/* Review comment */}
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line pt-1">
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
