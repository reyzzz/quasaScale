<template>
  <q-card flat bordered style="width: 500px">
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="col-grow row items-center text-h6">
            {{ _node.id ? 'Update ' + _node.name : 'Add Node' }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col q-gutter-y-sm">
        <q-input
          outlined
          hide-bottom-space
          v-model="_node.name"
          label="Node Name"
          :rules="[(val) => !!val || 'Field required']"
        />
        <q-select
          outlined
          v-model="_node.assigned_user_id"
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
          v-model="_node.IP_address"
          label="IP Address"
          :rules="[
            (val) => !!val || 'Field required',
            (val) => validatedIP(val) || 'Wrong ip format',
          ]"
        />
        <q-select
          label="Wallets to skip"
          outlined
          v-model="_node.tags"
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
          outlined
          hide-bottom-space
          v-model="_node.node_route"
          label="Node Route"
        />
      </q-card-section>
      <q-card-actions class="row justify-center">
        <q-btn
          :label="_node.id ? 'Update' : 'Save'"
          color="green"
          type="submit"
          class="col-11"
          rounded
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { extend } from 'quasar'
import { Node } from 'src/types/Database'
defineOptions({ name: 'node-dialog' })
const props = defineProps<{
  onDialogOK: (payload: Node) => void
  componentProps: {
    node: Node
  }
}>()
const { users } = storeToRefs(useUsersStore())
const _node = ref<Node>(extend(true, {}, props.componentProps.node))

function saveChanges(): void {
  const user = users.value.find((user) => {
    return user.id === _node.value.assigned_user_id
  })

  if (user) {
    _node.value.assigned_user_name = user.name
  }

  props.onDialogOK(_node.value)
}

function validatedIP(IP: string): boolean {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
  return ipRegex.test(IP)
}
</script>
