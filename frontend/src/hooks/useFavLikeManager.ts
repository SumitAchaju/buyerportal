import showToast from "@/components/toast";
import { endpoints } from "@/config/endpoints";
import { apiClient } from "@/config/interceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Property } from "@/types/property";

function useFavLikeManager() {
  const handleToggleLike = (propertyId: string) => {
    handleLikeMutation.mutate(propertyId);
  };

  const handleToggleFavourite = (propertyId: string) => {
    handleFavMutation.mutate(propertyId);
  };

  const handleLikeMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      return await apiClient.post(endpoints.PROPERTY_LIKE(propertyId));
    },
    onSuccess: (data: any) => {
      showToast({
        title: data?.data?.liked ? "Liked" : "Removed Like",
        message: data?.data?.liked
          ? "Successfully liked the property"
          : "Successfully removed like from the property",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
    onError: (error: AxiosError<BackendResponse<any>>) => {
      showToast({
        title: "Error",
        message: error?.response?.data?.message || "Something went wrong",
        variant: "error",
      });
    },
  });
  const handleFavMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      return await apiClient.post(endpoints.PROPERTY_FAVOURITE(propertyId));
    },
    onSuccess: (data: any) => {
      showToast({
        title: data?.data?.favourited
          ? "Added to favourites"
          : "Removed from favourites",
        message: data?.data?.favourited
          ? "Successfully favourited the property"
          : "Successfully removed from favourites",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (error: AxiosError<BackendResponse<any>>) => {
      showToast({
        title: "Error",
        message: error?.response?.data?.message || "Something went wrong",
        variant: "error",
      });
    },
  });

  const clearAllFavourites = useMutation({
    mutationFn: async () => {
      return await apiClient.delete(endpoints.USER_FAVOURITES);
    },
    onSuccess: () => {
      showToast({
        title: "Cleared Favourites",
        message: "All favourites have been cleared successfully",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (error: AxiosError<BackendResponse<any>>) => {
      showToast({
        title: "Error",
        message: error?.response?.data?.message || "Something went wrong",
        variant: "error",
      });
    },
  });

  const clearAllLikes = useMutation({
    mutationFn: async () => {
      return await apiClient.delete(endpoints.USER_LIKES);
    },
    onSuccess: () => {
      showToast({
        title: "Cleared Likes",
        message: "All likes have been cleared successfully",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
    onError: (error: AxiosError<BackendResponse<any>>) => {
      showToast({
        title: "Error",
        message: error?.response?.data?.message || "Something went wrong",
        variant: "error",
      });
    },
  });

  const queryClient = useQueryClient();

  const { data: favourites, ...favRest } = useQuery<
    BackendResponse<{ favourites: Property[] }>
  >({
    queryKey: ["favourites"],
    queryFn: async () => {
      return await apiClient.get(endpoints.USER_FAVOURITES);
    },
  });

  const { data: likes, ...likeRest } = useQuery<
    BackendResponse<{ likes: Property[] }>
  >({
    queryKey: ["likes"],
    queryFn: async () => {
      return await apiClient.get(endpoints.USER_LIKES);
    },
  });

  const isLiked = (propertyId: string) => {
    return likes?.data?.likes.some((p) => p.id === propertyId) || false;
  };

  const isFavourited = (propertyId: string) => {
    return (
      favourites?.data?.favourites.some((p) => p.id === propertyId) || false
    );
  };

  return {
    handleToggleLike,
    handleToggleFavourite,
    isLiked,
    isFavourited,
    likes: { likes, ...likeRest },
    favourites: { favourites, ...favRest },
    clearAllFavourites,
    clearAllLikes,
  };
}

export default useFavLikeManager;
