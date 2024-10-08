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

export interface RowGroup {
  name: WithPrefix<'group:'>
  users: string[]
}

export interface RowHost {
  name: string
  value: string
}

export interface RowTagOwner {
  name: WithPrefix<'tag:'>
  value: Array<string | Groups>
}

export type WithPrefix<T extends string> = `${T}${string}`

export interface Groups {
  [key: WithPrefix<'group:'>]: string[]
}

export interface TagOwners {
  [key: WithPrefix<'tag:'>]: string[]
}

export interface Hosts {
  [key: string]: string
}

export interface ACL {
  action: 'accept'
  proto?:
    | 'igmp'
    | 'ipv4'
    | 'ip-in-ip'
    | 'tcp'
    | 'egp'
    | 'igp'
    | 'udp'
    | 'gre'
    | 'esp'
    | 'ah'
    | 'sctp'
    | (string & {})
  src: (
    | WithPrefix<'group:'>
    | WithPrefix<'tag:'>
    | WithPrefix<'autogroup:'>
    | string
  )[]
  dst: (
    | WithPrefix<'group:'>
    | WithPrefix<'tag:'>
    | WithPrefix<'autogroup:'>
    | string
  )[]
}

export interface ACLConfig {
  groups: Groups
  tagOwners: TagOwners
  Hosts: Hosts
  acls: ACL[]
}

export interface IP {
  IPv4?: string
  IPv6?: string
}
