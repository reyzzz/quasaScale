<template>
  <q-page padding class="row justify-center">
    <div class="col-sm-12 col-md-5 column gap-8px">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div
            class="text-h6 q-mb-sm text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
          >
            Tailnet Name
          </div>
          <div class="text-info">
            This is the base domain name of your Tailnet. Nodes are accessible
            at
            <span class="text-primary text-bold">[node].[user].ts.net</span>
            when Magic DNS is enabled
          </div>
          <div class="row items-center q-mt-sm gap-3px justify-between">
            <q-input
              v-model="tailnetName"
              outlined
              class="q-mr-sm col-6"
              v-if="is_edditing"
            />
            <span v-else class="text-h6 text-[#d2d2d2]"
              >{{ tailnetName }}
            </span>
            <q-btn
              flat
              round
              @click="handleTailnetName()"
              :icon="is_edditing ? 'check' : 'edit'"
              :color="is_edditing ? 'positive' : 'primary'"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row justify-between">
            <div
              class="text-h6 q-mb-sm text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
            >
              Magic DNS
            </div>
            <q-toggle
              v-model="is_magic_dns"
              dense
              class="q-mb-sm"
              @update:model-value="updatedMagicDNS"
            />
          </div>
          <div class="text-info">
            Automatically register domain names for each node on the tailnet.
            Nodes will be accessible at
            <span class="text-primary text-bold">[node].[user].ts.net</span>
            when Magic DNS is enabled
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row justify-between">
            <div
              class="text-h6 q-mb-sm text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
            >
              Nameservers
            </div>
            <q-btn
              icon="save"
              flat
              round
              color="positive"
              v-if="showServersSave"
              @click="updateServers"
            />
          </div>

          <div class="text-info">
            Set the nameservers used by the nodes on the Tailnet to resolve DNS
            queries
          </div>
          <div class="row justify-between items-center">
            <div class="text-[#d2d2d2] text-bold">Global NameSevers</div>
            <div>
              <label>
                <span class="text-body2">Override Local DNS</span>
                <q-toggle
                  flat
                  v-model="override_local_dns"
                  @update:model-value="updateOverrideLocalDNS"
                />
              </label>
            </div>
          </div>
          <q-list bordered separator class="rounded-xl">
            <template v-for="(server, index) in servers" :key="index">
              <q-item>
                <q-item-section class="text-info text-body1">
                  <q-input
                    v-model="server.name"
                    borderless
                    v-if="!server.old"
                    dense
                    placeholder="Enter nameserver here"
                  />
                  <span v-else>
                    {{ server.name }}
                  </span></q-item-section
                >

                <q-btn
                  color="negative"
                  dense
                  class="absolute top-2 right-3"
                  size="md"
                  flat
                  icon="delete"
                  round
                  @click="deleteServer(index)"
                />
              </q-item>
            </template>
          </q-list>
          <div class="row q-mt-xs">
            <q-btn
              flat
              icon="add"
              class="q-ml-auto q-mr-sm"
              round
              @click="addServer"
            >
              <q-tooltip>Add Server</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row justify-between">
            <div
              class="text-h6 q-mb-sm text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
            >
              Search Domains
            </div>
            <q-btn
              flat
              round
              color="positive"
              v-if="showDomainsSave"
              @click="updateDomains"
              icon="save"
            />
          </div>

          <div class="text-info">
            Set custom DNS search domains for your Tailnet. When using Magic
            DNS, your tailnet domain is used as the first search domain
          </div>
          <q-list separator bordered class="rounded-xl q-mt-sm">
            <q-item>
              <q-item-section class="text-info text-body1">{{
                tailnetName
              }}</q-item-section>
              <q-item-section avatar>
                <q-icon name="lock" color="primary" />
              </q-item-section>
            </q-item>
            <template v-for="(domain, index) in domains" :key="index">
              <q-item>
                <q-item-section class="text-info text-body1">
                  <q-input
                    v-model="domain.name"
                    borderless
                    v-if="!domain.old"
                    dense
                    placeholder="Enter domain name here"
                  />
                  <span v-else>
                    {{ domain.name }}
                  </span></q-item-section
                >

                <q-btn
                  color="negative"
                  dense
                  class="absolute top-2 right-3"
                  size="md"
                  flat
                  icon="delete"
                  round
                  @click="removeDomain(index)"
                />
              </q-item>
            </template>
          </q-list>
          <div class="row">
            <q-btn
              flat
              round
              class="q-ml-auto q-mr-sm"
              icon="add"
              @click="addDomain"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
const {
  is_edditing,
  is_magic_dns,
  override_local_dns,
  tailnetName,
  servers,
  domains,
  org_servers,
  org_domains,
} = storeToRefs(useDomainSettingsStore())
const {
  handleTailnetName,
  deleteServer,
  addServer,
  addDomain,
  updateServers,
  updateDomains,
  removeDomain,
  getDNSSettings,
  updatedMagicDNS,
  updateOverrideLocalDNS,
} = useDomainSettingsStore()
const showServersSave = ref(false)
const showDomainsSave = ref(false)
onMounted(async () => {
  try {
    await getDNSSettings()
    showServersSave.value = false
    showDomainsSave.value = false
  } catch (error) {
    useNotify(
      'An error has occured while fetching the DNS settings',
      'warning',
      'negative',
    )
  }
})
watch(
  servers,
  (_, newVal) => {
    if (newVal.length !== org_servers.value.length) {
      showServersSave.value = true
    } else {
      showServersSave.value = false
    }
  },
  { deep: true },
)
watch(
  domains,
  (_, newVal) => {
    if (newVal.length !== org_domains.value.length) {
      showDomainsSave.value = true
    } else {
      showDomainsSave.value = false
    }
  },
  { deep: true },
)
</script>
