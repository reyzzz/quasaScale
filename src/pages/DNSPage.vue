<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      class="rounded-xl"
      :rows="dnsRecords"
      :columns="cols"
      row-key="name"
      :filter="filter"
      :pagination="{ rowsPerPage: 0 }"
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
          @click="addDNS"
          icon="add"
          :label="$q.screen.gt.sm ? 'New DNS' : ''"
          color="accent"
          outline
        />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.type }}</q-td>
          <q-td>{{ props.row.value }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn
              icon="edit"
              flat
              round
              color="blue-13"
              dense
              class="q-ml-md"
              @click="editDNS(props.row, props.rowIndex)"
            >
              <q-tooltip> Edit DNS </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              flat
              round
              color="negative"
              dense
              class="q-ml-md"
              @click="deleteDNS(props.rowIndex)"
            >
              <q-tooltip> Delete DNS </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #item="props">
        <q-card flat bordered class="rounded-borders q-mr-sm q-mb-sm user-card">
          <q-card-section class="q-pb-xs">
            <div class="row q-mb-sm justify-between">
              <div class="text-h5 row items-center">
                {{ props.row.name }}
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list style="width: max-content">
                    <q-item
                      clickable
                      @click="editDNS(props.row, props.rowIndex)"
                    >
                      <q-item-section class="text-blue-13"
                        >Edit DNS</q-item-section
                      >
                    </q-item>

                    <q-separator />
                    <q-item clickable @click="deleteDNS(props.rowIndex)">
                      <q-item-section class="text-negative"
                        >Delete DNS</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="text-weight-medium text-primary">
              Type:
              <span class="text-secondary">{{ props.row.type }} </span>
            </div>

            <div class="text-weight-medium text-primary q-my-sm">
              Value:
              <span class="text-secondary">{{ props.row.value }} </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
    <QitTitle title="DNS Records" />
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { QTableColumn, useQuasar } from 'quasar'
import DNSConfiguration from 'src/components/DNSConfiguration.vue'
import { useDialog } from 'src/composables/useDialog'
import { useNotify } from 'src/composables/useNorify'
import { useSettingsStore } from 'src/stores/settings-store'
import { DNSRecord } from 'src/types/Database'
import { ref } from 'vue'
const $q = useQuasar()
const { grid_view } = storeToRefs(useSettingsStore())
const cols = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    required: true,
    label: 'Type',
    field: 'type',
    align: 'left',
  },
  {
    name: 'value',
    required: true,
    label: 'Value',
    field: 'value',
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
const dnsRecords = ref<DNSRecord[]>([
  {
    name: 'google',
    type: 'A',
    value: '192.168.3.3',
  },
  {
    name: 'facebook',
    type: 'A',
    value: '192.168.3.4',
  },
  {
    name: 'instagram',
    type: 'A',
    value: '192.168.3.5',
  },
])

function editDNS(dnsRecord: DNSRecord, index: number) {
  useDialog()
    .show(DNSConfiguration, {
      dns: dnsRecord,
      dnsRecords: dnsRecords.value,
    })
    .onOk((updatedDNS: DNSRecord) => {
      dnsRecords.value[index] = updatedDNS
    })
}

function addDNS() {
  const dnsRecord: DNSRecord = {
    name: '',
    type: 'A',
    value: '',
  }
  useDialog()
    .show(DNSConfiguration, {
      dns: dnsRecord,
      dnsRecords: dnsRecords.value,
    })
    .onOk((updatedDNS: DNSRecord) => {
      dnsRecords.value.push(updatedDNS)
    })
}

function deleteDNS(index: number) {
  useDialog()
    .del()
    .onOk(() => {
      dnsRecords.value = dnsRecords.value.filter((_, ind) => index !== ind)
      useNotify('DNS delete successfully', 'check')
    })
}
</script>
