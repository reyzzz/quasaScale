<template>
  <q-card style="height: calc(100vh - 300px)" class="max-w-450px w-full">
    <q-card-section class="row justify-between items-center">
      <div class="text-h6">
        PreAuthKeys {{ $q.screen.gt.sm ? 'Management' : '' }}
      </div>
      <div>
        <q-btn
          icon="save"
          flat
          round
          color="blue"
          type="submit"
          class="q-mr-md"
          @click="submit"
        />
        <q-btn icon="close" round flat v-close-popup />
      </div>
    </q-card-section>
    <q-card-section>
      <q-btn
        icon="add"
        label="add key"
        flat
        dense
        class="q-mb-sm q-ml-md"
        @click="showAddKeySection = true"
      />
      <q-scroll-area style="height: calc(100vh - 500px)" class="q-pa-md">
        <q-card
          flat
          bordered
          class="rounded-[12px] q-mb-sm"
          v-if="showAddKeySection"
        >
          <q-card-section class="q-py-sm">
            <div class="row justify-between items-center">
              <div class="q-mb-sm">
                <q-checkbox
                  v-model="ephemeral"
                  label="Ephemeral"
                  color="amber-8"
                />
                <q-checkbox
                  v-model="reusable"
                  label="Reusable"
                  color="purple-13"
                />
              </div>
              <q-btn
                icon="check"
                color="positive"
                round
                flat
                dense
                @click="addKey"
              />
            </div>

            <div>
              <span class="text-grey-6 q-mr-xs">Key:</span
              >XXXXXXXX-XXXXXXXX-XXXXXXXX
            </div>
            <div style="max-width: 300px" class="q-mt-md">
              <q-input filled v-model="expiration" label="Expiration Date">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="expiration" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="expiration"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
        </q-card>
        <template v-for="pre_auth_key in _preAuthKeys" :key="pre_auth_key.id">
          <q-card flat bordered class="rounded-[12px] q-mb-sm">
            <q-card-section class="q-py-sm">
              <div class="q-mb-sm">
                <q-badge
                  outline
                  color="amber-8"
                  label="Ephemeral"
                  v-if="pre_auth_key.ephemeral"
                  class="q-mr-sm"
                />
                <q-badge
                  outline
                  color="purple-13"
                  label="Reusable"
                  v-if="pre_auth_key.reusable"
                  class="q-mr-sm"
                />
                <q-badge
                  outline
                  color="red-10"
                  label="Used"
                  v-if="pre_auth_key.used"
                />
              </div>

              <div class="text-secondary">
                <span class="text-weight-bold text-accent q-mr-xs">Key:</span
                >{{ pre_auth_key.key }}
              </div>
              <div class="text-secondary">
                <span class="text-weight-bold text-accent q-mr-xs"
                  >Expiration:</span
                >
                {{ pre_auth_key.expiration_date }}
              </div>
            </q-card-section>
          </q-card>
        </template>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { date, extend } from 'quasar'
import { PreAuthKeys } from 'src/types/Database'

defineOptions({ name: 'preAuthKeys-dialog' })
const props = defineProps<{
  onDialogOK: (payload: PreAuthKeys[]) => void
  componentProps: {
    pre_auth_keys: PreAuthKeys[]
  }
}>()
const showAddKeySection = ref(false)
const ephemeral = ref(false)
const reusable = ref(false)
const expiration = ref(date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'))
const _preAuthKeys = ref<PreAuthKeys[]>(
  extend(true, [], props.componentProps.pre_auth_keys),
)

function addKey(): void {
  const preAuthKey: PreAuthKeys = {
    id: _preAuthKeys.value.length,
    ephemeral: ephemeral.value,
    reusable: reusable.value,
    used: false,
    key: 'ascasdcasdc',
    expiration_date: expiration.value,
  }
  _preAuthKeys.value.push(preAuthKey)
  showAddKeySection.value = false
  ephemeral.value = false
  reusable.value = false
}
function submit(): void {
  props.onDialogOK(_preAuthKeys.value)
}
</script>
