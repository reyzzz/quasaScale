import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { PreAuthKeys, User } from 'src/types/Database'
import { HeadscalePreAuthKey } from 'src/types/headscale-types'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  async function getUsers(): Promise<void> {
    const resp = await api.get('/user')
    users.value = resp.data.users
  }

  async function getuserPreAuthKeys(name: string) {
    const resp = await api.get(`/preauthkey?user=${name}`)
    const preauthkeys = resp.data.preAuthKeys.map(
      (preAthKey: Record<string, string>) => {
        return {
          ...preAthKey,
          expiration_date: new Date(preAthKey.expiration).toLocaleString(),
          acl_tags: preAthKey.aclTags,
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
    const expiration = new Date(preauthkey.expiration_date)
    const resp = await api.post('preauthkey', {
      user: user,
      reusable: preauthkey.reusable,
      ephemeral: preauthkey.ephemeral,
      expiration: expiration.toISOString(),
      aclTags: preauthkey.acl_tags,
    })
    return resp.data.preAuthKey as HeadscalePreAuthKey
  }

  async function addNewUser(username: string) {
    const resp = await api.post('/user', {
      name: username,
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
