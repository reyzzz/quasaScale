<template>
  <q-card flat bordered class="rounded-xl">
    <q-form @submit="updateNameservers">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6 q-mb-sm title-text">Nameservers</div>
          <div v-if="showServersSave">
            <q-btn
              icon="undo"
              flat
              round
              dense
              class="q-mr-md"
              color="secondary"
              @click="undoServersChanges"
            />
            <q-btn
              icon="save"
              flat
              dense
              round
              color="positive"
              type="submit"
            />
          </div>
        </div>

        <div class="text-info">
          Set the nameservers used by the nodes on the Tailnet to resolve DNS
          queries
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
                    (val) => validateIPv4(val) || 'wrong IPv4 format',
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
</template>

<script lang="ts" setup>
const { addServer, undoServersChanges, updateNameservers } =
  useDnsSettingsStore()
const { servers, showServersSave } = storeToRefs(useDnsSettingsStore())
const { validateIPv4 } = useUtils()
</script>
