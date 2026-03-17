// components/customer/CartButton.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Minus, Plus, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCart, updateCartItem, removeFromCart } from "@/lib/actions/cart";

export default function CartButton({ productId, stock }) {
  const router = useRouter();

  const [state,   setState]   = useState("checking");
  const [qty,     setQty]     = useState(0);
  const [qtyBump, setQtyBump] = useState(false);

  // ── On mount: check if already in cart ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function checkCart() {
      try {
        const res = await fetch("/api/cart");

        // 401 → not logged in → show idle (not an error)
        if (res.status === 401) {
          if (!cancelled) setState("idle");
          return;
        }

        if (!res.ok) {
          if (!cancelled) setState("idle");
          return;
        }

        const { cart } = await res.json();
        const existing = cart?.items?.find(
          (i) => i.product?._id?.toString() === productId?.toString()
        );

        if (!cancelled) {
          if (existing) { setQty(existing.quantity); setState("stepper"); }
          else setState("idle");
        }
      } catch {
        if (!cancelled) setState("idle");
      }
    }

    checkCart();
    return () => { cancelled = true; };
  }, [productId]);

  const triggerBump = useCallback(() => {
    setQtyBump(true);
    setTimeout(() => setQtyBump(false), 300);
  }, []);

  // ── Add to cart ──────────────────────────────────────────────────────────
  async function handleAdd() {
    if (state !== "idle") return;
    setState("adding");

    try {
      await addToCart(productId, 1);
      setState("added");
      setQty(1);
      setTimeout(() => setState("stepper"), 900);
    } catch (err) {
      const msg = err.message || "Failed to add to cart";

      // Detect auth errors and show a friendly toast with a login action
      const isAuthError =
        msg.toLowerCase().includes("not authenticated") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("login") ||
        msg.toLowerCase().includes("sign in");

      if (isAuthError) {
        toast.error("Please log in to add items to your cart", {
          description: "You need an account to save items.",
          action: {
            label: "Log in",
            onClick: () => router.push("/login"),
          },
          duration: 5000,
        });
      } else {
        toast.error(msg);
      }

      setState("idle");
    }
  }

  // ── Increment ────────────────────────────────────────────────────────────
  async function handleIncrement() {
    if (state === "updating" || qty >= stock) return;
    const next = qty + 1;
    setState("updating");
    setQty(next);
    triggerBump();
    try {
      await updateCartItem(productId, next);
    } catch (err) {
      setQty(qty);
      toast.error(err.message || "Failed to update cart");
    } finally {
      setState("stepper");
    }
  }

  // ── Decrement / remove ───────────────────────────────────────────────────
  async function handleDecrement() {
    if (state === "updating") return;
    setState("updating");

    if (qty <= 1) {
      try {
        await removeFromCart(productId);
        setQty(0);
        setState("idle");
      } catch (err) {
        toast.error(err.message || "Failed to remove from cart");
        setState("stepper");
      }
    } else {
      const next = qty - 1;
      setQty(next);
      triggerBump();
      try {
        await updateCartItem(productId, next);
      } catch (err) {
        setQty(qty);
        toast.error(err.message || "Failed to update cart");
      } finally {
        setState("stepper");
      }
    }
  }

  // ── Checking skeleton ────────────────────────────────────────────────────
  if (state === "checking") {
    return <div className="w-full h-[42px] bg-gray-100 rounded-lg animate-pulse" />;
  }

  // ── Add / Adding / Added ─────────────────────────────────────────────────
  if (state === "idle" || state === "adding" || state === "added") {
    return (
      <button
        onClick={handleAdd}
        disabled={state !== "idle"}
        className={`
          w-full flex items-center justify-center gap-2
          px-3 py-2.5 rounded-lg font-semibold text-sm
          transition-all duration-300
          ${state === "added"
            ? "bg-green-600 text-white scale-[0.98]"
            : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white"}
          ${state === "adding" ? "opacity-80 cursor-not-allowed" : ""}
        `}
      >
        {state === "adding" && <Loader2 className="w-4 h-4 animate-spin" />}
        {state === "added"  && <Check   className="w-4 h-4" />}
        {state === "idle"   && <ShoppingCart className="w-4 h-4" />}
        <span>
          {state === "adding" && "Adding…"}
          {state === "added"  && "Added to Cart"}
          {state === "idle"   && "Add to Cart"}
        </span>
      </button>
    );
  }

  // ── Stepper (50/50 grid) ─────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 gap-2 w-full">

      {/* LEFT — qty stepper */}
      <div className="flex items-center border-2 border-orange-500 rounded-lg overflow-hidden">
        <button
          onClick={handleDecrement}
          disabled={state === "updating"}
          aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}
          className="flex items-center justify-center w-9 h-[38px]
                     text-orange-600 hover:bg-orange-50
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors flex-shrink-0"
        >
          <Minus size={15} strokeWidth={2.5} />
        </button>

        <span className={`
          flex-1 text-center text-sm font-bold text-gray-900 select-none
          transition-transform duration-200
          ${qtyBump ? "scale-125" : "scale-100"}
        `}>
          {state === "updating"
            ? <Loader2 className="w-3.5 h-3.5 animate-spin inline text-orange-500" />
            : qty
          }
        </span>

        <button
          onClick={handleIncrement}
          disabled={state === "updating" || qty >= stock}
          aria-label="Increase quantity"
          className="flex items-center justify-center w-9 h-[38px]
                     text-orange-600 hover:bg-orange-50
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors flex-shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* RIGHT — view cart */}
      <button
        onClick={() => router.push("/account?tab=cart")}
        className="flex items-center justify-center gap-1.5
                   bg-gray-900 hover:bg-gray-700 active:scale-[0.98]
                   text-white text-xs font-semibold rounded-lg
                   transition-all duration-150 whitespace-nowrap h-[42px]"
      >
        <ShoppingCart size={13} />
        View Cart
      </button>
    </div>
  );
}