import {
  ArrowRight,
  Heart,
  Home,
  LayoutGrid,
  Loader,
  Search,
  ShieldCheck,
  StarIcon,
  Trash2,
  User,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PropertyCard, PropertyCardSkeleton } from "@/components/PropertyCard";
import { Separator } from "@/components/ui/separator";
import { useSessionStore } from "@/store/auth-store";
import useFavLikeManager from "@/hooks/useFavLikeManager";

function DashboardPage() {
  const { user } = useSessionStore();

  const {
    handleToggleFavourite,
    favourites: { favourites, isLoading: favLoading },
    likes: { likes, isLoading: likesLoading },
    handleToggleLike,
    clearAllFavourites,
    clearAllLikes,
  } = useFavLikeManager();

  const likedProperties = likes?.data?.likes || [];

  const favProperties = favourites?.data?.favourites || [];

  return (
    <>
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white text-xl font-bold flex items-center justify-center">
              {user?.name?.[0] || "U"}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-zinc-900">{user?.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-semibold uppercase tracking-wide">
                Buyer
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">{user?.email}</p>
          </div>

          <Link to="/properties">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 border-zinc-200 hidden sm:flex"
            >
              Browse properties
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={StarIcon}
          label="Saved properties"
          value={favProperties.length}
          sub="across all types"
          accent="bg-red-50"
        />
        <StatCard
          icon={Heart}
          label="Liked properties"
          value={likedProperties.length}
          sub="accross all types"
          accent="bg-amber-50"
        />
        <StatCard
          icon={Home}
          label="Property types"
          value={
            new Set([
              ...favProperties.map((p) => p.type),
              ...likedProperties.map((p) => p.type),
            ]).size || "—"
          }
          sub="unique types saved"
          accent="bg-blue-50"
        />
        <StatCard
          icon={User}
          label="Account status"
          value="Active"
          sub="Verified buyer"
          accent="bg-emerald-50"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              My Favourites
              {favProperties.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-yellow-50 text-yellow-500 text-[10px] font-bold">
                  {favProperties.length}
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Properties you've saved — only visible to you
            </p>
          </div>
          {favProperties.length > 0 && (
            <Link to="/properties">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-zinc-200"
              >
                <LayoutGrid className="w-3 h-3" />
                Browse more
              </Button>
            </Link>
          )}
        </div>

        {favLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <PropertyCardSkeleton key={i} compact />
            ))}
          </div>
        ) : favProperties.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-700 mb-1">
              No saved properties yet
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              Browse listings and tap the star icon to save them here.
            </p>
            <Link to="/properties">
              <Button size="sm" className="h-8 text-xs gap-1.5">
                <Search className="w-3 h-3" />
                Browse properties
              </Button>
            </Link>
          </div>
        ) : favProperties.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-zinc-500">No results for favourites</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favProperties.map((property) => (
              <div key={property.id} className="relative group/card">
                <PropertyCard
                  key={property.id}
                  property={property}
                  compact
                  isFavourite
                  onToggleFavourite={handleToggleFavourite}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {favProperties.length > 0 && (
        <>
          <Separator />
          <div className="pb-4">
            <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-widest">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/properties">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 border-zinc-200"
                >
                  <Home className="w-3 h-3" /> Browse all listings
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-zinc-200 text-red-500 hover:text-red-600 hover:border-red-200"
                onClick={() => clearAllFavourites.mutate()}
              >
                {clearAllFavourites.isPending ? (
                  <Loader className="animate-spin w-3 h-3" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}{" "}
                Clear all favourites
              </Button>
            </div>
          </div>
        </>
      )}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              My Likes
              {likedProperties.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">
                  {likedProperties.length}
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Properties you've liked — only visible to you
            </p>
          </div>
          {likedProperties.length > 0 && (
            <Link to="/properties">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-zinc-200"
              >
                <LayoutGrid className="w-3 h-3" />
                Browse more
              </Button>
            </Link>
          )}
        </div>

        {likesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <PropertyCardSkeleton key={i} compact />
            ))}
          </div>
        ) : likedProperties.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-700 mb-1">
              No liked properties yet
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              Browse listings and tap the heart icon to like them here.
            </p>
            <Link to="/properties">
              <Button size="sm" className="h-8 text-xs gap-1.5">
                <Search className="w-3 h-3" />
                Browse properties
              </Button>
            </Link>
          </div>
        ) : likedProperties.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-zinc-500">No results for likes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {likedProperties.map((property) => (
              <div key={property.id} className="relative group/card">
                <PropertyCard
                  key={property.id}
                  property={property}
                  compact
                  isLike
                  onToggleLike={handleToggleLike}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {likedProperties.length > 0 && (
        <>
          <Separator />
          <div className="pb-4">
            <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-widest">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/properties">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 border-zinc-200"
                >
                  <Home className="w-3 h-3" /> Browse all listings
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-zinc-200 text-red-500 hover:text-red-600 hover:border-red-200"
                onClick={() => clearAllLikes.mutate()}
              >
                {clearAllLikes.isPending ? (
                  <Loader className="animate-spin w-3 h-3" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}{" "}
                Clear all Likes
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardPage;

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent ?? "bg-zinc-100"}`}
      >
        <Icon className="w-4 h-4 text-zinc-700" />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-zinc-900 leading-none">{value}</p>
        {sub && <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
