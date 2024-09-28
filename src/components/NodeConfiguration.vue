<template>
  <q-card flat bordered style="width: 500px">
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div>
            <template v-for="(tag, index) in _node.tags" :key="index">
              <q-badge outline color="blue-13" :label="tag" class="q-mr-sm" />
            </template>
            <q-btn icon="add" round flat dense @click="addTag" />
          </div>
          <div>
            <q-btn
              icon="save"
              flat
              round
              color="blue"
              type="submit"
              class="q-mr-md"
            />
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col q-gutter-y-sm">
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
          v-model="_node.ip_address"
          label="Ip Address"
          :rules="[(val) => !!val || 'Field required']"
        />
        <q-input
          outlined
          hide-bottom-space
          v-model="_node.node_route"
          label="Node Route"
        />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { extend, useQuasar } from 'quasar'
import { Node } from 'src/types/Database'
const $q = useQuasar()
defineOptions({ name: 'node-dialog' })
const props = defineProps<{
  onDialogOK: (payload: Node) => void
  componentProps: {
    node: Node
  }
}>()
const { users } = storeToRefs(useUsersStore())
const _node = ref<Node>(extend(true, {}, props.componentProps.node))

function addTag() {
  $q.dialog({
    title: 'Add Tag',
    message: 'Enter you tag',
    prompt: {
      model: '',
      type: 'text', // optional
    },
    color: 'blue',
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    _node.value.tags.push(data)
  })
}

function saveChanges() {
  const user = users.value.find((user) => {
    return user.id === _node.value.assigned_user_id
  })

  if (user) {
    _node.value.assigned_user_name = user.name
  }

  props.onDialogOK(_node.value)
}
</script>
