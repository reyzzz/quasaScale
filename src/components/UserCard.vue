<template>
  <q-card flat bordered class="rounded-borders">
    <q-card-section>
      <div class="row justify-between items-center q-mb-sm">
        <div class="text-bold text-h6">
          {{ name }}
        </div>
        <q-btn flat round dense icon="more_vert">
          <q-menu auto-close>
            <q-list style="width: max-content">
              <q-item clickable>
                <q-item-section class="text-primary"
                  >Manage PreAuthKey</q-item-section
                >
              </q-item>
              <q-item clickable @click="renameUser">
                <q-item-section class="text-primary"
                  >Rename User</q-item-section
                >
              </q-item>

              <q-separator />
              <q-item clickable @click="deleteUser">
                <q-item-section class="text-negative"
                  >Delete User</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div>
        <span class="text-weight-medium"> Creation Date:</span>
        {{ creation_date }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { useDialog } from 'src/composables/useDialog'

const props = defineProps<{
  name: string
  creation_date: string
}>()
const emit = defineEmits<{
  updateName: [name: string]
  deleteUser: []
}>()
function renameUser() {
  useDialog()
    .prompt(props.name)
    .onOk((data: string) => {
      emit('updateName', data)
    })
}

function deleteUser() {
  useDialog()
    .del()
    .onOk(() => {
      emit('deleteUser')
    })
}
</script>
