<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="hostsArray"
    :columns="cols"
    row-key="name"
    :filter="filter"
    :pagination="{ rowsPerPage: 0 }"
    title="Hosts"
    flat
    bordered
    hide-pagination
  >
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Search"
        color="white"
        class="q-mr-xl"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        icon="add"
        :label="$q.screen.gt.sm ? 'New Host' : ''"
        color="primary"
        outline
        :dense="$q.screen.lt.sm"
        @click="addHost"
      />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>
          <span class="text-base">{{ props.row.name }}</span>
        </q-td>
        <q-td>
          <span class="text-base">{{ props.row.value }}</span>
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn
            flat
            round
            color="secondary"
            icon="edit"
            dense
            @click="editHost(props.row)"
          >
            <q-tooltip>Edit Host</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            dense
            @click="deleteHost(props.row)"
          >
            <q-tooltip>Delete Host</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <template #item="props">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row q-mb-sm justify-between">
            <div class="text-h6">
              {{ props.row.name }}
            </div>
            <div>
              <q-btn
                icon="edit"
                color="secondary"
                round
                flat
                dense
                @click="editHost(props.row)"
              >
                <q-tooltip>Edit Host</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                dense
                @click="deleteHost(props.row)"
              >
                <q-tooltip>Delete Host</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div>
            <span class="text-weight-bold text-accent">IP Address: </span>
            <span class="text-info">{{ props.row.value }}</span>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar'
import HostsConfigurationComponent from './HostsConfigurationComponent.vue'
import { Hosts, RowHost } from 'src/types/Database'

const { grid_view } = storeToRefs(useSettingsStore())
const { hosts, acl_config } = storeToRefs(useAclsStore())
const { updateACLs } = useAclsStore()
const { replacePatternInEntity, isPatternPresentInEntity } = useUtils()

const hostsArray = computed(() => {
  return Object.entries(hosts.value).map(([key, host]) => {
    return {
      name: key,
      value: host,
    }
  })
})

const cols = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'IP_address',
    required: true,
    label: 'IP Address',
    field: 'IP_address',
    align: 'left',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    field: 'actions',
    align: 'right',
  },
])
const filter = ref('')

function addHost() {
  useDialog()
    .show(HostsConfigurationComponent, {
      host: { name: '', IP_address: '' },
      all_hosts: hostsArray.value,
    })
    .onOk((host: RowHost) => {
      hosts.value[host.name] = host.value
      updateACLs({ Hosts: hosts.value })
    })
}

function editHost(host: Hosts) {
  useDialog()
    .show(HostsConfigurationComponent, {
      host: host,
      all_hosts: hostsArray.value,
    })
    .onOk(async (updatedHost: RowHost) => {
      acl_config.value = await replacePatternInEntity(
        host.name,
        updatedHost.name,
        JSON.stringify(acl_config.value),
      )
      updateACLs(acl_config.value)
    })
}

function deleteHost(host: RowHost) {
  useDialog()
    .del()
    .onOk(async () => {
      if (
        isPatternPresentInEntity(host.name, JSON.stringify(acl_config.value))
      ) {
        useNotify(
          'Unable to remove this Host as it is currently associated with ACLs ',
          'warning',
          'negative',
        )
        return
      }
      delete hosts.value[host.name]
      await updateACLs({ Hosts: hosts.value })
    })
}
</script>
