<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    :persistent="persistent"
    :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
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
      class="pb-[env(safe-area-inset-bottom)]"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import type { Component } from 'vue'

const props = defineProps<{
  componentToRender: Component
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
  },
)
</script>
