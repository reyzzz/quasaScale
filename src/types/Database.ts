export interface User {
  id: number
  name: string
  creationDate: string
  pre_auth_keys: PreAuthKeys[]
}

export interface Device {
  id: number
  device_last_seen: string
  ip_address: string
  assigned_user: User
  device_route: string
  tags: string[]
}

export interface Settings {
  headscale_url: string
  headscale_api_key: string
}
interface PreAuthKeys {
  id: number
  key: string
  expiration_date: string
  reusable: boolean
  ephemeral: boolean
  used: boolean
}
