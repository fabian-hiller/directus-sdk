import type { Item, ItemKey, Json, Relation } from './item';

export type DirectusCollections = {
  directus_users: DirectusUserItem;
  directus_roles: DirectusRoleItem;
  directus_folders: DirectusFolderItem;
  directus_files: DirectusFileItem;
};

/**
 * Value type of the directus user item.
 */
export type DirectusUserItem = Item<{
  auth_data: Json<Record<string, any>>;
  avatar: Relation<DirectusFileItem> | null;
  description: string | null;
  email: string | null;
  email_notifications: boolean;
  external_identifier: string;
  first_name: string | null;
  id: ItemKey;
  language: string | null;
  last_access: string | null;
  last_name: string | null;
  last_page: string | null;
  location: string | null;
  password: string | null;
  provider: string;
  role: Relation<DirectusRoleItem> | null;
  status: string;
  tags: string[];
  theme: string;
  tfa_secret: string | null;
  title: string | null;
  token: string | null;
}>;

/**
 * Value type of the directus role item.
 */
declare type DirectusRoleItem = Item<{
  admin_access: boolean;
  app_access: boolean;
  description: string | null;
  enforce_tfa: boolean;
  icon: string;
  id: ItemKey;
  ip_access: string[] | null;
  name: string;
  users: Relation<DirectusUserItem>[];
}>;

/**
 * Value type of the directus file item.
 */
export type DirectusFileItem = Item<{
  charset: string | null;
  description: string | null;
  duration: number | null;
  embed: string | null;
  filename_disk: string;
  filename_download: string;
  filesize: string;
  folder: Relation<DirectusFolderItem> | null;
  height: number | null;
  id: ItemKey;
  location: string | null;
  metadata: Json<Record<string, any>>;
  modified_by: string;
  modified_on: string;
  storage: string;
  tags: string[];
  title: string;
  type: string;
  uploaded_by: Relation<DirectusUserItem>;
  uploaded_on: string;
  width: number | null;
}>;

/**
 * Value type of the directus folder item.
 */
export type DirectusFolderItem = Item<{
  id: string;
  name: string;
  parent: string;
}>;
