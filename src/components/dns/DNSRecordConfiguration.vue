<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="w-100% rounded-xl! bg-stone-950"
  >
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="text-h6">
            {{
              componentProps.dns.name.length > 0 ? 'Edit Domain' : 'Add Domain'
            }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col q-gutter-y-sm">
        <q-input
          outlined
          hide-bottom-space
          v-model="_dns.name"
          label="Name"
          :rules="[(val) => !!val || 'Field required']"
        />
        <q-select
          v-model="_dns.type"
          :options="dnsTypes"
          label="Type"
          outlined
          map-options
          emit-value
        />

        <q-input
          outlined
          hide-bottom-space
          v-model="_dns.value"
          label="Value"
          :rules="[
            (val) => !!val || 'Field required',
            (val) =>
              _dns.type === 'A'
                ? validateIPv4(val) || 'Wrong IPv4 format'
                : validateIPv6(val) || 'Wrong IPv6 format',
          ]"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          label="Save"
          color="primary"
          type="submit"
          outline
          rounded
          icon="save"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { extend } from 'quasar'
import { DNSRecord } from 'src/types/Database'

defineOptions({ name: 'dns-dialog' })
const props = defineProps<{
  onDialogOK: (payload: DNSRecord) => void
  componentProps: {
    dns: DNSRecord
    dnsRecords: DNSRecord[]
  }
}>()
const { validateIPv4, validateIPv6 } = useUtils()
const dnsTypes = ['A', 'AAAA']
const _dns = ref<DNSRecord>(extend(true, {}, props.componentProps.dns))

function saveChanges(): void {
  // let dns = props.componentProps.dnsRecords.find((dnsRecord) => {
  //   return (
  //     dnsRecord.name === _dns.value.name && dnsRecord.value !== _dns.value.value
  //   )
  // })
  // if (dns) {
  //   useNotify(
  //     'name already use for a different ip address',
  //     'warning',
  //     'negative',
  //   )
  //   return
  // }

  if (props.componentProps.dns.name !== _dns.value.name) {
    const dns = props.componentProps.dnsRecords.find((dnsRecord) => {
      return dnsRecord.name === _dns.value.name
    })
    if (dns) {
      useNotify('DNS name already used', 'warning', 'negative')
      return
    }
  }
  props.onDialogOK(_dns.value)
}
</script>
