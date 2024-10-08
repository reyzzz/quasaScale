<template>
  <q-item>
    <q-form
      @submit="
        $emit('send-value', {
          role: role === null ? '*' : role,
          ports: ports,
        })
      "
    >
      <q-item-section>
        <div class="q-gutter-xs q-mt-xs row no-wrap justify-between">
          <div class="col-shrink">
            <template v-for="chip in chips" :key="chip.label">
              <q-chip
                :selected="selected_option === chip.label"
                @click="handleSelected(chip.label)"
                :color="chip.color"
                text-color="white"
                class="q-pt-xs"
              >
                {{ chip.label }}
              </q-chip>
            </template>
          </div>
          <div class="col-auto">
            <q-btn
              flat
              color="positive"
              round
              dense
              icon="check"
              type="submit"
            />
          </div>
        </div>

        <div class="q-mt-md q-gutter-y-sm">
          <q-select
            v-if="selected_option !== 'IP' && selected_option !== 'All'"
            :label="selected_option"
            outlined
            hide-bottom-space
            :rules="[(val) => !!val || 'Field required']"
            v-model="role"
            :options="_options"
          />
          <q-input
            v-if="selected_option === 'IP'"
            outlined
            hide-bottom-space
            v-model="role"
            label="IP"
            :rules="[(val) => validateIPv4(val) || 'Wrong IPv4 format']"
          />
          <q-select
            v-if="!is_src"
            label="Ports"
            outlined
            v-model="ports"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            hint="Enter the port and press enter"
            new-value-mode="add-unique"
            hide-hint
            hide-bottom-space
            :rules="[
              (val) =>
                validatePorts(val) || 'Please enter either port numbers or *',
            ]"
          />
        </div>
      </q-item-section>
    </q-form>
  </q-item>
</template>

<script lang="ts" setup>
const props = defineProps<{
  chips: {
    label: string
    color: string
  }[]
  options: string[]
  is_src: boolean
}>()
const { validateIPv4 } = useUtils()
const emit = defineEmits<{
  'send-value': [{ role: string; ports: string[] }]
  'chip-changed': [chip: string]
}>()
const role = ref()
const selected_option = ref(props.chips[0].label)
const _options = ref(props.options)
function handleSelected(selected: string) {
  selected_option.value = selected
  role.value = null
  emit('chip-changed', selected)
}

const ports = ref<string[]>([])

function validatePorts(port: string[]) {
  if (port.length === 0) return true
  const isAsterisk = port[port.length - 1] === '*'
  if (isAsterisk && port.length > 1) return false

  const isNumber = /^\d+$/.test(port[port.length - 1])

  if (!isNumber && !isAsterisk) return false

  const hasNumber = port.some((input) => /^\d+$/.test(input))
  const hasAsterisk = port.includes('*')

  if (hasNumber && hasAsterisk) return false

  return true
}
watch(
  () => props.options,
  (newOptions) => {
    _options.value = newOptions
  },
)
</script>
