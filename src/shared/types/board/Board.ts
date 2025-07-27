export interface Board {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  owner_name?: string;
  element_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  thumbnail_url?: string;
  is_starred?: boolean;
  is_pinned?: boolean;
} 