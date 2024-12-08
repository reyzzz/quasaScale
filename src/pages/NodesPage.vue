<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      title="Nodes"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="title-text"
      :rows="nodes"
      :columns="cols"
      row-key="name"
      :filter="filter"
      :pagination="{ rowsPerPage: 0 }"
      flat
      bordered
      hide-pagination
      binary-state-sort
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
      <template #header-cell-id="props">
        <q-th auto-width :props="props">
          <q-toggle
            v-model="online"
            @update:model-value="showOnlineOnly"
            dense
            class="q-mr-sm"
            color="positive"
            size="xs"
          />
          <span @click="props.sort">ID</span>
        </q-th>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>
            <div class="row no-wrap items-center gap-10px">
              <animated-circle :is_positive="props.row.online" />
              {{ props.row.id }}
            </div>
          </q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ new Date(props.row.last_seen).toLocaleString() }}</q-td>
          <q-td>{{ props.row.ipv4 }}</q-td>
          <q-td>{{ props.row.ipv6 }}</q-td>
          <q-td>{{ props.row.user.name }}</q-td>
          <q-td
            ><template v-for="tag in props.row.forced_tags" :key="tag">
              <q-badge
                outline
                color="primary"
                :label="formatTag(tag)"
                class="q-mr-sm"
              /> </template
          ></q-td>
          <q-td key="actions" :props="props">
            <div class="row gap-3px justify-end">
              <q-btn
                icon="route"
                flat
                round
                color="green"
                dense
                v-if="props.row.routes > 0"
                @click="manageRoutes(props.row)"
              >
                <q-tooltip> Manage Routes </q-tooltip>
              </q-btn>
              <q-btn
                icon="edit"
                flat
                round
                color="secondary"
                dense
                @click="editNode(props.row, props.rowIndex)"
              >
                <q-tooltip> Edit Node </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                color="warning"
                icon="timer_off"
                @click="expireNode(props.row)"
              >
                <q-tooltip> Expire Node </q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                flat
                round
                color="negative"
                dense
                @click="removeNode(props.row, props.rowIndex)"
              >
                <q-tooltip> Delete Node </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
      <template #item="props">
        <q-card flat bordered class="rounded-xl">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-h6 col-grow row items-center">
                <div class="row items-center gap-6px">
                  <animated-circle :is_positive="props.row.online" />
                  <div>{{ props.row.name }}</div>
                </div>

                <template v-for="tag in props.row.forced_tags" :key="tag">
                  <q-badge
                    outline
                    color="primary"
                    :label="formatTag(tag)"
                    class="q-ml-xs"
                  />
                </template>
              </div>
              <div class="row gap-2px">
                <q-btn
                  flat
                  round
                  dense
                  color="secondary"
                  icon="edit"
                  @click="editNode(props.row, props.rowIndex)"
                >
                  <q-tooltip> Edit Node </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="warning"
                  icon="timer_off"
                  @click="expireNode(props.row)"
                >
                  <q-tooltip> Expire Node </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  @click="removeNode(props.row, props.rowIndex)"
                >
                  <q-tooltip> Delete Node </q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row justify-between">
              <div class="column gap-5px">
                <div>
                  <span class="text-weight-bold text-accent"> User: </span>
                  <span class="text-info">{{ props.row.user.name }} </span>
                </div>
                <div>
                  <span class="text-weight-bold text-accent"> IPv4: </span>
                  <span class="text-info">{{ props.row.ipv4 }} </span>
                </div>
              </div>
              <div class="column gap-5px">
                <div>
                  <span class="text-weight-bold text-accent">Last Seen: </span>
                  <span class="text-info">{{
                    new Date(props.row.last_seen).toLocaleString()
                  }}</span>
                </div>
                <div>
                  <span class="text-weight-bold text-accent"> IPv6: </span>
                  <span class="text-info">{{ props.row.ipv6 }} </span>
                </div>
              </div>

              <div class="column justify-end">
                <q-btn
                  flat
                  round
                  dense
                  color="positive"
                  icon="route"
                  @click="manageRoutes(props.row)"
                  v-if="props.row.routes > 0"
                >
                  <q-tooltip> Manage Routes </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { extend, QTableColumn } from 'quasar'
import NodeConfiguration from 'src/components/nodes/NodeConfiguration.vue'
import RouteConfigurationComponent from 'src/components/nodes/RouteConfigurationComponent.vue'
import { QuasascaleNode } from 'src/types/Database'
import { is } from 'quasar'
import { AxiosError } from 'axios'
import { api } from 'boot/axios'

const filter = ref('')
const { grid_view } = storeToRefs(useSettingsStore())
const {
  getNodes,
  renameNode,
  changeUser,
  updateTags,
  createNode,
  getNodeRoutes,
  updateIP,
} = useNodesStore()

