import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  X,
  Home,
  Building2,
  TreePine,
  Layers,
  CrownIcon,
} from "lucide-react";
import { PropertyCard, PropertyCardSkeleton } from "@/components/PropertyCard";
import type { Property, PropertyData } from "@/types/property";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/interceptor";
import { endpoints } from "@/config/endpoints";
import { parseAsString, parseAsInteger, useQueryState } from "nuqs";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import useFavLikeManager from "@/hooks/useFavLikeManager";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const PROPERTY_TYPES: Array<{
  label: string;
  value: Property["type"] | "All";
  icon: React.ReactNode;
}> = [
  { label: "All", value: "All", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  {
    label: "Apartment",
    value: "Apartment",
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  { label: "House", value: "House", icon: <Home className="w-3.5 h-3.5" /> },
  {
    label: "Villa",
    value: "Villa",
    icon: <TreePine className="w-3.5 h-3.5" />,
  },
  {
    label: "Studio",
    value: "Studio",
    icon: <Layers className="w-3.5 h-3.5" />,
  },
  {
    label: "Penthouse",
    value: "Penthouse",
    icon: <CrownIcon className="w-3.5 h-3.5" />,
  },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "new" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Size: Largest", value: "size" },
];

export default function PropertiesPage() {
  const [search, setSearch] = useQueryState(
    "title",
    parseAsString.withDefault(""),
  );
  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    parseAsString.withDefault("All"),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("new"),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(15000),
  );

  const [searchInput, setSearchInput] = useState(search);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  const [grid, setGrid] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 400);

  useEffect(() => {
    setSearch(debouncedSearch || null);
  }, [debouncedSearch]);

  useEffect(() => {
    setMaxPrice(debouncedMaxPrice);
  }, [debouncedMaxPrice]);
  const { params } = useSearchParamsManager();

  const { data: property, isLoading } = useQuery<BackendResponse<PropertyData>>(
    {
      queryKey: ["properties", params],
      queryFn: async () => {
        return await apiClient.get(endpoints.PROPERTIES, {
          params: { ...params },
        });
      },
    },
  );

  const { handleToggleFavourite, handleToggleLike, isLiked, isFavourited } =
    useFavLikeManager();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">
          Browse Properties
        </h1>
        <p className="text-sm text-zinc-500">
          Listings available across the Nepal
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search by name, city, or type…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-sm bg-zinc-50 border-zinc-200"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 px-3 text-xs border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-zinc-200 text-xs"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </Button>

          <div className="flex border border-zinc-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setGrid("grid")}
              className={`px-2.5 h-9 flex items-center transition-colors cursor-pointer ${grid === "grid" ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:bg-zinc-50"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGrid("list")}
              className={`px-2.5 h-9 flex items-center transition-colors cursor-pointer ${grid === "list" ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:bg-zinc-50"}`}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showFilters && (
          <>
            <Separator className="mb-4" />
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-500 mb-2">
                  Max price / month
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={500}
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(Number(e.target.value))}
                    className="flex-1 accent-zinc-900"
                  />
                  <span className="text-sm font-semibold text-zinc-900 min-w-[80px] text-right">
                    ${maxPriceInput.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() =>
                setTypeFilter(
                  t.value === "All" ? null : (t.value as Property["type"]),
                )
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                typeFilter === t.value
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-4">
        Showing{" "}
        <span className="font-semibold text-zinc-700">
          {property?.data?.properties.length || 0}
        </span>{" "}
        properties
      </p>

      {property?.data?.properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">🏚️</p>
          <p className="text-zinc-500 text-sm">
            No properties match your search.
          </p>
          <button
            onClick={() => {
              setSearchInput("");
              setSearch(null);
              setTypeFilter(null);
              setMaxPriceInput(15000);
              setMaxPrice(null);
            }}
            className="mt-3 text-xs text-zinc-700 underline underline-offset-2 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          className={
            grid === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          }
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <PropertyCardSkeleton key={index} compact={grid === "list"} />
              ))
            : property?.data?.properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavourite={isFavourited(property.id)}
                  isLike={isLiked(property.id)}
                  onToggleFavourite={handleToggleFavourite}
                  onToggleLike={handleToggleLike}
                  compact={grid === "list"}
                />
              ))}
        </div>
      )}
    </>
  );
}
