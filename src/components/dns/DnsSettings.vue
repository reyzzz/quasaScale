<template>
  <q-page class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-md-6 col-lg-5 column gap-8px">
      <TailnetNameComponent />
      <MagicDNSComponent />
      <NameServersComponent />
      <SearchDomainsComponent />
    </div>
  </q-page>
</template>
<script setup lang="ts">
import MagicDNSComponent from 'src/components/dns/dns-settings/MagicDNSComponent.vue'
import NameServersComponent from 'src/components/dns/dns-settings/NameServersComponent.vue'
import SearchDomainsComponent from 'src/components/dns/dns-settings/SearchDomainsComponent.vue'
import TailnetNameComponent from 'src/components/dns/dns-settings/TailnetNameComponent.vue'

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
