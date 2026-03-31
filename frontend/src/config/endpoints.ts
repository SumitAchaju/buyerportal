export const endpoints = {
  PROPERTIES: "/properties",
  PROPERTY_LIKE: (id: string) => `/properties/${id}/like`,
  PROPERTY_FAVOURITE: (id: string) => `/properties/${id}/favourite`,
  USER_FAVOURITES: "/properties/me/favourites",
  USER_LIKES: "/properties/me/likes",
};
