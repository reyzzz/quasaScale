<template>
  <q-dialog
    ref="dialogRef"
    class="full-width"
    @hide="onDialogHide"
    :persistent="persistent"
    :position="$q.platform.is.mobile ? 'bottom' : 'standard'"
    no-shake
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <component
      :is="componentToRender"
      v-bind="{
        onDialogOK,
        onDialogCancel,
        componentProps: { ...componentToRenderProps },
      }"
      class="iphone-bottom-notch"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  componentToRender: any
  componentToRenderProps: Record<string, unknown>
  persistent: false
}>()

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

onMounted(() => {
  location.hash = '#' + props.componentToRender.name
})
onUnmounted(() => {
  location.hash = ''
})
const route = useRoute()
watch(
  () => route.hash,
  (newHash) => {
    if (newHash === '') onDialogCancel()
  }
)
</script>
