<template>
  <q-card flat bordered class="rounded-xl">
    <q-card-section>
      <div class="text-h6 q-mb-sm title-text">Tailnet Name</div>
      <div class="text-info">
        This is the base domain name of your Tailnet. Nodes are accessible at
        <span class="text-primary text-bold">[node].ts.net</span>
        when Magic DNS is enabled
      </div>
      <div class="row items-center q-mt-sm gap-3px justify-between">
        <q-input
          v-model="tailnetName"
          outlined
          dense
          class="q-mr-sm col-grow"
          v-if="is_edditing"
        />
        <span v-else class="text-h6 text-[#d2d2d2]">{{ tailnetName }} </span>
        <q-btn
          flat
          round
          dense
          @click="handleTailnetName"
          :icon="is_edditing ? 'check' : 'edit'"
          :color="is_edditing ? 'positive' : 'secondary'"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const { handleTailnetName } = useDnsSettingsStore()
const { is_edditing, tailnetName } = storeToRefs(useDnsSettingsStore())
</script>
