import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
  Star,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyCardProps {
  property: Property;
  isFavourite?: boolean;
  onToggleFavourite?: (id: string) => void;
  onToggleLike?: (id: string) => void;
  isLike?: boolean;
  compact?: boolean;
}

export function PropertyCard({
  property,
  isFavourite,
  onToggleFavourite,
  onToggleLike,
  isLike,
  compact = false,
}: PropertyCardProps) {
  const {
    id,
    title,
    location,
    price,
    priceUnit,
    beds,
    baths,
    sqft,
    type,
    image,
    tags,
    isNew,
    isFeatured,
  } = property;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div
      className={cn(
        "group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300",
        "hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
        compact && "rounded-xl",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-zinc-100",
          compact ? "h-40" : "h-52",
        )}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex gap-1.5">
          {isNew && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 text-white text-[10px] font-semibold tracking-wide">
              <Sparkles className="w-2.5 h-2.5" /> NEW
            </span>
          )}
          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-[10px] font-semibold tracking-wide">
              <Star className="w-2.5 h-2.5 fill-amber-900" /> FEATURED
            </span>
          )}
        </div>

        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-zinc-700 text-[10px] font-semibold border border-zinc-200">
          {type}
        </span>

        <div className="flex gap-2 items-center absolute top-3 right-3">
          {isFavourite !== undefined && (
            <button
              title="Add to Favourites"
              onClick={() => onToggleFavourite?.(id)}
              aria-label={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                "shadow-sm border backdrop-blur-sm cursor-pointer",
                isFavourite
                  ? "bg-red-50 border-red-200 text-yellow-500 hover:bg-yellow-100"
                  : "bg-white/90 border-zinc-200 text-zinc-400 hover:text-yellow-400 hover:bg-red-50 hover:border-red-200",
              )}
            >
              <StarIcon
                className={cn(
                  "w-4 h-4 transition-all",
                  isFavourite && "fill-yellow-500",
                )}
              />
            </button>
          )}
          {isLike !== undefined && (
            <button
              title="Like a property"
              onClick={() => onToggleLike?.(id)}
              aria-label={
                isLike ? "Remove from favourites" : "Add to favourites"
              }
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
                "shadow-sm border backdrop-blur-sm",
                isLike
                  ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                  : "bg-white/90 border-zinc-200 text-zinc-400 hover:text-red-400 hover:bg-red-50 hover:border-red-200",
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all",
                  isLike && "fill-red-500",
                )}
              />
            </button>
          )}
        </div>
      </div>

      <div className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={cn(
              "font-semibold text-zinc-900 leading-tight",
              compact ? "text-sm" : "text-base",
            )}
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-zinc-500 mb-3">
          <MapPin className={cn(compact ? "w-2.5 h-2.5" : "w-3 h-3")} />
          <span className={cn("truncate", compact ? "text-[11px]" : "text-xs")}>
            {location}
          </span>
        </div>

        <div
          className={cn(
            "flex items-center gap-3 text-zinc-500 mb-3",
            compact ? "text-[11px]" : "text-xs",
          )}
        >
          <span className="flex items-center gap-1">
            <Bed className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
            {beds} {beds === 1 ? "bed" : "beds"}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="flex items-center gap-1">
            <Bath className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
            {baths} {baths === 1 ? "bath" : "baths"}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="flex items-center gap-1">
            <Maximize2 className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
            {sqft.toLocaleString()} ft²
          </span>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div>
            <span
              className={cn(
                "font-bold text-zinc-900",
                compact ? "text-base" : "text-lg",
              )}
            >
              {formattedPrice}
            </span>
            <span className="text-zinc-400 text-xs">/{priceUnit}</span>
          </div>
          {!compact && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs rounded-lg border-zinc-200 hover:bg-zinc-50"
            >
              View details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface PropertyCardSkeletonProps {
  compact?: boolean;
}

export function PropertyCardSkeleton({
  compact = false,
}: PropertyCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative bg-white border border-zinc-200 overflow-hidden",
        compact ? "rounded-xl" : "rounded-2xl",
      )}
    >
      <Skeleton
        className={cn("w-full bg-zinc-300", compact ? "h-40" : "h-52")}
      />

      <div className={cn(compact ? "p-3" : "p-4")}>
        <Skeleton
          className={cn(
            "mb-1 bg-zinc-200",
            compact ? "h-4 w-3/4" : "h-5 w-3/4",
          )}
        />

        <div className="flex items-center gap-1 mb-3">
          <Skeleton className="h-3 w-3 rounded-full bg-zinc-200" />
          <Skeleton
            className={cn("bg-zinc-200", compact ? "h-3 w-24" : "h-3 w-32")}
          />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-3 w-12 bg-zinc-200" />
          <Skeleton className="h-3 w-1 bg-zinc-200" />
          <Skeleton className="h-3 w-12 bg-zinc-200" />
          <Skeleton className="h-3 w-1 bg-zinc-200" />
          <Skeleton className="h-3 w-14 bg-zinc-200" />
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Skeleton className="h-5 w-16 rounded-full bg-zinc-200" />
            <Skeleton className="h-5 w-20 rounded-full bg-zinc-200" />
            <Skeleton className="h-5 w-14 rounded-full bg-zinc-200" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div className="flex items-baseline gap-1">
            <Skeleton
              className={cn("w-20 bg-zinc-200", compact ? "h-5" : "h-6")}
            />
            <Skeleton className="h-3 w-6 bg-zinc-200" />
          </div>
          {!compact && <Skeleton className="h-7 w-20 rounded-lg bg-zinc-200" />}
        </div>
      </div>
    </div>
  );
}
