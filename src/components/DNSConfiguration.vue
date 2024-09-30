<template>
  <q-card flat bordered style="width: 500px">
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="text-h6">
            {{
              componentProps.dns.name.length > 0
                ? 'Update ' + _dns.name
                : 'Add DNS'
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
          label="DNS Name"
          :rules="[(val) => !!val || 'Field required']"
        />
        <q-select
          v-model="_dns.type"
          :options="dnsTypes"
          label="DNS Type"
          outlined
          map-options
          emit-value
        />

        <q-input
          outlined
          hide-bottom-space
          v-model="_dns.value"
          label="DNS Value"
          :rules="[
            (val) => !!val || 'Field required',
            (val) => validatedIp(val) || 'Wrong ip format',
          ]"
        />
      </q-card-section>
      <q-card-actions class="row justify-center">
        <q-btn
          :label="componentProps.dns.name.length > 0 ? 'Update' : 'Save'"
          color="green"
          type="submit"
          class="col-11"
          rounded
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
const dnsTypes = ['A', 'B', 'C', 'D']
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
function validatedIp(IP: string): boolean {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
  return ipRegex.test(IP)
}
</script>
