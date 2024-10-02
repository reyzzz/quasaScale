//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { QuasascaleNode } from 'src/types/Database'
import { api } from 'boot/axios'
import { HeadscaleNode } from 'src/types/headscale-types'

export const useNodesStore = defineStore('nodes', () => {
  async function getNodes(): Promise<QuasascaleNode[]> {
    const resp = await api.get('/node')
    console.log(resp.data.nodes)
    return resp.data.nodes.map((node: HeadscaleNode) => {
      const user = node.user
      return {
        ...node,
        name: node.givenName,
        lastSeen: new Date(node.lastSeen).toLocaleString(),
        IP_address_v4: Array.isArray(node.ipAddresses)
          ? node.ipAddresses[0]
          : '',
        IP_address_v6: Array.isArray(node.ipAddresses)
          ? node.ipAddresses[1]
          : '',
        user_id: user.id,
      }
    })
  }

  async function renameNode(node: QuasascaleNode): Promise<void> {
    await api.post(`/node/${node.id}/rename/${node.name}`)
  }

  async function updateTags(node: QuasascaleNode): Promise<void> {
    await api.post(`/node/${node.id}/tags`, {
      tags: node.validTags,
    })
  }

  async function changeUser(node: QuasascaleNode): Promise<void> {
    await api.post(`/node/${node.id}/user?user=${node.user?.name}`)
  }

  async function removeNode(node: QuasascaleNode): Promise<void> {
    await api.post(`/node/${node.id}`)
  }

  async function createNode(node: QuasascaleNode): Promise<void> {
    const resp = await api.post(
      `node/register?user=${node.user?.name}&key=mkey:${node.machine_key}`,
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
