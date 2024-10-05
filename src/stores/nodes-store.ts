//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { IP, QuasascaleNode, QuasascaleRoute } from 'src/types/Database'
import { api } from 'boot/axios'
import { HeadscaleNode, HeadscaleRoute } from 'src/types/headscale-types'
import { AxiosError } from 'axios'
const { validateIPv4, validateIPv6 } = useUtils()

export const useNodesStore = defineStore('nodes', () => {
  const { has_config_changed } = storeToRefs(useSettingsStore())

  async function getNodes(): Promise<QuasascaleNode[]> {
    const resp = await api.get('/node')
    return resp.data.nodes.map((node: HeadscaleNode) => {
      return {
        name: node.givenName,
        last_seen: new Date(node.lastSeen).toLocaleString(),
        ipv4:
          Array.isArray(node.ipAddresses) && validateIPv4(node.ipAddresses[0])
            ? node.ipAddresses[0]
            : '',
        ipv6:
          Array.isArray(node.ipAddresses) && validateIPv6(node.ipAddresses[1])
            ? node.ipAddresses[1]
            : '',
        online: node.online,
        machine_key: node.machineKey,
        forced_tags: node.forcedTags,
        id: node.id,
        user: node.user,
      } satisfies QuasascaleNode
    })
  }

  async function renameNode(node: QuasascaleNode): Promise<void> {
    try {
      await api.post(`/node/${node.id}/rename/${node.name}`)
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function updateTags(node: QuasascaleNode): Promise<void> {
    try {
      await api.post(`/node/${node.id}/tags`, {
        tags: node.forced_tags,
      })
      useNotify('Tags updated successfully', 'check')
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function changeUser(node: QuasascaleNode): Promise<void> {
    try {
      await api.post(`/node/${node.id}/user?user=${node.user?.name}`)
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function removeNode(node: QuasascaleNode): Promise<void> {
    try {
      await api.delete(`/node/${node.id}`)
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function createNode(node: QuasascaleNode): Promise<void> {
    try {
      const resp = await api.post(
        `/node/register?user=${node.user?.name}&key=mkey:${node.machine_key}`,
      )
      node.id = resp.data.node.id
      await renameNode(node)
      await updateTags(node)
      useNotify('Node created successfully', 'check')
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function updateIP(nodeId: string, ips: IP) {
    try {
      const resp = await api.patch(`/ip/${nodeId}`, {
        ...ips,
      })
      has_config_changed.value = true
      useNotify(resp.data.message, 'check')
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
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
    try {
      await api.post(`/routes/${route_id}/disable`)
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function enableRoute(route_id: string): Promise<void> {
    try {
      await api.post(`/routes/${route_id}/enable`)
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
  }

  async function removeRoute(route_id: string): Promise<void> {
    try {
      await api.delete(`/routes/${route_id}`)
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        useNotify(ex.response?.data.message, 'warning', 'negative')
        throw ex
      }
    }
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
