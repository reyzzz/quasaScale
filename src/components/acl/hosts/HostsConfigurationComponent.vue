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
        <q-input
          outlined
          hide-bottom-space
          v-model="_host.name"
          label="Host Name"
          :rules="[(val) => !!val || 'Field required']"
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
import { Host } from 'src/types/Database'
const { validateIPv4 } = useUtils()
const props = defineProps<{
  onDialogOK: (host: Host) => void
  componentProps: {
    host: Host
  }
}>()

const _host = ref<Host>(extend(true, {}, props.componentProps.host))

function save() {
  props.onDialogOK(_host.value)
}
</script>
