<template>
  <div class="q-ma-sm" :class="$q.platform.is.desktop ? 'user-container' : ''">
    <template v-for="(user, index) in users" :key="index">
      <user-card
        :name="user.name"
        :creation_date="user.creationDate"
        :class="$q.platform.is.mobile ? 'q-my-sm' : ''"
        @update-name="updateName($event, user)"
        @delete-user="deleteUser(index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import UserCard from 'src/components/UserCard.vue'
import { User } from 'src/types/Database'
import { ref } from 'vue'
const users = ref<User[]>([
  {
    id: 1,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
  {
    id: 2,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
  {
    id: 3,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
  {
    id: 4,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
  {
    id: 5,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
  {
    id: 6,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
  {
    id: 7,
    name: 'test',
    creationDate: '01/3/2024 14:28:31',
    pre_auth_keys: [],
  },
])
function updateName(name: string, user: User) {
  user.name = name
}

function deleteUser(index: number) {
  users.value = users.value.filter((val, ind) => index !== ind)
}
</script>
