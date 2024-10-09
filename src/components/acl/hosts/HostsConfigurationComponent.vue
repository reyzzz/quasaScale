<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="save">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{
              props.componentProps.host.name !== '' ? 'Edit Host' : 'Add Host'
            }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-sm">
        <p class="text-body2">
          Hosts should be defined using their IP addresses along with a subnet
          mask. To define a single host, use a <strong>/32</strong> mask. Avoid
          using DNS entries, as they are prone to hijacking by replacing IP
          addresses. For more information, see
          <a
            href="https://github.com/tailscale/tailscale/issues/3800"
            target="_blank"
            class="text-primary"
          >
            this link </a
          >.
        </p>

        <q-input
          outlined
          hide-bottom-space
          v-model="_host.name"
          label="Host Name"
          :rules="[
            (val) => !!val || 'Field required',
            () => checkHostName() || 'Host name already used',
          ]"
        />
        <q-input
          outlined
          hide-bottom-space
          v-model="_host.value"
          label="Host IP"
          :rules="[
            (val) => !!val || 'FIled required',
            (val) => validateIPv4(val) || 'Wrong IPv4 format',
          ]"
          lazy-rules="ondemand"
        />
      </q-card-section>
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

<script lang="ts" setup>
import { extend } from 'quasar'
import { Hosts } from 'src/types/Database'
const { validateIPv4 } = useUtils()
const props = defineProps<{
  onDialogOK: (host: Hosts) => void
  componentProps: {
    host: Hosts
    all_hosts: Hosts[]
  }
}>()

const _host = ref<Hosts>(extend(true, {}, props.componentProps.host))

function checkHostName() {
  const host = props.componentProps.all_hosts.find(
    (host) => host.name === _host.value.name,
  )
  if (host && props.componentProps.host.name !== _host.value.name) return false
  return true
}

function save() {
  props.onDialogOK(_host.value)
}
</script>
