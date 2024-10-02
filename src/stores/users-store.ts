import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { PreAuthKeys, User } from 'src/types/Database'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  async function getUsers(): Promise<void> {
    const resp = await api.get('/user')

    users.value = await Promise.all(
      resp.data.users.map(async (user: Record<string, string>) => {
        return {
          ...user,
          createdAt: date.formatDate(user.createdAt, 'YYYY-MM-DD HH:mm:ss'),
          pre_auth_keys: [],
        }
      }),
    )
  }

  async function getuserPreAuthKeys(name: string) {
    const resp = await api.get(`/preauthkey?user=${name}`)
    const preauthkeys = resp.data.preAuthKeys.map(
      (preAthKey: Record<string, string>) => {
        return {
          ...preAthKey,
          expiration_date: new Date(preAthKey.expiration).toLocaleString(),
        }
      },
    )
    return preauthkeys
  }

  async function removeUser(name: string): Promise<void> {
    await api.delete(`/user/${name}`)
  }
  async function modifyUserName(
    oldName: string,
    newName: string,
  ): Promise<void> {
    await api.post(`/user/${oldName}/rename/${newName}`)
  }

  async function expirePreAuthKey(key: string, user: string) {
    await api.post('preauthkey/expire', {
      user: user,
      key: key,
    })
  }

  async function addPreAuthKey(preauthkey: PreAuthKeys, user: string) {
    const expiration = new Date(
      preauthkey.expiration_date.replace(' ', 'T') + 'Z',
    )
    const resp = await api.post('preauthkey', {
      user: user,
      reusable: preauthkey.reusable,
      ephemeral: preauthkey.ephemeral,
      expiration: expiration.toISOString(),
      aclTags: [],
    })
    return resp.data.preAuthKey
  }

  async function addNewUser(name: User) {
    const resp = await api.post('/user', {
      name: name,
    })
    return resp.data.user
  }
  return {
    users,
    getUsers,
    getuserPreAuthKeys,
    removeUser,
    addNewUser,
    modifyUserName,
    expirePreAuthKey,
    addPreAuthKey,
  }
})
