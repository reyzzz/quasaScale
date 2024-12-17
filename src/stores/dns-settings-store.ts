import { extend, is } from 'quasar'
import { api } from 'src/boot/axios'
import { NamedResource } from 'src/types/Database'

export const useDnsSettingsStore = defineStore('dns-settings', () => {
  const { has_config_changed } = storeToRefs(useSettingsStore())
  const tailnetName = ref<string | null>(null)
  const is_edditing = ref(false)
  const is_magic_dns = ref(true)
  const override_local_dns = ref(false)

  const org_servers = ref<NamedResource[]>([])
  const servers = ref<NamedResource[]>([])
  const org_domains = ref<NamedResource[]>([])
  const domains = ref<NamedResource[]>([])

  const showServersSave = computed(() => {
    return !is.deepEqual(servers.value, org_servers.value)
  })

  const showDomainsSave = computed(() => {
    return !is.deepEqual(domains.value, org_domains.value)
  })
  async function handleTailnetName(): Promise<void> {
    if (is_edditing.value) {
      await updateTailnetName()
    }
    is_edditing.value = !is_edditing.value
  }

  function addServer(): void {
    servers.value.push({
      name: '',
      old: false,
    })
  }

  function addDomain(): void {
    domains.value.push({
      name: '',
      old: false,
    })
  }

  async function getDNSSettings(): Promise<void> {
    try {
      const resp = await api.get('/dns-settings')
      const dns_settings = resp.data.dns_settings
      tailnetName.value = dns_settings.tailnet_name
      org_servers.value = dns_settings.name_servers.map(
        (nameserver: string) => {
          return {
            name: nameserver,
            old: true,
          }
        },
      )

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
    } catch (error) {
      useNotify(
        'An error has occured while fetching DNS settings',
        'warning',
        'negative',
      )
    }
  }
  async function updateNameservers(): Promise<void> {
    try {
      const resp = await api.patch('/nameservers', {
        servers: servers.value.map((server) => server.name),
      })
      has_config_changed.value = true
      useNotify(resp.data.message, 'check')
      await getDNSSettings()
    } catch (error) {
      useNotify(
        'An error has occured while updating Nameservers',
        'warning',
        'negative',
      )
    }
  }
  async function updateDomains(): Promise<void> {
    try {
      const resp = await api.patch('/search-domains', {
        domains: domains.value.map((domain) => domain.name),
      })
      has_config_changed.value = true
      useNotify(resp.data.message, 'check')
      await getDNSSettings()
    } catch (error) {
      useNotify(
        'An error has occured while updating Search Domains',
        'warning',
        'negative',
      )
    }
  }

  async function updateTailnetName(): Promise<void> {
    try {
      const resp = await api.patch('/tailnet-name', {
        name: tailnetName.value,
      })
      has_config_changed.value = true
      useNotify(resp.data.message, 'check')
    } catch (error) {
      useNotify(
        'An error has occured while updating Tailname',
        'warning',
        'negative',
      )
    }
  }

  async function updateMagicDNS(): Promise<void> {
    try {
      const resp = await api.patch('/magic-dns', {
        magic_dns: is_magic_dns.value,
      })
      has_config_changed.value = true
      useNotify(resp.data.message, 'check')
    } catch (error) {
      useNotify(
        'An error has occured while updating Magic DNS',
        'warning',
        'negative',
      )
    }
  }

  async function updateOverrideLocalDNS(): Promise<void> {
    try {
      const resp = await api.patch('/override-local-dns', {
        override_local_dns: override_local_dns.value,
      })
      has_config_changed.value = true
      useNotify(resp.data.message, 'check')
    } catch (error) {
      useNotify(
        'An error has occured while updated override local dns',
        'warning',
        'negative',
      )
    }
  }
  function undoServersChanges(): void {
    servers.value = extend(true, [], org_servers.value)
  }

  function undoDomainsChanges(): void {
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
    updateMagicDNS,
    updateTailnetName,
    updateDomains,
    updateNameservers,
    handleTailnetName,
    addServer,

    addDomain,

    getDNSSettings,
    undoDomainsChanges,
    undoServersChanges,
  }
})
