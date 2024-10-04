<template>
  <q-card flat :bordered="$q.screen.gt.xs" class="rounded-xl! bg-stone-950">
    <q-form @submit="save">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{ componentProps.title }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div
          class="text-body1 text-accent q-mb-md"
          v-if="componentProps.description"
        >
          {{ componentProps.description }}
        </div>
        <q-input
          outlined
          hide-bottom-space
          v-model="inpout"
          :label="componentProps.input_label"
          :rules="[(val) => !!val || 'Field required']"
          lazy-rules="ondemand"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          :label="componentProps.btn_label || 'Save'"
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
const props = defineProps<{
  onDialogOK: (payload: string) => void
  componentProps: {
    title: string
    description: string
    label: string
    input_label: string
    btn_label?: string
  }
}>()

const inpout = ref('')

function save() {
  props.onDialogOK(inpout.value)
}
</script>
