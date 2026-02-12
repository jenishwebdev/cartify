export interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  thumbnail?: string;
  images?: string[];
  [key: string]: unknown;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
