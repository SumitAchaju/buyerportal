import { prisma } from "../lib/prisma.js";

interface PropertyFilters {
  title?: string;
  tagName?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  page?: number;
  limit?: number;
  sort?: SortOption;
}
type SortOption = "price_asc" | "price_desc" | "size" | "newest";
const SORT_MAP: Record<SortOption, object> = {
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  size: { sqft: "desc" },
  newest: { createdAt: "desc" },
};

class PropertyService {
  async getAllProperties(filters: PropertyFilters = {}) {
    const {
      title,
      tagName,
      minPrice,
      maxPrice,
      type,
      page = 1,
      limit = 10,
      sort = "newest",
    } = filters;

    const where = {
      ...(title && {
        title: { contains: title },
      }),
      ...(type && {
        type: { equals: type },
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(tagName && {
        tags: {
          some: {
            name: { contains: tagName },
          },
        },
      }),
    };
    const orderBy = SORT_MAP[sort] ?? SORT_MAP.newest;
    console.log(orderBy);
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          tags: true,
          _count: { select: { likes: true, favourites: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPropertyById(id: string, userId?: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        tags: true,
        _count: { select: { likes: true, favourites: true } },
      },
    });

    if (!property) return null;

    let isLiked = false;
    let isFavourited = false;

    if (userId) {
      const [like, favourite] = await Promise.all([
        prisma.like.findUnique({
          where: { userId_propertyId: { userId, propertyId: id } },
        }),
        prisma.favourite.findUnique({
          where: { userId_propertyId: { userId, propertyId: id } },
        }),
      ]);
      isLiked = !!like;
      isFavourited = !!favourite;
    }

    return { ...property, isLiked, isFavourited };
  }

  async toggleLike(userId: string, propertyId: string) {
    const existing = await prisma.like.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await prisma.like.create({ data: { userId, propertyId } });
    return { liked: true };
  }

  async toggleFavourite(userId: string, propertyId: string) {
    const existing = await prisma.favourite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      await prisma.favourite.delete({ where: { id: existing.id } });
      return { favourited: false };
    }

    await prisma.favourite.create({ data: { userId, propertyId } });
    return { favourited: true };
  }

  async getUserFavourites(userId: string, page = 1, limit = 10) {
    const [favourites, total] = await Promise.all([
      prisma.favourite.findMany({
        where: { userId },
        include: {
          property: {
            include: {
              tags: true,
              _count: { select: { likes: true, favourites: true } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.favourite.count({ where: { userId } }),
    ]);

    return {
      favourites: favourites.map((f) => f.property),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserLikes(userId: string, page = 1, limit = 10) {
    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { userId },
        include: {
          property: {
            include: {
              tags: true,
              _count: { select: { likes: true, favourites: true } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.like.count({ where: { userId } }),
    ]);

    return {
      likes: likes.map((l) => l.property),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async clearAllFavourites(userId: string) {
    const { count } = await prisma.favourite.deleteMany({ where: { userId } });
    return { cleared: count };
  }

  async clearAllLikes(userId: string) {
    const { count } = await prisma.like.deleteMany({ where: { userId } });
    return { cleared: count };
  }
}

export default new PropertyService();
