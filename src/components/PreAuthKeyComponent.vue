<template>
  <q-card
    :bordered="$q.screen.gt.xs"
    flat
    style="height: calc(100vh - 314px)"
    class="w-100% rounded-xl! bg-stone-950"
  >
    <q-card-section class="row justify-between items-center q-py-sm">
      <div class="text-h6">
        PreAuthKeys {{ $q.screen.gt.sm ? 'Management' : '' }}
      </div>
      <div>
        <q-btn icon="close" round flat v-close-popup />
      </div>
    </q-card-section>
    <q-card-section>
      <q-btn
        :icon="addKeySection ? 'remove' : 'add'"
        :label="addKeySection ? 'hide Input' : 'add key'"
        color="primary"
        outline
        dense
        class="q-mb-sm"
        @click="addKeySection = !addKeySection"
      />
      <q-scroll-area
        style="height: calc(100vh - 500px)"
        :visible="false"
        :thumb-style="{ width: '3px', backgroundColor: '#ff8700' }"
      >
        <q-card
          flat
          bordered
          class="rounded-xl q-mb-sm q-mr-xs"
          v-if="addKeySection"
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
          <q-card flat bordered class="rounded-xl q-mb-sm q-mr-xs">
            <q-card-section class="q-py-sm">
              <div class="row justify-between">
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
                <div
                  class="text-negative hover:cursor-pointer"
                  @click="expireKey(pre_auth_key.key)"
                >
                  EXPIRE
                </div>
              </div>

              <div class="text-info">
                <span class="text-weight-bold text-accent q-mr-xs">Key: </span>
                {{ pre_auth_key.key }}
              </div>
              <div class="text-info">
                <span class="text-weight-bold text-accent q-mr-xs">
                  Expiration:
                </span>
                {{ pre_auth_key.expiration_date }}
              </div>
            </q-card-section>
          </q-card>
        </template>
      </q-scroll-area>
    </q-card-section>
    <q-card-actions vertical>
      <q-btn
        label="Save"
        color="primary"
        outline
        @click="submit"
        rounded
        icon="save"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { date, extend } from 'quasar'
import { PreAuthKeys } from 'src/types/Database'
const { addPreAuthKey, expirePreAuthKey } = useUsersStore()
defineOptions({ name: 'preAuthKeys-dialog' })
const props = defineProps<{
  onDialogOK: (payload: PreAuthKeys[]) => void
  componentProps: {
    pre_auth_keys: PreAuthKeys[]
    username: string
  }
}>()
const addKeySection = ref(false)
const ephemeral = ref(false)
const reusable = ref(false)
const expiration = ref(date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'))
const _preAuthKeys = ref<PreAuthKeys[]>(
  extend(true, [], props.componentProps.pre_auth_keys),
)

async function addKey(): Promise<void> {
  try {
    const preAuthKey: PreAuthKeys = {
      ephemeral: ephemeral.value,
      reusable: reusable.value,
      used: false,
      key: '',
      expiration_date: expiration.value,
    }
    const key = await addPreAuthKey(preAuthKey, props.componentProps.username)
    preAuthKey.expiration_date = date.formatDate(
      key.expiration,
      'YYYY-MM-DD HH:mm',
    )
    preAuthKey.key = key.key
    _preAuthKeys.value.push(preAuthKey)
    addKeySection.value = false
    ephemeral.value = false
    reusable.value = false
  } catch (error) {
    useNotify('Failed to add this PreAuthKey', 'warning', 'negative')
  }
}
async function expireKey(key: string) {
  try {
    await expirePreAuthKey(key, props.componentProps.username)
  } catch (error) {
    useNotify('Failed to expire the PreAuthKey', 'warning', 'negative')
  }
}
function submit(): void {
  props.onDialogOK(_preAuthKeys.value)
}
</script>
