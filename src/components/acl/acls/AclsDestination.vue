<template>
  <q-card-section class="q-py-none q-pb-sm">
    <div class="text-h5 title-text">Destination</div>
    <q-list separator bordered class="rounded-xl">
      <template v-for="(source, index) in destinations" :key="index">
        <q-item>
          <q-item-section class="text-body1 text-info">
            {{ source }}
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              color="negative"
              flat
              round
              dense
              icon="delete"
              @click="destinations.splice(index, 1)"
            />
          </q-item-section>
        </q-item>
      </template>
      <q-item v-if="is_adding">
        <q-form @submit="addDestination" class="full-width">
          <q-item-section>
            <div class="q-mt-xs row no-wrap justify-between">
              <div class="col-shrink">
                <template v-for="chip in src_dst_chips" :key="chip.label">
                  <q-chip
                    :selected="selected_chip === chip.label"
                    @click="chipClicked(chip.label)"
                    :color="chip.color"
                    text-color="white"
                    class="q-pt-xs"
                    :label="chip.label"
                  >
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
                v-if="selected_chip !== 'IP' && selected_chip !== 'All'"
                :label="selected_chip"
                outlined
                hide-bottom-space
                :rules="[(val) => !!val || 'Field required']"
                v-model="destination"
                :options="options"
                lazy-rules="ondemand"
              />
              <q-input
                v-if="selected_chip === 'IP'"
                outlined
                hide-bottom-space
                v-model="destination"
                label="IP"
                :rules="[(val) => validateIPv4(val) || 'Wrong IPv4 format']"
                lazy-rules="ondemand"
              />
              <q-select
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
                    validatePorts(val) ||
                    'Please enter either port numbers or *',
                ]"
                lazy-rules="ondemand"
              />
            </div>
          </q-item-section>
        </q-form>
      </q-item>
    </q-list>
    <div class="row px-12px pt-8px justify-end">
      <q-btn
        flat
        round
        dense
        class="q-mr-xs q-mb-sm"
        :icon="!is_adding ? 'add' : 'remove'"
        @click="is_adding = !is_adding"
      />
    </div>
  </q-card-section>
</template>
<script setup lang="ts">
const destinations = defineModel<string[]>('modelValue', { required: true })
const is_adding = ref<boolean>(destinations.value.length === 0 ? true : false)
const { validateIPv4, src_dst_chips, validatePorts } = useUtils()
const { users } = storeToRefs(useUsersStore())
const { tag_owners, groups, hosts } = storeToRefs(useAclsStore())
const selected_chip = ref<string>('Users')
const destination = ref<string | null>(null)
const ports = ref<string[]>([])

const options = computed(() => {
  if (selected_chip.value === 'Users')
    return users.value.map((user) => user.name)
  else if (selected_chip.value === 'Groups') return Object.keys(groups.value)
  else if (selected_chip.value === 'Tag Owners')
    return Object.keys(tag_owners.value)
  else if (selected_chip.value === 'Hosts') return Object.keys(hosts.value)
  return []
})

function addDestination() {
  const dest = destination.value === null ? '*' : destination.value
  const port = ports.value.length === 0 ? '*' : ports.value.toString()
  if (destinations.value.includes(`${dest}:${port}`)) return
  destinations.value.push(`${dest}:${port}`)
  ports.value = []
  is_adding.value = false
}

function chipClicked(label: string) {
  selected_chip.value = label
  destination.value = null
}
</script>
