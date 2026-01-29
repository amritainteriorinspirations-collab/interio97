// app/api/cart/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { resolveCartPricing } from "@/lib/pricing/cartPricing";

export async function GET(req) {
  try {
    const authCookie = req.cookies.get("auth_token");
    if (!authCookie) {
      return NextResponse.json(
        { cart: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(authCookie.value);
    if (!payload) {
      return NextResponse.json(
        { cart: null, error: "Invalid token" },
        { status: 401 }
      );
    }

    await DbConnect();

    const cart = await Cart.findOne({
      userId: payload.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({
        cart: {
          items: [],
          totals: {
            totalOriginalPrice: 0,
            totalDiscount: 0,
            deliveryCharge: 399,
            grandTotal: 399,
          },
        },
      });
    }

    const products = await Product.find({
      _id: { $in: cart.items.map((i) => i.productId) },
    });

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    // 🔑 FULL product passed to pricing
    const items = cart.items
      .map((item) => {
        const product = productMap.get(item.productId.toString());
        if (!product) return null;

        return {
          product,
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    const resolvedCart = resolveCartPricing({
      items,
      role: payload.user.role,
    });

    // 🔑 Trim product only for response
    const sanitizedItems = resolvedCart.items.map((item) => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        images: item.product.images,
        stock: item.product.stock,
        sellBy: item.product.sellBy,
      },
      quantity: item.quantity,
      pricing: item.pricing,
    }));

    return NextResponse.json({
      cart: {
        items: sanitizedItems,
        totals: resolvedCart.totals,
      },
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
