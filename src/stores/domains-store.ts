import { AxiosError } from 'axios'
import { api } from 'src/boot/axios'
import { DNSRecord } from 'src/types/Database'

export const useDomainsStore = defineStore('domains', () => {
  const dnsRecords = ref<DNSRecord[]>([])

  async function getDomains() {
    try {
      const data = await api.get('/domains')
      dnsRecords.value = data.data.domains
    } catch (error) {
      if (error instanceof AxiosError) {
        useNotify(error.response?.data, 'warning', 'negative')
      } else {
        useNotify(
          'An error happen while fetching domains',
          'warning',
          'negative',
        )
      }
    }
  }
  async function removeDomain(index: number) {
    try {
      await api.delete(`/domain/${index}`)
      dnsRecords.value = dnsRecords.value.filter((_, ind) => index !== ind)
      useNotify('DNS delete successfully', 'check')
    } catch (error) {
      if (error instanceof AxiosError) {
        useNotify(error.response?.data, 'warning', 'negative')
      } else {
        useNotify(
          'An error happen while deleting this domain',
          'warning',
          'negative',
        )
      }
    }
  }

  async function addDomain(DNS: DNSRecord) {
    try {
      await api.post('/domain', { domain: DNS })
      dnsRecords.value.push(DNS)
      useNotify('DNS added successfully', 'check')
    } catch (error) {
      if (error instanceof AxiosError) {
        useNotify(error.response?.data, 'warning', 'negative')
      } else {
        useNotify(
          'An error happen while adding this domain',
          'warning',
          'negative',
        )
      }
    }
  }

  async function updateDomain(index: number, updatedDNS: DNSRecord) {
    try {
      await api.patch(`/domain/${index}`, {
        domain: updatedDNS,
      })
      dnsRecords.value[index] = updatedDNS
      useNotify('DNS updated successfully', 'check')
    } catch (error) {
      if (error instanceof AxiosError) {
        useNotify(error.response?.data, 'warning', 'negative')
      } else {
        useNotify(
          'An error happen while updating this domain',
          'warning',
          'negative',
        )
      }
    }
  }

  return { dnsRecords, getDomains, removeDomain, addDomain, updateDomain }
})
