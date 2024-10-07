<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form>
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{
              componentProps.acl.dst.length === 0 &&
              componentProps.acl.src.length === 0
                ? 'Add ACL'
                : 'Edit ACL'
            }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-select
          label="Protocols"
          outlined
          v-model="_acl.proto"
          use-chips
          multiple
          hide-hint
          hide-bottom-space
          :options="protocols"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h5 title-text">Src</div>
        <AddACLComponent
          v-if="show_src_add"
          :chips="chips"
          :options="options"
          @chip-changed="selected_option = $event"
        />
      </q-card-section>
    </q-form>
  </q-card>
</template>
<script setup lang="ts">
import { extend } from 'quasar'
import { ACL } from 'src/types/Database'
import AddACLComponent from './AddACLComponent.vue'

const props = defineProps<{
  onDialogOK: (acl: ACL) => void
  componentProps: {
    acl: ACL
  }
}>()
const protocols = [
  'igmp',
  'ipv4',
  'ip-in-ip',
  'tcp',
  'egp',
  'igp',
  'udp',
  'gre',
  'esp',
  'ah',
  'sctp',
]

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
    label: 'IP ',
    color: 'ampber-13',
  },
  {
    label: 'Tag Owners',
    color: 'indigo-13',
  },
  {
    label: 'all',
    color: 'red-13',
  },
]
const { users } = storeToRefs(useUsersStore())
const { groups, tag_owners } = storeToRefs(useAclsStore())
const selected_option = ref('Users')
const options = computed(() => {
  if (selected_option.value === 'Users')
    return users.value.map((user) => user.name)
  else if (selected_option.value === 'Groups') return Object.keys(groups.value)
  else if (selected_option.value === 'Tag Owners')
    return Object.keys(tag_owners.value)
  else if (selected_option.value === 'IP') return []
  else return null
})

const show_src_add = ref(false)
const _acl = ref<ACL>(extend(true, {}, props.componentProps.acl))
</script>
