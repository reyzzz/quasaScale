<template>
  <q-page>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey-3"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="dns-settings" label="DNS Settings" />
      <q-tab name="dns-records" label="DNS Records" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel class="p-8px sm:p-16px" name="dns-settings">
        <DnsSettings />
      </q-tab-panel>
      <q-tab-panel class="p-8px sm:p-16px" name="dns-records">
        <DnsRecords />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import DnsSettings from 'src/components/dns/DnsSettings.vue'
import DnsRecords from 'src/components/dns/DnsRecords.vue'
const tab = ref('dns-settings')
</script>
