<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      title="Nodes"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
      :rows="nodes"
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
          @click="addNode"
          icon="add"
          :label="$q.screen.gt.sm ? 'New Node' : ''"
          color="primary"
          outline
          :dense="$q.screen.lt.sm"
        />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.id }}</q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.node_last_seen }}</q-td>
          <q-td>{{ props.row.IP_address_v4 }}</q-td>
          <q-td>{{ props.row.IP_address_v6 }}</q-td>
          <q-td>{{ props.row.assigned_user_name }}</q-td>
          <q-td>{{ props.row.node_route }}</q-td>
          <q-td
            ><template v-for="(tag, index) in props.row.tags" :key="index">
              <q-badge
                outline
                color="primary"
                :label="tag"
                class="q-mr-sm"
              /> </template
          ></q-td>
          <q-td key="actions" :props="props">
            <q-btn
              icon="edit"
              flat
              round
              color="secondary"
              dense
              class="q-ml-md"
              @click="editNode(props.row, props.rowIndex)"
            >
              <q-tooltip> Edit Node </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              flat
              round
              color="negative"
              dense
              class="q-ml-md"
              @click="deleteNode(props.rowIndex)"
            >
              <q-tooltip> Delete Node </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #item="props">
        <q-card flat bordered class="rounded-xl">
          <q-card-section class="q-pb-xs">
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-h6 row items-center col-10 gap-5px">
                {{ props.row.name }}

                <template v-for="(tag, index) in props.row.tags" :key="index">
                  <q-badge outline color="primary" :label="tag" />
                </template>
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list class="w-max">
                    <q-item
                      clickable
                      @click="editNode(props.row, props.rowIndex)"
                    >
                      <q-item-section class="text-primary">
                        Edit Node
                      </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item clickable @click="deleteNode(props.rowIndex)">
                      <q-item-section class="text-negative"
                        >Delete Node</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="row q-mb-sm">
              <div class="col-5">
                <span class="text-weight-bold text-accent"> User: </span>
                <span class="text-info"
                  >{{ props.row.assigned_user_name }}
                </span>
              </div>
              <div class="col-7">
                <span class="text-weight-bold text-accent"> Last Seen: </span>
                <span class="text-info">{{ props.row.node_last_seen }} </span>
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-5">
                <span class="text-weight-bold text-accent"> IPv4:</span>
                <span class="text-info">{{ props.row.IP_address_v4 }} </span>
              </div>
              <div class="col-7">
                <span class="text-weight-bold text-accent"> IPv6: </span>
                <span class="text-info">{{ props.row.IP_address_v6 }} </span>
              </div>
            </div>
            <div>
              <span class="text-weight-bold text-accent"> Route: </span>
              <span class="text-info">{{ props.row.node_route }} </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar'
import NodeConfiguration from 'src/components/NodeConfiguration.vue'
import { Node } from 'src/types/Database'

const filter = ref('')
const { grid_view } = storeToRefs(useSettingsStore())
const { users } = storeToRefs(useUsersStore())
const nodes = ref<Node[]>([
  {
    id: 1,
    name: 'device1',
    node_last_seen: '2024-09-27 17:24',
    IP_address_v4: '192.168.1.1',
    IP_address_v6: '2001:db8:85a3::8a2e:370:7334',
    assigned_user_id: 1,
    node_route: 'r',
    tags: ['test1', 'test2'],
  },
])
const cols = ref<QTableColumn[]>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    field: 'id',
    align: 'left',
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'node_last_seen',
    required: true,
    label: 'Node Last Seen',
    field: 'node_last_seen',
    align: 'left',
  },
  {
    name: 'IP_address_v4',
    required: true,
    label: 'IPv4',
    field: 'IP_address_v4',
    align: 'left',
  },
  {
    name: 'IP_address_v6',
    required: true,
    label: 'IPv6',
    field: 'IP_address_v6',
    align: 'left',
  },
  {
    name: 'assigned_user_name',
    required: true,
    label: 'Assigned User',
    field: 'assigned_user',
    align: 'left',
  },
  {
    name: 'node_route',
    required: true,
    label: 'Node Route',
    field: 'node_route',
    align: 'left',
  },
  {
    name: 'tags',
    required: true,
    label: 'Tags',
    field: 'tags',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'right',
  },
])

function editNode(node: Node, index: number): void {
  useDialog()
    .show(NodeConfiguration, {
      node: node,
    })
    .onOk((updatedNode: Node) => {
      nodes.value[index] = updatedNode
      useNotify('Node updated successfully', 'check')
    })
}
function addNode(): void {
  const node = {
    node_last_seen: '2024-09-27 17:24',
    IP_address: '',
    assigned_user_id: 1,
    node_route: '',
    tags: [],
  }
  useDialog()
    .show(NodeConfiguration, {
      node: node,
    })
    .onOk((updatedNode: Node) => {
      nodes.value.push(updatedNode)
      useNotify('Node added successfully', 'check')
    })
}

function deleteNode(index: number): void {
  useDialog()
    .del()
    .onOk(() => {
      nodes.value = nodes.value.filter((_, ind) => index !== ind)
      useNotify('Node delete successfully', 'check')
    })
}
onMounted(() => {
  nodes.value = nodes.value.map((node) => {
    const user = users.value.find((user) => {
      return user.id === node.assigned_user_id
    })
    if (!user) return node
    return {
      ...node,
      assigned_user_name: user.name,
    }
  })
})
</script>
