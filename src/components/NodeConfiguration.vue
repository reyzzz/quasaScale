<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{ _node.id ? 'Edit Node' : 'Add Node' }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-sm">
        <q-input
          outlined
          hide-bottom-space
          v-model="_node.name"
          label="Node Name"
          :rules="[(val) => !!val || 'Field required']"
        />
        <q-select
          outlined
          v-model="_node.user_id"
          :options="users"
          placeholder="select a user"
          label="User"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          :rules="[(val) => !!val || 'Field is required']"
          hide-bottom-space
        ></q-select>
        <q-input
          outlined
          hide-bottom-space
          v-model="_node.IP_address_v4"
          label="IPv4"
          :rules="[
            (val) => !!val || 'Field required',
            (val) => validatedIPv4(val) || 'Wrong ip format',
          ]"
        />
        <q-input
          outlined
          hide-bottom-space
          v-model="_node.IP_address_v6"
          label="IPv6"
          :rules="[
            (val) => !!val || 'Field required',
            (val) => validatedIPv6(val) || 'wrong ip format',
          ]"
        />
        <q-select
          label="Tags"
          outlined
          v-model="_node.validTags"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
          hint="Enter the tag and press enter"
          hide-hint
          hide-bottom-space
        />
        <q-input
          v-if="!_node.id"
          :rules="[
            (val) =>
              validateMachineKey(val) || 'Format have to be HEX, 64 char',
          ]"
          outlined
          hide-bottom-space
          v-model="_node.machine_key"
          label="Machine Key"
        >
          <template #append>
            <q-btn
              class="q-my-md q-ml-auto"
              icon="lock_reset"
              dense
              flat
              round
              color="primary"
              @click="_node.machine_key = generateMachineKey()"
            >
              <q-tooltip>Generate Key</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          label="Save"
          color="primary"
          icon="save"
          type="submit"
          rounded
          outline
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { extend } from 'quasar'
import { QuasascaleNode } from 'src/types/Database'
defineOptions({ name: 'node-dialog' })
const props = defineProps<{
  onDialogOK: (payload: QuasascaleNode) => void
  componentProps: {
    node: QuasascaleNode
  }
}>()
const { validatedIPv4, validatedIPv6 } = useUtils()
const { users } = storeToRefs(useUsersStore())
const _node = ref<QuasascaleNode>(extend(true, {}, props.componentProps.node))
const { generateMachineKey } = useUtils()
function saveChanges(): void {
  const user = users.value.find((user) => {
    return user.id === _node.value.user_id
  })

  if (user) {
    _node.value.user = user
  }

  props.onDialogOK(_node.value)
}

function validateMachineKey(key: string) {
  const regex = /^[a-fA-F0-9]{64}$/
  return regex.test(key)
}
onMounted(() => {
  if (props.componentProps.node.user_id === '0')
    _node.value.user_id = users.value[0].id
})
</script>