const nodes = ref<QuasascaleNode[]>([])
const cols = ref<QTableColumn[]>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
    sort: (a, b) => parseInt(a) - parseInt(b),
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'lastSeen',
    required: true,
    label: 'Last Seen',
    field: 'node_last_seen',
    align: 'left',
  },
  {
    name: 'ipv4',
    required: true,
    label: 'IPv4',
    field: 'ipv4',
    align: 'left',
    sortable: true,
    sort: (a, b) => sortIPv4(a, b),
  },
  {
    name: 'ipv6',
    required: true,
    label: 'IPv6',
    field: 'ipv6',
    align: 'left',
  },
  {
    name: 'user',
    required: true,
    label: 'User',
    field: 'user',
    align: 'left',
    sortable: true,
    sort: (a, b) => a.name.localeCompare(b.name),
  },
  {
    name: 'tags',
    required: true,
    label: 'Forced Tags',
    field: 'forced_tags',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'right',
  },
])

const online = ref(false)
function sortIPv4(a: string, b: string) {
  const num1 = Number(
    a
      .split('.')
      .map((num) => `000${num}`.slice(-3))
      .join(''),
  )
  const num2 = Number(
    b
      .split('.')
      .map((num) => `000${num}`.slice(-3))
      .join(''),
  )
  return num1 - num2
}

function editNode(node: QuasascaleNode, index: number): void {
  useDialog()
    .show(NodeConfiguration, {
      node: node,
    })
    .onOk(async (updatedNode: QuasascaleNode) => {
      try {
        if (node.name !== updatedNode.name) await renameNode(updatedNode)
        if (!is.deepEqual(node.forced_tags, updatedNode.forced_tags))
          await updateTags(updatedNode)
        if (node.user?.id !== updatedNode.user?.id)
          await changeUser(updatedNode)
        if (node.ipv4 !== updatedNode.ipv4 && node.ipv6 !== updatedNode.ipv6)
          await updateIP(updatedNode.id, {
            IPv4: updatedNode.ipv4,
            IPv6: updatedNode.ipv6,
          })
        else if (node.ipv4 !== updatedNode.ipv4)
          await updateIP(updatedNode.id, { IPv4: updatedNode.ipv4 })
        else if (node.ipv6 !== updatedNode.ipv6)
          await updateIP(updatedNode.id, { IPv6: updatedNode.ipv6 })
        nodes.value[index] = updatedNode
      } catch {}
    })
}
function addNode(): void {
  const node: Omit<QuasascaleNode, 'id'> = {
    name: '',
    online: false,
    last_seen: new Date().toISOString(),
    ipv4: '',
    ipv6: '',
    machine_key: '',
    forced_tags: [],
    user: { id: '0', name: '', createdAt: '' },
    routes: 0,
  }
  useDialog()
    .show(NodeConfiguration, {
      node: node,
    })
    .onOk(async (node: QuasascaleNode) => {
      try {
        await createNode(node)
        nodes.value.push(node)
        useNotify('Node added successfully', 'check')
      } catch (error) {
        useNotify(
          'An error has occcured while adding the node',
          'warning',
          'negative',
        )
      }
    })
}

function removeNode(node: QuasascaleNode, index: number): void {
  useDialog()
    .del()
    .onOk(async () => {
      try {
        await api.delete(`/node/${node.id}`)
        nodes.value = nodes.value.splice(index, 1)
        useNotify('Node delete successfully', 'check')
      } catch (ex) {
        if (ex instanceof AxiosError) {
          useNotify(ex.response?.data.message, 'warning', 'negative')
        }
      }
    })
}

function expireNode(node: QuasascaleNode): void {
  useDialog()
    .del('Are you sure you want to expire this node?')
    .onOk(async () => {
      try {
        await api.post(`/node/${node.id}/expire`)
        useNotify('Node expired successfully', 'check')
      } catch (ex) {
        if (ex instanceof AxiosError) {
          useNotify(ex.response?.data.message, 'warning', 'negative')
        }
      }
    })
}

async function manageRoutes(node: QuasascaleNode): Promise<void> {
  try {
    const routes = await getNodeRoutes(node.id)
    if (routes.length === 0) {
      useNotify('Node has no routes', 'directions_off', 'negative')
      return
    }
    useDialog().show(RouteConfigurationComponent, {
      routes: routes,
      nodeId: node.id,
    })
  } catch (error) {
  } finally {
  }
}

function formatTag(tag: string) {
  return tag.replace('tag:', '')
}

onMounted(async () => {
  nodes.value = await getNodes()
})

const initial_nodes: QuasascaleNode[] = []
function showOnlineOnly(value: boolean) {
  if (value) {
    extend(true, initial_nodes, nodes.value)
    nodes.value = nodes.value.filter((node) => node.online)
  } else {
    extend(true, nodes.value, initial_nodes)
  }
}
</script>
