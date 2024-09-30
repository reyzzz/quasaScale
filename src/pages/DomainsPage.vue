<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      :title="$q.screen.lt.sm ? 'DNS' : 'DNS Records'"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
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
          color="primary"
          outline
          :dense="$q.screen.lt.sm"
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
        <q-card flat bordered class="rounded-xl">
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
                      <q-item-section class="text-primary">
                        Edit DNS
                      </q-item-section>
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

            <div>
              <span class="text-weight-bold text-accent"> Type: </span>
              <span class="text-secondary">{{ props.row.type }} </span>
            </div>

            <div class="q-my-sm">
              <span class="text-weight-bold text-accent"> Value: </span>
              <span class="text-secondary">{{ props.row.value }} </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn, useQuasar } from 'quasar'
import DNSConfiguration from 'src/components/DNSConfiguration.vue'
import { DNSRecord } from 'src/types/Database'

const $q = useQuasar()
const { grid_view } = storeToRefs(useSettingsStore())
const cols = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Domain Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    required: true,
    label: 'Record Type',
    field: 'type',
    align: 'left',
  },
  {
    name: 'value',
    required: true,
    label: 'Tailnet IP Address',
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

function editDNS(dnsRecord: DNSRecord, index: number): void {
  useDialog()
    .show(DNSConfiguration, {
      dns: dnsRecord,
      dnsRecords: dnsRecords.value,
    })
    .onOk((updatedDNS: DNSRecord) => {
      dnsRecords.value[index] = updatedDNS
      useNotify('DNS updated successfully', 'check')
    })
}

function addDNS(): void {
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
      useNotify('DNS added successfully', 'check')
    })
}

function deleteDNS(index: number): void {
  useDialog()
    .del()
    .onOk(() => {
      dnsRecords.value = dnsRecords.value.filter((_, ind) => index !== ind)
      useNotify('DNS delete successfully', 'check')
    })
}
</script>
