import { extend, is } from 'quasar'
import { api } from 'src/boot/axios'

export const useDomainSettingsStore = defineStore('domain-settings', () => {
  const tailnetName = ref()
  const is_edditing = ref(false)
  const is_magic_dns = ref(true)
  const override_local_dns = ref(false)

  const org_servers = ref<{ name: string; old: boolean }[]>([])
  const servers = ref<{ name: string; old: boolean }[]>([])
  const org_domains = ref<{ name: string; old: boolean }[]>([])
  const domains = ref<{ name: string; old: boolean }[]>([])

  const showServersSave = computed(() => {
    return !is.deepEqual(servers.value, org_servers.value)
  })

  const showDomainsSave = computed(() => {
    return !is.deepEqual(domains.value, org_domains.value)
  })
  async function handleTailnetName() {
    if (is_edditing.value) {
      await updatedTailnetName()
    }
    is_edditing.value = !is_edditing.value
  }

  function addServer() {
    servers.value.push({
      name: '',
      old: false,
    })
  }
  function deleteServer(index: number) {
    servers.value.splice(index, 1)
  }

  function addDomain() {
    domains.value.push({
      name: '',
      old: false,
    })
  }
  function removeDomain(index: number) {
    domains.value.splice(index, 1)
  }

  async function getDNSSettings() {
    const resp = await api.get('/dns-settings')
    const dns_settings = resp.data.dns_settings
    tailnetName.value = dns_settings.tailnet_name
    org_servers.value = dns_settings.name_servers.map((nameserver: string) => {
      return {
        name: nameserver,
        old: true,
      }
    })

    servers.value = extend(true, [], org_servers.value)
    org_domains.value = dns_settings.search_domains.map(
      (search_domain: string) => {
        return {
          name: search_domain,
          old: true,
        }
      },
    )
    domains.value = extend(true, [], org_domains.value)
    is_magic_dns.value = dns_settings.is_magic_dns
    override_local_dns.value = dns_settings.override_local_dns
  }
  async function updateServers() {
    await api.patch('/servername', {
      servers: servers.value.map((server) => server.name),
    })
    useNotify('Nameservers updated successfully', 'check')
    await getDNSSettings()
  }
  async function updateDomains() {
    await api.patch('/search-domains', {
      domains: domains.value.map((domain) => domain.name),
    })
    useNotify('Search Domains updated successfully', 'check')
    await getDNSSettings()
  }

  async function updatedTailnetName() {
    await api.patch('/tailname', {
      name: tailnetName.value,
    })
  }

  async function updatedMagicDNS() {
    await api.patch('/magic-dns', {
      magic_dns: is_magic_dns.value,
    })
  }

  async function updateOverrideLocalDNS() {
    await api.patch('/override-local-dns', {
      override_local_dns: override_local_dns.value,
    })
  }
  function undoServersChanges() {
    servers.value = extend(true, [], org_servers.value)
  }

  function undoDomainsChanges() {
    domains.value = extend(true, [], org_domains.value)
  }
  return {
    tailnetName,
    is_edditing,
    is_magic_dns,
    override_local_dns,
    servers,
    domains,
    org_servers,
    org_domains,
    showServersSave,
    showDomainsSave,
    updateOverrideLocalDNS,
    updatedMagicDNS,
    updatedTailnetName,
    updateDomains,
    updateServers,
    handleTailnetName,
    addServer,
    deleteServer,
    addDomain,
    removeDomain,
    getDNSSettings,
    undoDomainsChanges,
    undoServersChanges,
  }
})
