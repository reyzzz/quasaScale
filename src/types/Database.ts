export interface User {
  id: number
  name: string
  creationDate: string
  pre_auth_keys: PreAuthKeys[]
}

export interface Node {
  id: number
  name: string
  node_last_seen: string
  IP_address_v4: string
  IP_address_v6: string
  assigned_user_id: number
  assigned_user_name?: string
  node_route: string
  tags: string[]
}

export interface Settings {
  headscale_url: string
  headscale_api_key: string
}
export interface PreAuthKeys {
  id: number
  key: string
  expiration_date: string
  reusable: boolean
  ephemeral: boolean
  used: boolean
}

export interface DNSRecord {
  name: string //unique
  type: string
  value: string
}

export interface HeadscaleInstance {
  id?: number
  headscale_url: string
  quasascale_backend_url?: string
  headscale_api_key: string
  active: boolean
}
