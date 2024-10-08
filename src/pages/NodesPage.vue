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
          <q-td>
            <div class="row no-wrap items-center gap-10px">
              <animated-circle :is_positive="props.row.online" />
              {{ props.row.id }}
            </div>
          </q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.last_seen }}</q-td>
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
              class="q-ml-md"
              icon="route"
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
              <div class="text-h6 col-10 row items-center">
                <div class="row items-center gap-6px">
                  <animated-circle :is_positive="props.row.online" />
                  {{ props.row.name }}
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
                      <q-item-section class="text-negative">
                        Delete Node
                      </q-item-section>
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
                <span class="text-weight-bold text-accent">Last Seen: </span>
                <span class="text-info">{{ props.row.last_seen }}</span>
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-5">
                <span class="text-weight-bold text-accent"> IPv4: </span>
                <span class="text-info">{{ props.row.ipv4 }} </span>
              </div>
              <div class="col-7">
                <span class="text-weight-bold text-accent"> IPv6: </span>
                <span class="text-info">{{ props.row.ipv6 }} </span>
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
import NodeConfiguration from 'src/components/nodes/NodeConfiguration.vue'
import RouteConfigurationComponent from 'src/components/nodes/RouteConfigurationComponent.vue'
import { QuasascaleNode } from 'src/types/Database'
import { is } from 'quasar'
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
    format: (val) => val.name,
  },
  {
    name: 'tags',
    required: true,
    label: 'Forced Tags',
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
        if (!is.deepEqual(node.forced_tags, updatedNode.forced_tags))
          await updateTags(updatedNode)
        if (node.user?.id !== updatedNode.user?.id)
          await changeUser(updatedNode)
        if (node.ipv4 !== updatedNode.ipv4 && node.ipv6 !== updatedNode.ipv6)
          await updateIP(updatedNode.id as string, {
            IPv4: updatedNode.ipv4,
            IPv6: updatedNode.ipv6,
          })
        else if (node.ipv4 !== updatedNode.ipv4)
          await updateIP(updatedNode.id as string, { IPv4: updatedNode.ipv4 })
        else if (node.ipv6 !== updatedNode.ipv6)
          await updateIP(updatedNode.id as string, { IPv6: updatedNode.ipv6 })
        nodes.value[index] = updatedNode
      } catch {}
    })
}
function addNode(): void {
  const node: QuasascaleNode = {
    name: '',
    online: false,
    last_seen: new Date().toISOString(),
    ipv4: '',
    ipv6: '',
    machine_key: '',
    forced_tags: [],
    user: { id: '0', name: '', createdAt: '' },
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
  try {
    const routes = await getNodeRoutes(node.id as string)
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
</script>
