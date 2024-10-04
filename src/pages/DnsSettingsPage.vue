<template>
  <q-page padding class="row justify-center">
    <div class="col-sm-12 col-md-5 column gap-8px">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="text-h6 q-mb-sm title-text">Tailnet Name</div>
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
              dense
              class="q-mr-sm col-6"
              v-if="is_edditing"
            />
            <span v-else class="text-h6 text-[#d2d2d2]"
              >{{ tailnetName }}
            </span>
            <q-btn
              flat
              round
              dense
              @click="handleTailnetName"
              :icon="is_edditing ? 'check' : 'edit'"
              :color="is_edditing ? 'positive' : 'primary'"
            />
          </div>
        </q-card-section>
      </q-card>
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
            Automatically register domain names for each node on the tailnet.
            Nodes will be accessible at
            <span class="text-primary text-bold">[node].[user].ts.net</span>
            when Magic DNS is enabled
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="rounded-xl">
        <q-form @submit="updateNameservers">
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h6 q-mb-sm title-text">Nameservers</div>

              <div>
                <q-btn
                  icon="undo"
                  flat
                  round
                  dense
                  class="q-mr-md"
                  color="secondary"
                  v-if="showServersSave"
                  @click="undoServersChanges"
                />
                <q-btn
                  icon="save"
                  flat
                  dense
                  round
                  color="positive"
                  v-if="showServersSave"
                  type="submit"
                />
              </div>
            </div>

            <div class="text-info">
              Set the nameservers used by the nodes on the Tailnet to resolve
              DNS queries
            </div>
            <div class="row justify-between items-center">
              <div class="text-[#d2d2d2] text-bold">Global NameSevers</div>
              <div>
                <label>
                  <span
                    class="text-body2 q-mr-sm"
                    :class="{ 'text-primary': override_local_dns }"
                    >Override Local DNS</span
                  >
                  <q-toggle
                    dense
                    flat
                    class="q-mb-xs"
                    v-model="override_local_dns"
                    @update:model-value="updateOverrideLocalDNS"
                  />
                </label>
              </div>
            </div>
            <q-list bordered separator class="rounded-xl q-mt-xs">
              <template v-for="(server, index) in servers" :key="index">
                <q-item>
                  <q-item-section class="text-info text-body1">
                    <q-input
                      v-model="server.name"
                      borderless
                      v-if="!server.old"
                      dense
                      no-error-icon
                      hide-bottom-space
                      placeholder="Enter nameserver here"
                      :rules="[
                        (val) => !!val || 'Field required',
                        (val) => validatedIPv4(val) || 'wrong IPv4 format',
                      ]"
                    />
                    <span v-else>
                      {{ server.name }}
                    </span></q-item-section
                  >

                  <q-btn
                    color="negative"
                    dense
                    class="absolute top-2 right-3"
                    flat
                    icon="delete"
                    round
                    @click="servers.splice(index, 1)"
                  />
                </q-item>
              </template>
            </q-list>

            <div class="row justify-end px-12px pt-8px">
              <q-btn flat icon="add" dense round @click="addServer">
                <q-tooltip>Add Server</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-form>
      </q-card>

      <q-card flat bordered class="rounded-xl">
        <q-form @submit="updateDomains">
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h6 q-mb-sm title-text">Search Domains</div>
              <div>
                <q-btn
                  flat
                  round
                  dense
                  class="q-mr-md"
                  color="secondary"
                  v-if="showDomainsSave"
                  @click="undoDomainsChanges"
                  icon="undo"
                />
                <q-btn
                  flat
                  round
                  dense
                  color="positive"
                  v-if="showDomainsSave"
                  type="submit"
                  icon="save"
                />
              </div>
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
                      hide-bottom-space
                      no-error-icon
                      :rules="[(val) => !!val || 'Field required']"
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
                    @click="domains.splice(index, 1)"
                  />
                </q-item>
              </template>
            </q-list>
            <div class="row px-12px pt-8px justify-end">
              <q-btn flat round dense icon="add" @click="addDomain" />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
const { validatedIPv4 } = useUtils()
const {
  is_edditing,
  is_magic_dns,
  override_local_dns,
  tailnetName,
  servers,
  domains,
  showDomainsSave,
  showServersSave,
} = storeToRefs(useDnsSettingsStore())
const {
  handleTailnetName,
  addServer,
  addDomain,
  updateNameservers,
  updateDomains,
  getDNSSettings,
  updateMagicDNS,
  updateOverrideLocalDNS,
  undoDomainsChanges,
  undoServersChanges,
} = useDnsSettingsStore()

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
