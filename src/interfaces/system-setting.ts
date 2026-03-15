export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export interface SystemSettingUpdateRequest {
  id: string;
  value: string;
}
