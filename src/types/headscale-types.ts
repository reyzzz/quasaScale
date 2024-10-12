import { User } from './Database'

export interface HeadscaleNode {
  id: string
  machineKey: string
  nodeKey: string
  discoKey: string
  ipAddresses: string[]
  name: string
  user: User
  lastSeen: string
  expiry: string
  createdAt: string
  registerMethod: string
  invalidTags: string[]
  validTags: string[]
  forcedTags: string[]
  givenName: string
  online: boolean
}

export interface HeadscaleRoute {
  id: string
  node: HeadscaleNode
  prefix: string
  advertised: boolean
  enabled: boolean
  isPrimary: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export interface HeadscalePreAuthKey {
  user: string
  id: string
  key: string
  reusable: boolean
  ephemeral: boolean
  used: boolean
  expiration: string
  createdAt: string
  aclTags: string[]
}
