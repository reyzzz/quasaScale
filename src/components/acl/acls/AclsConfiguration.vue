<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="save">
      <q-card-section class="q-py-sm sticky top-0 bg-stone-950 z-1">
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
        <div class="row justify-between q-mb-sm">
          <div class="text-info">Protocol Name</div>
          <label>
            <span class="text-info q-mr-xs"> Select from Protocol Names </span>
            <q-toggle
              v-model="protocole_type_name"
              dense
              @update:model-value="_acl.proto = ''"
              class="q-mr-sm"
            />
          </label>
        </div>

        <p class="text-body2">
          Please select a protocol from the list or enter the protocol number
          manually. For a complete list of protocol numbers, visit
          <a
            href="https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml"
            target="_blank"
            class="text-primary"
          >
            IANA Protocol Numbers </a
          >. For more information about ACLs,
          <a
            href="https://tailscale.com/kb/1337/acl-syntax"
            target="_blank"
            class="text-primary"
          >
            visit this page
          </a>
          . Leave protocol empty to allow all protocols.
        </p>

        <q-select
          v-if="protocole_type_name"
          label="Protocol"
          outlined
          v-model="_acl.proto"
          hide-hint
          hide-bottom-space
          :options="protocols"
        />
        <q-input
          v-else
          outlined
          hide-bottom-space
          v-model="_acl.proto"
          label="Protocol"
        />
      </q-card-section>
      <AclsSource v-model="_acl.src" />
      <AclsDestination v-model="_acl.dst" />
      <q-card-actions vertical>
        <q-btn
          color="primary"
          label="save"
          type="submit"
          icon="save"
          rounded
          outline
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script setup lang="ts">
import { extend } from 'quasar'
import { ACL } from 'src/types/Database'
import AclsDestination from './AclsDestination.vue'
import AclsSource from './AclsSource.vue'
defineOptions({ name: 'acls-dialog' })

const props = defineProps<{
  onDialogOK: (acl: ACL) => void
  componentProps: {
    acl: ACL
  }
}>()
const protocols = [
  '',
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

const _acl = ref<ACL>(extend(true, {}, props.componentProps.acl))
const protocole_type_name = ref(true)

function save() {
  console.log(_acl.value)
  if (_acl.value.dst.length === 0 || _acl.value.src.length === 0) {
    useNotify('Please enter a source and a destination', 'warning', 'negative')
    return
  }
  props.onDialogOK(_acl.value)
}
</script>
