import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewDocument extends IReview, Document {}

export interface IReviewModel extends Model<IReviewDocument> {
  calcAverageRating(productId: Types.ObjectId | string): Promise<void>;
}

const reviewSchema = new Schema<IReviewDocument, IReviewModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: ensures each user can review a specific product only once
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Compound index: optimizes fetching newest reviews for a specific product
reviewSchema.index({ product: 1, createdAt: -1 });

// Static method to calculate aggregate rating and number of reviews using MongoDB Aggregation Pipeline
reviewSchema.statics.calcAverageRating = async function (
  productId: Types.ObjectId | string
): Promise<void> {
  const objectId =
    typeof productId === 'string'
      ? new mongoose.Types.ObjectId(productId)
      : productId;

  const stats = await this.aggregate([
    {
      $match: { product: objectId },
    },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        ratingAvg: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(objectId, {
      numReviews: stats[0].numReviews,
      ratingAvg: Math.round(stats[0].ratingAvg * 10) / 10, // Round to 1 decimal place (e.g. 4.3)
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(objectId, {
      numReviews: 0,
      ratingAvg: 0,
    });
  }
};

// Post-save hook to re-calculate average rating when a review is created or updated
reviewSchema.post('save', async function () {
  await (this.constructor as IReviewModel).calcAverageRating(this.product);
});

// Post-delete hook to re-calculate average rating when a review is deleted
reviewSchema.post('findOneAndDelete', async function (doc: IReviewDocument | null) {
  if (doc) {
    await (doc.constructor as unknown as IReviewModel).calcAverageRating(doc.product);
  }
});

export const Review: IReviewModel = mongoose.model<IReviewDocument, IReviewModel>(
  'Review',
  reviewSchema
);
export default Review;
