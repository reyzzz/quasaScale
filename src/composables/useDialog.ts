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
  function prompt(
    promptModel: string,
    msg?: string,
    title?: string,
    customRule?: (val: string) => boolean | string,
  ) {
    return Dialog.create({
      cancel: {
        label: 'Cancel',
        'no-caps': true,
        flat: true,
        color: 'negative',
      },
      ok: {
        label: 'Confirm',
        color: 'blue',
        'no-caps': true,
        flat: true,
      },
      prompt: {
        model: promptModel,
        type: 'text',
        isValid(value) {
          if (value.length === 0) return false
          if (customRule) {
            const result = customRule(value)
            return result === true
          }

          return true
        },
        rules: [
          (val) => !!val || 'Field is required',
          ...(customRule
            ? [
                (val: string) => {
                  const result = customRule(val)
                  return result === true || result || 'Invalid Input'
                },
              ]
            : []),
        ],
      },
      color: 'primary',
      html: true,
      message: msg || 'Are you sure you want to update this item?',
      persistent: true,
      title: title || 'Confirm Update',
    })
  }
  function show(
    componentToRender: Component,
    componentProps?: Record<string, unknown>,
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
