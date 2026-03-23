"use client";

import { useState, useTransition } from "react";
import { PropertyCard } from "@umestay/ui/composite";
import { toggleFavorite } from "@/actions/favorites";
import type { PropertySummaryRow } from "@umestay/db";

interface FavItem {
  property_id: string;
  property: PropertySummaryRow;
}

interface FavoritesGridProps {
  items: FavItem[];
  locale: "zh" | "ja" | "en";
}

export function FavoritesGrid({ items, locale }: FavoritesGridProps) {
  const [optimistic, setOptimistic] = useState(items.map((i) => i.property_id));
  const [, startTransition] = useTransition();

  const handleToggle = (propertyId: string) => {
    // 乐观更新：立即从列表移除
    setOptimistic((prev) => prev.filter((id) => id !== propertyId));
    startTransition(async () => {
      try {
        await toggleFavorite(propertyId);
      } catch {
        // 失败时恢复
        setOptimistic((prev) => [...prev, propertyId]);
      }
    });
  };

  const visible = items.filter((i) => optimistic.includes(i.property_id));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {visible.map((item) => (
        <PropertyCard
          key={item.property_id}
          property={item.property}
          locale={locale}
          href={`/${locale}/properties/${item.property_id}`}
          isFaved
          onFavToggle={async (_faved, id) => handleToggle(id)}
        />
      ))}
    </div>
  );
}
