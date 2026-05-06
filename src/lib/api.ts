// Supabase Edge Function API calls have been removed.
// These stubs are kept so any imports of this file don't break.

export async function getProductRecommendations(_buyerId: string, _limit: number = 6) {
  return { data: [], error: null };
}

export async function getArtisanStats(_artisanId: string) {
  return { data: null, error: null };
}

export async function trackOrder(_orderId: string) {
  return { data: null, error: null };
}
