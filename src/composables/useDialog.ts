import { Dialog } from 'quasar'
import { Component } from 'vue'
import DialogComponent from 'src/components/DialogComponent.vue'
export function useDialog() {
  function del(msg?: string) {
    return Dialog.create({
      cancel: {
        label: 'Cancel',
        'no-caps': true,
        flat: true,
        color: 'primary',
      },
      ok: {
        label: 'Delete',
        color: 'negative',
        'no-caps': true,
        flat: true,
      },
      html: true,
      message: msg || 'Are you sure you want to delete this item?',
      persistent: true,
      title: 'Confirm',
    })
  }
  function prompt(promptModel: string, msg?: string) {
    return Dialog.create({
      cancel: {
        label: 'Cancel',
        'no-caps': true,
        flat: true,
        color: 'primary',
      },
      ok: {
        label: 'Updated',
        color: 'primary',
        'no-caps': true,
        flat: true,
      },
      prompt: {
        model: promptModel,
        type: 'text',
        isValid: (val) => val.length > 0,
      },
      html: true,
      message: msg || 'Are you sure you want to update this item?',
      persistent: true,
      title: 'Confirm Update',
    })
  }
  function show(
    componentToRender: Component,
    componentProps?: Record<string, unknown>
  ) {
    return Dialog.create({
      component: DialogComponent,
      componentProps: {
        componentToRender: componentToRender,
        componentToRenderProps: componentProps ?? {},
        persistent: true,
      },
      ok: false,
      cancel: false,
    })
  }
  return { del, prompt, show }
}
