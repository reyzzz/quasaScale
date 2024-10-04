//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { QuasascaleNode, QuasascaleRoute } from 'src/types/Database'
import { api } from 'boot/axios'
import { HeadscaleNode, HeadscaleRoute } from 'src/types/headscale-types'

export const useNodesStore = defineStore('nodes', () => {
  async function getNodes(): Promise<QuasascaleNode[]> {
    const resp = await api.get('/node')
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
    await api.delete(`/node/${node.id}`)
  }

  async function createNode(node: QuasascaleNode): Promise<void> {
    const resp = await api.post(
      `/node/register?user=${node.user?.name}&key=mkey:${node.machine_key}`,
    )
    node.id = resp.data.node.id
    await renameNode(node)
    await updateTags(node)
  }

  async function updateIP(node: QuasascaleNode) {
    try {
      const resp = await api.patch(`/ip/${node.id}`, {
        IPv4: node.IP_address_v4,
        IPv6: node.IP_address_v6,
      })
      if (resp.data === 'IP updated successfully') useNotify(resp.data, 'check')
      else useNotify(resp.data, 'warning', 'negative')
    } catch (error) {
      useNotify('An error has occured while updating IP', 'warning', 'negative')
    }
  }

  async function getNodeRoutes(node_id: string): Promise<QuasascaleRoute[]> {
    const resp = await api.get(`/node/${node_id}/routes`)
    const routes = resp.data.routes as HeadscaleRoute[]
    return routes.map((route) => {
      const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}\/([0-9]|[1-2][0-9]|3[0-2])$/
      return {
        id: route.id,
        enabled: route.enabled,
        prefix: route.prefix,
        type:
          route.prefix === '0.0.0.0/0' || route.prefix === '::/0'
            ? 'Exit node'
            : 'Subnet',
        format: ipRegex.test(route.prefix) ? 'IPv4' : 'IPv6',
      }
    })
  }

  async function disableRoute(route_id: string): Promise<void> {
    await api.post(`/routes/${route_id}/disable`)
  }

  async function enableRoute(route_id: string): Promise<void> {
    await api.post(`/routes/${route_id}/enable`)
  }

  async function removeRoute(route_id: string): Promise<void> {
    await api.delete(`/routes/${route_id}`)
  }
  return {
    getNodes,
    renameNode,
    updateTags,
    changeUser,
    removeNode,
    createNode,
    getNodeRoutes,
    disableRoute,
    enableRoute,
    removeRoute,
    updateIP,
  }
})
