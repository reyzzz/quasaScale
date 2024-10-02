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
            (val) =>
              _dns.type === 'A'
                ? validatedIp(val) || 'Wrong IPv4 format'
                : validatedIPv6(val) || 'Wrong IPv6 format',
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
function validatedIp(IP: string): boolean {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
  return ipRegex.test(IP)
}
function validatedIPv6(IP: string): boolean {
  //Full IPv6 | compressed | mixed
  const ipRegex =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/

  return ipRegex.test(IP)
}
</script>
