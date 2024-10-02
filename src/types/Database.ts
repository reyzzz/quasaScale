export interface User {
  id: string
  name: string
  createdAt: string
  pre_auth_keys: PreAuthKeys[]
}

export interface HeadscaleNode {
  id?: string
  name: string
  lastSeen: string
  IP_address_v4: string
  IP_address_v6: string
  user?: User
  user_id: string
  node_route: string
  validTags: string[]
}

export interface Settings {
  headscale_url: string
  headscale_api_key: string
}
export interface PreAuthKeys {
  id?: string
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
  id: number
  name: string
  quasascale_backend_url: string
  headscale_api_key: string
  active: boolean
}
