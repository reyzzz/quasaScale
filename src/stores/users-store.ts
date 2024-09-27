import { defineStore } from 'pinia'
import { User } from 'src/types/Database'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([
    {
      id: 1,
      name: 'test',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [],
    },
    {
      id: 2,
      name: 'test2',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [],
    },
    {
      id: 3,
      name: 'test3',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [],
    },
    {
      id: 4,
      name: 'test4',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [],
    },
    {
      id: 5,
      name: 'test5',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [],
    },
    {
      id: 6,
      name: 'test6',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [],
    },
    {
      id: 7,
      name: 'test7',
      creationDate: '01/3/2024 14:28:31',
      pre_auth_keys: [
        {
          id: 1,
          key: 'scasdcaddsc-sdcsdca',
          reusable: true,
          ephemeral: true,
          used: true,
          expiration_date: '01/3/2024 14:28:31',
        },
        {
          id: 2,
          key: 'scasdcaddsc-sdcsdca',
          reusable: false,
          ephemeral: true,
          used: true,
          expiration_date: '01/3/2024 14:28:31',
        },
        {
          id: 3,
          key: 'scasdcaddsc-sdcsdca',
          reusable: true,
          ephemeral: false,
          used: true,
          expiration_date: '01/3/2024 14:28:31',
        },
        {
          id: 4,
          key: 'scasdcaddsc-sdcsdca-ascadscasca-scac-asdcadsc',
          reusable: true,
          ephemeral: true,
          used: false,
          expiration_date: '01/3/2024 14:28:31',
        },
      ],
    },
  ])
  return { users }
})
