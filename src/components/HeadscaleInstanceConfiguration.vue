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
            {{ headscale_instance.id ? 'Edit Instance' : 'Add Instance' }}
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
          v-model="headscale_instance.name"
          label="Headscale Name"
          :rules="[(val) => !!val || 'Field required']"
        />

        <q-input
          outlined
          hide-bottom-space
          v-model="headscale_instance.quasascale_backend_url"
          label="Quasascale Backend URL"
          :rules="[
            (val) => !!val || 'Field required',
            (val) => validateURL(val) || 'wrong format',
          ]"
        />

        <q-input
          outlined
          hide-bottom-space
          v-model="headscale_instance.headscale_api_key"
          label="Headscale API Key"
          :rules="[(val) => !!val || 'Field required']"
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
import { extend } from 'quasar'
import { QuasascaleInstance } from 'src/types/Database'

const props = defineProps<{
  onDialogOK: (payload: QuasascaleInstance) => void
  componentProps: {
    headscale_instance: QuasascaleInstance
  }
}>()

const headscale_instance = ref<QuasascaleInstance>(
  extend(true, {}, props.componentProps.headscale_instance),
)

function validateURL(url: string) {
  return URL.canParse(url)
}
function saveChanges() {
  props.onDialogOK(headscale_instance.value)
}
</script>
