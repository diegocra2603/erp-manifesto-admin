export interface JobPosition {
  id: string;
  name: string;
  description: string;
  hourlyCost: number;
}

export interface JobPositionCreateRequest {
  name: string;
  description: string;
  hourlyCost: number;
}

export interface JobPositionUpdateRequest {
  id: string;
  name: string;
  description: string;
  hourlyCost: number;
}
