import { Group, Host, TagOwner } from 'src/types/Database'

export const useAclsStore = defineStore('acls', () => {
  const groups = ref<Group[]>([
    {
      name: 'group1',
      users: [
        {
          id: '1',
          createdAt: '2024-05-25 05:29:56',
          name: 'test',
        },
      ],
    },
  ])
  const hosts = ref<Host[]>([
    {
      name: 'postgresql.internal',
      IP_address: '10.20.0.2/32',
    },
    {
      name: 'webservers.internal',
      IP_address: '10.20.10.1/29',
    },
  ])

  const tag_owners = ref<TagOwner[]>([
    {
      name: 'tag1',
      groups: [...groups.value],
    },
  ])
  return { groups, hosts, tag_owners }
})
