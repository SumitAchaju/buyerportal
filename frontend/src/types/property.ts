export interface PropertyData {
  properties: Property[];
  meta: PaginationMeta;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  image: string;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  _count: PropertyCount;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PropertyCount {
  likes: number;
  favourites: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
