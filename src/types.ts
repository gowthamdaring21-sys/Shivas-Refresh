export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  bentoImage?: string;
  isSugarFree?: boolean;
  isPcodFriendly?: boolean;
  isMostOrdered?: boolean;
  isHighProtein?: boolean;
  isGymFriendly?: boolean;
  isDiabeticFriendly?: boolean;
  servingSize?: string;
  calories?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}
