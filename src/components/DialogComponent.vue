<template>
  <q-dialog
    ref="dialogRef"
    class="full-width"
    @hide="onDialogHide"
    :persistent="persistent"
    :position="position"
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

import type { Component } from 'vue'
defineProps<{
  componentToRender: Component
  componentToRenderProps: Record<string, unknown>
  persistent: false
  position: 'standard' | 'top' | 'right' | 'bottom' | 'left' | undefined
}>()

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
</script>
