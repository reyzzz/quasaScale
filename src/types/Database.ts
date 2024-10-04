export interface User {
  id: string
  name: string
  createdAt: string
}

export interface QuasascaleNode {
  id?: string
  name: string
  lastSeen: string
  IP_address_v4: string
  IP_address_v6: string
  user?: User
  user_id: string
  machine_key: string
  validTags: string[]
  online: boolean
}

export interface QuasascaleRoute {
  id: string
  prefix: string
  enabled: boolean
  type: 'Subnet' | 'Exit node'
  format: 'IPv4' | 'IPv6'
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

export interface QuasascaleInstance {
  id: number
  name: string
  quasascale_backend_url: string
  headscale_api_key: string
  active: boolean
}

export interface NamedResource {
  name: string
  old: boolean
}
