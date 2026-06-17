export interface ContentBlock {
  id: string;
  page: string;
  key: string;
  label: string;
  type: string;
  value: string;
  sort_order: number;
  updated_at: string;
}

export interface ContentBlockInput {
  page: string;
  key: string;
  label: string;
  type: string;
  value: string;
}
