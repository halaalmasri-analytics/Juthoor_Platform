import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

async function handleProductRecommendations(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const { buyerId, limit = 6 } = await req.json();

  const { data: preferences, error: prefError } = await supabase
    .from("buyer_preferences")
    .select("category_id, region_preference, price_range_min, price_range_max")
    .eq("buyer_id", buyerId)
    .single();

  if (prefError) {
    const { data: products } = await supabase
      .from("products")
      .select("*, artisans(*)")
      .eq("product_status", "active")
      .order("view_count", { ascending: false })
      .limit(limit);

    return new Response(JSON.stringify({ products: products || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let query = supabase
    .from("products")
    .select("*, artisans(*)")
    .eq("product_status", "active");

  if (preferences.category_id) {
    query = query.eq("category_id", preferences.category_id);
  }

  if (preferences.region_preference) {
    query = query.eq("artisans.region", preferences.region_preference);
  }

  if (preferences.price_range_min && preferences.price_range_max) {
    query = query
      .gte("price_usd", preferences.price_range_min)
      .lte("price_usd", preferences.price_range_max);
  }

  const { data: products, error: prodError } = await query
    .order("average_rating", { ascending: false })
    .limit(limit);

  if (prodError) {
    return new Response(JSON.stringify({ error: prodError.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ products: products || [] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleArtisanStats(artisanId: string) {
  const { data: products } = await supabase
    .from("products")
    .select("id, average_rating, total_reviews, view_count, price_usd")
    .eq("artisan_id", artisanId)
    .eq("product_status", "active");

  const { data: orders } = await supabase
    .from("order_items")
    .select("subtotal_usd, commission_percentage")
    .eq("artisan_id", artisanId);

  const totalProducts = products?.length || 0;
  const averageRating =
    products && products.length > 0
      ? (products.reduce((sum: number, p: any) => sum + p.average_rating, 0) /
          products.length).toFixed(2)
      : "0";
  const totalViews = products?.reduce((sum: number, p: any) => sum + p.view_count, 0) || 0;
  const totalSales = orders?.reduce((sum: number, o: any) => sum + o.subtotal_usd, 0) || 0;

  return new Response(
    JSON.stringify({
      totalProducts,
      averageRating,
      totalViews,
      totalSales,
      totalOrders: orders?.length || 0,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function handleOrderTracking(orderId: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      order_status,
      created_at,
      shipped_at,
      delivered_at,
      tracking_number,
      order_items(
        product_id,
        quantity,
        unit_price_usd,
        products(name_en, name_ar, name_fr)
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(order), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const { pathname } = new URL(req.url);

  try {
    if (pathname === "/juthoor-api/recommendations" && req.method === "POST") {
      return await handleProductRecommendations(req);
    }

    if (pathname.startsWith("/juthoor-api/artisan-stats/")) {
      const artisanId = pathname.split("/").pop();
      if (artisanId) {
        return await handleArtisanStats(artisanId);
      }
    }

    if (pathname.startsWith("/juthoor-api/order-tracking/")) {
      const orderId = pathname.split("/").pop();
      if (orderId) {
        return await handleOrderTracking(orderId);
      }
    }

    return new Response(JSON.stringify({ error: "Route not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
