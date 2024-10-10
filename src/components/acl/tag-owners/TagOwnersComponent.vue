<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="tag_owners_array"
    :columns="cols"
    row-key="name"
    :filter="filter"
    :pagination="{ rowsPerPage: 0 }"
    :title="$q.screen.gt.sm ? 'Tag Owners' : ''"
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
        :label="$q.screen.gt.sm ? 'New Tag' : ''"
        color="primary"
        outline
        :dense="$q.screen.lt.sm"
        @click="addTagOwner"
      />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>
          <span class="text-base">{{ props.row.name }}</span>
        </q-td>
        <q-td>
          <template v-for="value in props.row.value" :key="value">
            <q-badge
              outline
              color="primary"
              :label="value"
              class="q-mr-sm text-sm"
            />
          </template>
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn
            flat
            round
            color="secondary"
            icon="edit"
            dense
            @click="editTag(props.row)"
          >
            <q-tooltip>Edit Tag</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            dense
            @click="deleteTag(props.row)"
          >
            <q-tooltip>Delete Tag</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <template #item="props">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row q-mb-sm justify-between">
            <div class="text-h6 row">
              {{ props.row.name }}
            </div>
            <div>
              <q-btn
                icon="edit"
                color="secondary"
                round
                flat
                dense
                @click="editTag(props.row)"
              >
                <q-tooltip>Edit Tag</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                dense
                @click="deleteTag(props.row)"
              >
                <q-tooltip>Delete Tag</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div>
            <template v-for="value in props.row.value" :key="value">
              <q-badge
                outline
                color="primary"
                :label="value"
                class="q-mr-sm text-sm"
              />
            </template>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-table>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { RowTagOwner } from 'src/types/Database'
import TagOwnersConfigurationComponent from './TagOwnersConfigurationComponent.vue'

const { grid_view } = storeToRefs(useSettingsStore())
const filter = ref('')
const { tag_owners, acl_config } = storeToRefs(useAclsStore())
const { updateACLs } = useAclsStore()
const { isPatternPresentInEntity, replacePatternInEntity } = useUtils()
const tag_owners_array = computed(() => {
  return Object.entries(tag_owners.value).map(([key, tag_owner]) => {
    return {
      name: key,
      value: tag_owner,
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
    name: 'owners',
    required: true,
    label: 'Owners',
    format: (val) => val.name,
    field: 'owners',
    align: 'left',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    field: 'action',
    align: 'right',
  },
])

function editTag(tag_owner: RowTagOwner) {
  useDialog()
    .show(TagOwnersConfigurationComponent, {
      tag_owner: tag_owner,
      all_tag_owners: tag_owners_array.value,
    })
    .onOk(async (updated_tag_owner: RowTagOwner) => {
      acl_config.value = await replacePatternInEntity(
        tag_owner.name,
        updated_tag_owner.name,
        JSON.stringify(acl_config.value),
      )
      updateACLs(acl_config.value)
    })
}

function addTagOwner() {
  useDialog()
    .show(TagOwnersConfigurationComponent, {
      tag_owner: { name: 'tag:', value: [] } satisfies RowTagOwner,
      all_tag_owners: tag_owners_array.value,
    })
    .onOk(async (tag_owner: RowTagOwner) => {
      tag_owners.value[tag_owner.name] = tag_owner.value as string[]
      await updateACLs({ tagOwners: tag_owners.value })
    })
}

function deleteTag(tag_owner: RowTagOwner) {
  useDialog()
    .del()
    .onOk(async () => {
      if (
        isPatternPresentInEntity(
          tag_owner.name,
          JSON.stringify(acl_config.value),
        )
      ) {
        useNotify(
          'Unable to remove this Tag Owner as it is currently associated with ACLs ',
          'warning',
          'negative',
        )
        return
      }
      delete tag_owners.value[tag_owner.name]
      await updateACLs({ tagOwners: tag_owners.value })
    })
}
</script>
