<template>
  <q-page padding class="row justify-center">
    <div class="col-sm-12 col-md-5 column gap-8px">
      <TailnetNameComponent />
      <MagicDNSComponent />
      <NameServersComponent />
      <SearchDomainsComponent />
    </div>
  </q-page>
</template>
<script setup lang="ts">
import MagicDNSComponent from 'src/components/dns-settings/MagicDNSComponent.vue'
import NameServersComponent from 'src/components/dns-settings/NameServersComponent.vue'
import SearchDomainsComponent from 'src/components/dns-settings/SearchDomainsComponent.vue'
import TailnetNameComponent from 'src/components/dns-settings/TailnetNameComponent.vue'

const { getDNSSettings } = useDnsSettingsStore()

onMounted(async () => {
  try {
    await getDNSSettings()
  } catch (error) {
    useNotify(
      'An error has occured while fetching the DNS settings',
      'warning',
      'negative',
    )
  }
})
</script>
