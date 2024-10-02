//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { HeadscaleNode } from 'src/types/Database'
import { api } from 'boot/axios'

export const useNodesStore = defineStore('nodes', () => {
  async function getNodes(): Promise<HeadscaleNode[]> {
    const resp = await api.get('/node')
    console.log(resp.data)
    return resp.data.nodes
  }
  return { getNodes }
})
