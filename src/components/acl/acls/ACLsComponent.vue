<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="acls"
    :columns="cols"
    row-key="name"
    :filter="filter"
    :pagination="{ rowsPerPage: 0 }"
    title="ACLs"
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
        :label="$q.screen.gt.sm ? 'New ACL' : ''"
        color="primary"
        outline
        :dense="$q.screen.lt.sm"
      />
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td>{{ props.row.action }}</q-td>
        <q-td>{{ props.row.proto }}</q-td>
        <q-td>
          <template v-for="src in props.row.src" :key="src">
            <q-badge outline color="secondary" :label="src" class="q-mr-sm" />
          </template>
        </q-td>
        <q-td>
          <template v-for="dst in props.row.dst" :key="dst">
            <q-badge
              outline
              color="purple-13"
              :label="dst"
              class="q-mr-sm"
            /> </template
        ></q-td>
        <q-td key="actions" :props="props">
          <q-btn
            round
            flat
            color="secondary"
            icon="edit"
            @click="editACL(props.row, props.rowIndex)"
          >
            <q-tooltip>Edit ACL</q-tooltip>
          </q-btn>
          <q-btn
            round
            flat
            color="negative"
            icon="delete"
            @click="deleteACL(props.row, props.rowIndex)"
          >
            <q-tooltip>Delete ACL</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
    <template #item="props">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row q-mb-sm justify-between">
            <div class="text-h5 text-positive">
              {{ props.row.action }}
            </div>
            <div>
              <q-btn
                icon="edit"
                color="secondary"
                round
                flat
                dense
                @click="editACL(props.row, props.rowIndex)"
              >
                <q-tooltip>Edit ACL</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                dense
                @click="deleteACL(props.row, props.rowIndex)"
              >
                <q-tooltip>Delete ACL</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="q-mb-xs">
            <span class="text-body1 text-accent q-mr-sm">Protocol:</span>
            <span class="text-info">{{ props.row.proto }}</span>
          </div>
          <div class="q-mb-xs">
            <span class="text-body1 text-accent q-mr-sm">Source:</span>
            <template v-for="src in props.row.src" :key="src">
              <q-badge outline color="secondary" :label="src" class="q-mr-sm" />
            </template>
          </div>
          <div>
            <span class="text-body1 text-accent q-mr-xs">Destination:</span>
            <template v-for="dst in props.row.dst" :key="dst">
              <q-badge outline color="purple-13" :label="dst" class="q-mr-sm" />
            </template>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import { QTableColumn } from 'quasar'
import { ACL } from 'src/types/Database'
import ACLsConfiguration from './ACLsConfiguration.vue'

const { grid_view } = storeToRefs(useSettingsStore())
const { acls } = storeToRefs(useAclsStore())
const cols = ref<QTableColumn[]>([
  {
    name: 'action',
    required: true,
    label: 'Action',
    field: 'action',
    align: 'left',
  },
  {
    name: 'proto',
    required: true,
    label: 'Protocol',
    field: 'proto',
    align: 'left',
  },
  {
    name: 'src',
    required: true,
    label: 'Source',
    field: 'src',
    align: 'left',
  },
  {
    name: 'dst',
    required: true,
    label: 'Destination',
    field: 'dst',
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

async function editACL(acl: ACL, index: number) {
  useDialog().show(ACLsConfiguration, {
    acl: acl,
  })
}

async function deleteACL(acl: ACL, index: number) {}
</script>
