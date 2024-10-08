<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="save">
      <q-card-section class="q-py-sm sticky top-0 bg-[#0c0a09] z-10">
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
              size="md"
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
            class="text-primary"
          >
            visit this page </a
          >.
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
      <ACLsSrcDestComponent
        :values="_acl.src"
        title="Src"
        :initial_visibility="initial_visibility"
        @delete-item="_acl.src.splice($event, 1)"
        @send-value="handleSrcEmitValue($event)"
      />
      <ACLsSrcDestComponent
        :values="_acl.dst"
        :initial_visibility="initial_visibility"
        title="Dst"
        @delete-item="_acl.dst.splice($event, 1)"
        @send-value="handleDstEmitValue($event)"
      />
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
import { ACL, WithPrefix } from 'src/types/Database'

import ACLsSrcDestComponent from './ACLsSrcDestComponent.vue'

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
const initial_visibility = ref(
  props.componentProps.acl.dst.length === 0 &&
    props.componentProps.acl.src.length === 0,
)
const show_src_add = ref(false)
const _acl = ref<ACL>(extend(true, {}, props.componentProps.acl))
const protocole_type_name = ref(true)
function handleSrcEmitValue(payload: {
  role:
    | WithPrefix<'group:'>
    | WithPrefix<'tag:'>
    | WithPrefix<'autogroup:'>
    | string
  ports: string[]
}) {
  const { role } = payload

  _acl.value.src.push(role)

  show_src_add.value = false
}

function handleDstEmitValue(payload: {
  role:
    | WithPrefix<'group:'>
    | WithPrefix<'tag:'>
    | WithPrefix<'autogroup:'>
    | string
  ports: string[]
}) {
  const { ports, role } = payload
  if (ports.length > 0) {
    _acl.value.dst.push(`${role}:${ports.join(',')}`)
  } else {
    _acl.value.dst.push(role)
  }
}

function save() {
  if (_acl.value.dst.length === 0 && _acl.value.src.length === 0) {
    useNotify(
      'Please enter a source or destination value to save',
      'warning',
      'negative',
    )
    return
  }
  props.onDialogOK(_acl.value)
}
</script>
