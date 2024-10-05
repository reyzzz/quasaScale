export interface User {
  id: string
  name: string
  createdAt: string
}

export interface QuasascaleNode {
  id?: string
  name: string
  last_seen: string
  ipv4: string
  ipv6: string
  user?: User
  machine_key: string
  forced_tags: string[]
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

export interface Group {
  name: string
  users: User[]
}

export interface Host {
  name: string
  IP_address: string
}

export interface TagOwner {
  name: string
  groups: Group[]
}

export interface IP {
  IPv4?: string
  IPv6?: string
}
