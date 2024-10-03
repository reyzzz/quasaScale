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
          <q-td
            ><div class="row items-center gap-10px">
              <span class="relative flex h-3 w-3">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  :class="props.row.online ? 'bg-[#ade25d]' : 'bg-[#c10015]'"
                >
                </span>
                <span
                  class="relative inline-flex rounded-full h-3 w-3"
                  :class="props.row.online ? 'bg-[#ade25d]' : 'bg-[#c10015]'"
                ></span> </span
              >{{ props.row.id }}
            </div>
          </q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.lastSeen }}</q-td>
          <q-td>{{ props.row.IP_address_v4 }}</q-td>
          <q-td>{{ props.row.IP_address_v6 }}</q-td>
          <q-td>{{ props.row.user.name }}</q-td>
          <q-td
            ><template v-for="tag in props.row.validTags" :key="tag">
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
              class="i-material-symbols-light:route-outline-sharp q-ml-md"
              flat
              round
              color="green"
              dense
              @click="manageRoutes(props.row)"
            >
              <q-tooltip> Manage Routes </q-tooltip>
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
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-h6 row items-center col-10 gap-5px">
                <div class="row items-center gap-4px">
                  <span class="relative flex h-3 w-3">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      :class="
                        props.row.online ? 'bg-[#ade25d]' : 'bg-[#c10015]'
                      "
                    >
                    </span>
                    <span
                      class="relative inline-flex rounded-full h-3 w-3"
                      :class="
                        props.row.online ? 'bg-[#ade25d]' : 'bg-[#c10015]'
                      "
                    ></span> </span
                  >{{ props.row.name }}
                </div>

                <template v-for="tag in props.row.validTags" :key="tag">
                  <q-badge outline color="primary" :label="tag" />
                </template>
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list class="w-max">
                    <q-item clickable @click="manageRoutes(props.row)">
                      <q-item-section class="text-primary">
                        Manage Routes
                      </q-item-section>
                    </q-item>
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
                <span class="text-info">{{ props.row.user.name }} </span>
              </div>
              <div class="col-7">
                <span class="text-weight-bold text-accent">Last Seen:</span>
                <span class="text-info">{{ props.row.lastSeen }}</span>
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
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar'
import NodeConfiguration from 'src/components/NodeConfiguration.vue'
import RouteConfigurationComponent from 'src/components/RouteConfigurationComponent.vue'
import { QuasascaleNode } from 'src/types/Database'

const filter = ref('')
const { grid_view } = storeToRefs(useSettingsStore())
const {
  getNodes,
  renameNode,
  changeUser,
  updateTags,
  removeNode,
  createNode,
  getNodeRoutes,
} = useNodesStore()
const { arraysEqual } = useUtils()

const nodes = ref<QuasascaleNode[]>([])
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
    name: 'lastSeen',
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
    name: 'user',
    required: true,
    label: 'Assigned User',
    field: 'user',
    align: 'left',
    format: (val) => val.name,
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

function editNode(node: QuasascaleNode, index: number): void {
  useDialog()
    .show(NodeConfiguration, {
      node: node,
    })
    .onOk(async (updatedNode: QuasascaleNode) => {
      try {
        if (node.name !== updatedNode.name) await renameNode(updatedNode)
        if (!arraysEqual(node.validTags, updatedNode.validTags))
          await updateTags(updatedNode)
        if (node.user_id !== updatedNode.user_id) await changeUser(updatedNode)
        nodes.value[index] = updatedNode
        useNotify('Node updated successfully', 'check')
      } catch (error) {
        useNotify(
          'An error has occcured while updating this node',
          'warning',
          'negative',
        )
      }
    })
}
function addNode(): void {
  const node: QuasascaleNode = {
    name: '',
    online: false,
    lastSeen: '2024-09-27 17:24',
    IP_address_v4: '',
    IP_address_v6: '',
    user_id: '0',
    machine_key: '',
    validTags: [],
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

function deleteNode(index: number): void {
  useDialog()
    .del()
    .onOk(async () => {
      try {
        await removeNode(nodes.value[index])
        nodes.value = nodes.value.filter((_, ind) => index !== ind)
        useNotify('Node delete successfully', 'check')
      } catch (error) {
        useNotify(
          'An error has occured while deleting this node',
          'warning',
          'negative',
        )
      }
    })
}

async function manageRoutes(node: QuasascaleNode): Promise<void> {
  const routes = await getNodeRoutes(node.id as string)

  useDialog().show(RouteConfigurationComponent, {
    routes: routes,
    nodeId: node.id,
  })
}
onMounted(async () => {
  nodes.value = await getNodes()
})
</script>
