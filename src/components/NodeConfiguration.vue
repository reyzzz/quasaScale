<template>
  <q-card flat bordered style="width: 500px">
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="col-grow row items-center">
  <q-scroll-area class="col-grow w-full h-40px max-h-300 q-pa-sm" :vertical-offset="[0,-4]">
    <div class="row no-wrap">
      <q-btn icon="add" round flat dense @click="addTag" size="sm" class="q-mr-sm"  >
        <q-tooltip>
                  Add tag
          </q-tooltip>
        </q-btn>
      <template v-for="(tag, index) in _node.tags" :key="index">
        <q-badge outline color="primary" :label="tag"   />
        <q-btn flat round dense size="xs" icon="cancel" class="q-mr-xs" color="accent" @click="removeTag(index)" />
          
          
      </template>
    </div>
    
  </q-scroll-area>
  
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
          :rules="[(val) => !!val || 'Field required' , 
                    (val) => validatedIp(val) || 'Wrong ip format'
          ]"
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

function addTag() {
useDialog().prompt('', 'Insert tag', 'Add tag', checkTag).onOk((data) => {
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

function removeTag(index: number) {
 _node.value.tags.splice(index, 1);

}

function validatedIp(ip: string) {
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipRegex.test(ip);
    
}

function checkTag(val: string): boolean | string {
  return _node.value.tags.includes(val) ? 'Tag already used' : true; 
}
</script>
