import Controller from "../decorators/controller.decorator.js";
import { Delete, Get, Post } from "../decorators/routes.decorator.js";
import { requireAuth } from "../middlewares/auth.js";
import type { Request, Response } from "express";
import PropertyService from "../services/property.service.js";
import NotFoundError from "../errors/notfound.error.js";

@Controller("/api/v1/properties", [requireAuth])
class PropertyController {
  @Get("")
  async getProperties(req: Request, res: Response) {
    const { title, tagName, type, minPrice, maxPrice, page, limit, sort } =
      req.query;

    const properties = await PropertyService.getAllProperties({
      title: title as string,
      tagName: tagName as string,
      type: type as string,
      ...(minPrice && { minPrice: Number(minPrice) }),
      ...(maxPrice && { maxPrice: Number(maxPrice) }),
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sort: sort as any,
    });

    return res.success(properties, "Properties fetched successfully");
  }

  @Get("/:id")
  async getProperty(req: Request, res: Response) {
    const property = await PropertyService.getPropertyById(
      req.params.id as string,
      req.user?.id,
    );

    if (!property) {
      throw new NotFoundError("Property not found");
    }

    return res.success(property, "Property fetched successfully");
  }

  @Post("/:id/like")
  async toggleLike(req: Request, res: Response) {
    const result = await PropertyService.toggleLike(
      req.user.id,
      req.params.id as string,
    );

    return res.success(
      result,
      result.liked ? "Property liked" : "Like removed",
    );
  }

  @Post("/:id/favourite")
  async toggleFavourite(req: Request, res: Response) {
    const result = await PropertyService.toggleFavourite(
      req.user.id,
      req.params.id as string,
    );

    return res.success(
      result,
      result.favourited
        ? "Property added to favourites"
        : "Removed from favourites",
    );
  }

  @Get("/me/favourites")
  async getUserFavourites(req: Request, res: Response) {
    const { page, limit } = req.query;

    const favourites = await PropertyService.getUserFavourites(
      req.user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );

    return res.success(favourites, "User favourites fetched successfully");
  }

  @Get("/me/likes")
  async getUserLikes(req: Request, res: Response) {
    const { page, limit } = req.query;
    const likes = await PropertyService.getUserLikes(
      req.user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );

    return res.success(likes, "User likes fetched successfully");
  }

  @Delete("/me/favourites")
  async clearAllFavourites(req: Request, res: Response) {
    const result = await PropertyService.clearAllFavourites(req.user.id);
    return res.success(result, "All favourites cleared successfully");
  }

  @Delete("/me/likes")
  async clearAllLikes(req: Request, res: Response) {
    const result = await PropertyService.clearAllLikes(req.user.id);
    return res.success(result, "All likes cleared successfully");
  }
}

export default PropertyController;
