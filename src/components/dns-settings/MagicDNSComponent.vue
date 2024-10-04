<template>
  <q-card flat bordered class="rounded-xl">
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6 q-mb-sm title-text">Magic DNS</div>
        <q-toggle
          v-model="is_magic_dns"
          dense
          class="q-mb-sm"
          @update:model-value="updateMagicDNS"
        />
      </div>
      <div class="text-info">
        Automatically register domain names for each node on the tailnet. Nodes
        will be accessible at
        <span class="text-primary text-bold">[node].[user].ts.net</span>
        when Magic DNS is enabled
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
const { updateMagicDNS } = useDnsSettingsStore()
const { is_magic_dns } = storeToRefs(useDnsSettingsStore())
</script>
