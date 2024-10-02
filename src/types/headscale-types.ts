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
  givenName: string
  online: boolean
}
