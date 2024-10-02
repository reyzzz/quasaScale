<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-400px bg-stone-950"
  >
    <q-form @submit="save">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6 text-primary">
            {{ componentProps.title }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-body1 text-accent q-mb-md">
          {{ componentProps.description }}
        </div>
        <q-input
          outlined
          hide-bottom-space
          v-model="username"
          :label="componentProps.label"
          :rules="[
            (val) => !!val || 'Field required',
            (val) =>
              props.componentProps.username === ''
                ? checkUsername(val) || 'Username already used'
                : checkUsername(val, props.componentProps.username),
          ]"
        />
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
import { User } from 'src/types/Database'

const props = defineProps<{
  onDialogOK: (payload: string) => void
  componentProps: {
    title: string
    description: string
    label: string
    users: User[]
    username: string
  }
}>()

const username = ref('')

function checkUsername(name: string, org_name?: string): boolean | string {
  if (org_name) {
    if (name === org_name) return true
  }
  const user = props.componentProps.users.find((user) => user.name === name)
  return user ? 'UserName already exist' : true
}

function save() {
  props.onDialogOK(username.value)
}
</script>
