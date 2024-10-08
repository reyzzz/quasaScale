<template>
  <q-item>
    <q-item-section>
      <div class="q-gutter-xs q-mt-xs row justify-between">
        <div>
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
        <div>
          <q-btn
            flat
            color="positive"
            round
            dense
            icon="check"
            @click="$emit('send-value', role)"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <q-select
          :label="selected_option"
          outlined
          v-model="role"
          :options="_options"
        />
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
const props = defineProps<{
  chips: {
    label: string
    color: string
  }[]
  options: string[]
}>()

const emit = defineEmits<{
  'send-value': [role: string]
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
watch(
  () => props.options,
  (newOptions) => {
    _options.value = newOptions
  },
)
</script>
