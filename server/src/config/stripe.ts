import Stripe from 'stripe';
import { ENV } from './env';

// Initialize Stripe SDK (uses fallback placeholder to prevent crash if env var is empty)
export const stripe = new Stripe(
  ENV.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_until_configured'
);

