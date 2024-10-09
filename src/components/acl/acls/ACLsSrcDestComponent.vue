<template>
  <q-card-section class="q-py-sm">
    <div class="text-h5 title-text">{{ title }}</div>
    <q-list separator bordered class="rounded-xl">
      <template v-for="(value, index) in values" :key="index">
        <q-item>
          <q-item-section>
            <span class="text-body1 text-info">{{ value }}</span>
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              color="negative"
              flat
              round
              dense
              icon="delete"
              @click="$emit('delete-item', index)"
            />
          </q-item-section>
        </q-item>
      </template>
      <AddACLComponent
        :is_src="title === 'Src'"
        v-if="show_add"
        :chips="chips"
        :options="options"
        @chip-changed="selected_option = $event"
        @send-value="handleSendEmit"
      />
    </q-list>
    <div class="row px-12px pt-8px justify-end">
      <q-btn
        flat
        round
        dense
        class="q-mr-xs q-mb-sm"
        :icon="!show_add ? 'add' : 'remove'"
        @click="show_add = !show_add"
      />
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { WithPrefix } from 'src/types/Database'
import AddACLComponent from './AddACLComponent.vue'

const props = defineProps<{
  title: string
  values: string[]
  initial_visibility: boolean
}>()

const emit = defineEmits<{
  'delete-item': [index: number]
  'send-value': [{ role: string; ports: string[] }]
}>()
const chips = [
  {
    label: 'Users',
    color: 'secondary',
  },
  {
    label: 'Groups',
    color: 'purple-13',
  },
  {
    label: 'Hosts',
    color: 'pink-13',
  },
  {
    label: 'Tag Owners',
    color: 'indigo-13',
  },
  {
    label: 'IP',
    color: 'amber-13',
  },
  {
    label: 'All',
    color: 'green-13',
  },
]
const { users } = storeToRefs(useUsersStore())

const selected_option = ref(chips[0].label)
const show_add = ref(props.initial_visibility)
const { tag_owners, groups, hosts } = storeToRefs(useAclsStore())
const options = computed(() => {
  if (selected_option.value === 'Users')
    return users.value.map((user) => user.name)
  else if (selected_option.value === 'Groups') return Object.keys(groups.value)
  else if (selected_option.value === 'Tag Owners')
    return Object.keys(tag_owners.value)
  else if (selected_option.value === 'Hosts') return Object.keys(hosts.value)
  return []
})

function handleSendEmit(payload: {
  role:
    | WithPrefix<'group:'>
    | WithPrefix<'tag:'>
    | WithPrefix<'autogroup:'>
    | string
  ports: string[]
}) {
  show_add.value = false
  emit('send-value', payload)
}
</script>
