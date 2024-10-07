<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="save">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{
              props.componentProps.tag_owner.name !== 'tag:'
                ? 'Edit Tag Owners'
                : 'Add Tag Owners'
            }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          hide-bottom-space
          v-model="_tag_owner.name"
          label="Tag"
          :rules="[
            (val) => val.length > 4 || 'You need to enter a tag',
            (val) => val.startsWith('tag:') || 'Tag must start with tag:',
          ]"
        />
        <div class="px-8px py-4px text-subtitle1">Owners:</div>
        <q-list separator bordered class="rounded-xl">
          <template v-for="(value, index) in _tag_owner.value" :key="value">
            <q-item>
              <q-item-section>
                <span class="text-body1 text-info">{{ value }}</span>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  color="negative"
                  flat
                  round
                  dense
                  icon="delete"
                  @click="_tag_owner.value.splice(index, 1)"
                />
              </q-item-section>
            </q-item>
          </template>
          <RoleSelectorComponent
            @send-value="handleEmitValue($event)"
            @chip-changed="selected_option = $event"
            :chips="[
              { label: 'Group', color: 'purple-13' },
              { label: 'Users', color: 'secondary' },
            ]"
            :options="options"
            v-if="show_add_card"
          />
        </q-list>
        <div class="row px-12px pt-8px justify-end">
          <q-btn
            flat
            round
            dense
            class="q-mr-xs q-mb-sm"
            :icon="!show_add_card ? 'add' : 'remove'"
            @click="show_add_card = !show_add_card"
          />
        </div>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          color="primary"
          label="save"
          type="submit"
          icon="save"
          rounded
          outline
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { extend } from 'quasar'
import { RowTagOwner } from 'src/types/Database'
import RoleSelectorComponent from '../RoleSelectorComponent.vue'

const props = defineProps<{
  onDialogOK: (tag_owner: RowTagOwner) => void
  componentProps: {
    tag_owner: RowTagOwner
  }
}>()
const { groups } = storeToRefs(useAclsStore())
const { users } = storeToRefs(useUsersStore())
const selected_option = ref('Group')
const options = computed(() => {
  if (selected_option.value === 'Group') return Object.keys(groups.value)
  else return users.value.map((user) => user.name)
})
const show_add_card = ref(props.componentProps.tag_owner.name === 'tag:')

const _tag_owner = ref<RowTagOwner>(
  extend(true, {}, props.componentProps.tag_owner),
)

function handleEmitValue(role: string) {
  _tag_owner.value.value.push(role)
  show_add_card.value = false
}

function save() {
  if (_tag_owner.value.value.length === 0) {
    useNotify('Please select at least one group or user', 'warning', 'negative')
    return
  }
  props.onDialogOK(_tag_owner.value)
}
</script>
