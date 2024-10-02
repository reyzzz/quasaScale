//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { HeadscaleNode, User } from 'src/types/Database'
import { api } from 'boot/axios'
import { date } from 'quasar'

export const useNodesStore = defineStore('nodes', () => {
  async function getNodes(): Promise<HeadscaleNode[]> {
    const resp = await api.get('/node')
    return resp.data.nodes.map(
      (node: Record<string, string | string[] | User>) => {
        const user = node.user as User
        const nodeKey = node.nodeKey as string
        return {
          ...node,
          lastSeen: date.formatDate(
            node.lastSeen as string,
            'YYYY-MM-DD HH:mm:ss',
          ),
          IP_address_v4: Array.isArray(node.ipAddresses)
            ? node.ipAddresses[0]
            : '',
          IP_address_v6: Array.isArray(node.ipAddresses)
            ? node.ipAddresses[1]
            : '',
          node_route: nodeKey.split(':')[1],
          user_id: user.id,
        }
      },
    )
  }

  async function renameNode(node: HeadscaleNode): Promise<void> {
    await api.post(`/node/${node.id}/rename/${node.name}`)
  }

  async function updateTags(node: HeadscaleNode): Promise<void> {
    await api.post(`/node/${node.id}/tags`, {
      tags: node.validTags,
    })
  }

  async function changeUser(node: HeadscaleNode): Promise<void> {
    await api.post(`/node/${node.id}/user?user=${node.user?.name}`)
  }

  async function removeNode(node: HeadscaleNode): Promise<void> {
    await api.post(`/node/${node.id}`)
  }

  async function createNode(node: HeadscaleNode): Promise<void> {
    const resp = await api.post(
      `node/register?user=${node.user?.name}&key=nodekey:${node.node_route}`,
    )
    node.id = resp.data.node.id
    await renameNode(node)
    await updateTags(node)
  }
  return {
    getNodes,
    renameNode,
    updateTags,
    changeUser,
    removeNode,
    createNode,
  }
})
