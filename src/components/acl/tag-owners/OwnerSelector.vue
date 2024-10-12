<template>
  <q-item>
    <q-item-section>
      <div class="q-gutter-xs q-mt-xs row justify-between">
        <div>
          <template v-for="chip in chips" :key="chip.label">
            <q-chip
              :selected="selected_chip === chip.label"
              @click="chipClicked(chip.label)"
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
            @click="addOwner"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <q-select
          :label="selected_chip"
          outlined
          v-model="owner"
          :options="options"
        />
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { Groups } from 'src/types/Database'
const owners = defineModel<Array<string | Groups>>('modelValue', {
  required: true,
})
const is_adding = defineModel('is_adding', {
  type: Boolean,
  required: true,
})
const chips = [
  { label: 'Groups', color: 'purple-13' },
  { label: 'Users', color: 'secondary' },
]
const { groups } = storeToRefs(useAclsStore())
const { users } = storeToRefs(useUsersStore())
const owner = ref<string | null>(null)
const selected_chip = ref('Groups')
const options = computed(() => {
  if (selected_chip.value === 'Groups') return Object.keys(groups.value)
  else return users.value.map((user) => user.name)
})

function addOwner() {
  if (owner.value === null || owners.value.includes(owner.value)) return
  owners.value.push(owner.value)
  owner.value = null
  is_adding.value = false
}

function chipClicked(label: string) {
  selected_chip.value = label
  owner.value = null
}
</script>
