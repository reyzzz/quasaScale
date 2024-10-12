import { AxiosError } from 'axios'
import { extend } from 'quasar'
import { api } from 'src/boot/axios'
import { ACL, ACLConfig, Groups, Hosts, TagOwners } from 'src/types/Database'

export const useAclsStore = defineStore('acls', () => {
  const groups = ref<Groups>({})
  const hosts = ref<Hosts>({})
  const tag_owners = ref<TagOwners>({})
  const acls = ref<ACL[]>([])
  const acl_config = ref<ACLConfig>({
    groups: {},
    Hosts: {},
    tagOwners: {},
    acls: [],
  })

  async function getACL() {
    try {
      const resp = await api.get('/acls')
      acl_config.value = resp.data.acls
      assignVariables()
    } catch (error) {
      if (error instanceof AxiosError) {
        useNotify(error.response?.data, 'warning', 'negative')
        throw error
      }
    }
  }

  function assignVariables() {
    groups.value = extend(true, {}, acl_config.value.groups)
    tag_owners.value = extend(true, {}, acl_config.value.tagOwners)
    hosts.value = extend(true, {}, acl_config.value.Hosts)
    acls.value = extend(true, [], acl_config.value.acls)
  }

  async function updateACLs(data: Partial<ACLConfig>) {
    try {
      const resp = await api.patch('/acls', { data: data })
      acl_config.value = resp.data.acls
      assignVariables()
      useNotify('ACLs updated successfully', 'check')
    } catch (ex) {
      if (ex instanceof AxiosError)
        useNotify(ex.response?.data.message, 'warning', 'negative')
    }
  }

  return {
    groups,
    hosts,
    tag_owners,
    acls,
    acl_config,
    getACL,
    updateACLs,
    refreshVariables: assignVariables,
  }
})
