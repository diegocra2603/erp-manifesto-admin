export interface ProductJobPosition {
  id: string;
  jobPositionId: string;
  jobPositionName: string;
  hours: number;
  hourlyCost: number;
  subtotal: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  jobPositions: ProductJobPosition[];
}

export interface ProductCreateRequest {
  name: string;
  description: string;
}

export interface ProductUpdateRequest {
  id: string;
  name: string;
  description: string;
}

export interface AddJobPositionToProductRequest {
  productId: string;
  jobPositionId: string;
  hours: number;
}
