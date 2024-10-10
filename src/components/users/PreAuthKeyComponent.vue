<template>
  <q-card
    :bordered="$q.screen.gt.xs"
    flat
    style="height: calc(100vh - 314px)"
    class="w-100% rounded-xl! bg-stone-950"
  >
    <q-card-section class="row justify-between items-center q-py-sm">
      <div class="text-h6">
        {{ $q.screen.gt.sm ? 'Manage' : '' }} PreAuthKeys
      </div>
      <div>
        <q-btn icon="close" round flat v-close-popup />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end mr-sm">
        <q-btn
          :icon="addKeySection ? 'remove' : 'add'"
          :label="addKeySection ? 'hide Input' : 'add key'"
          color="primary"
          outline
          class="q-mb-sm"
          @click="addKeySection = !addKeySection"
        />
      </div>
      <q-scroll-area
        style="height: calc(100vh - 450px)"
        :visible="false"
        :thumb-style="{ width: '3px', backgroundColor: '#ff8700' }"
      >
        <q-card
          flat
          bordered
          class="rounded-xl q-mb-sm full-width bg-stone-950"
          v-if="addKeySection"
        >
          <q-card-section>
            <div class="row justify-between items-center">
              <div>
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

            <div class="q-mt-sm">
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
          <q-card flat bordered class="rounded-xl q-mb-sm bg-stone-950">
            <q-card-section>
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
                    label="reusable"
                    v-if="pre_auth_key.reusable"
                    class="q-mr-sm"
                  />
                  <q-badge
                    outline
                    color="secondary"
                    label="used"
                    v-if="pre_auth_key.used"
                  />
                  <q-badge
                    outline
                    color="negative"
                    class="q-ml-sm"
                    label="expired"
                    v-if="new Date(pre_auth_key.expiration_date) < new Date()"
                  />
                </div>
              </div>
              <q-btn
                class="absolute top-2 right-3"
                @click="expireKey(pre_auth_key.key)"
                dense
                round
                icon="timer_off"
                color="negative"
                flat
              >
                <q-tooltip>Expire</q-tooltip>
              </q-btn>
              <div class="text-info">
                <span
                  class="text-weight-bold text-accent q-mr-xs hover:cursor-pointer"
                  >Key:
                </span>
                <span
                  @click="copyString(pre_auth_key.key)"
                  class="hover:cursor-pointer"
                >
                  {{ chopString(pre_auth_key.key) }}
                </span>
                <q-btn
                  icon="content_copy"
                  flat
                  dense
                  size="xs"
                  round
                  @click="copyString(pre_auth_key.key)"
                />
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
  </q-card>
</template>

<script setup lang="ts">
import { date, extend } from 'quasar'
import { PreAuthKeys } from 'src/types/Database'
const { addPreAuthKey, expirePreAuthKey, getuserPreAuthKeys } = useUsersStore()
const { copyString, chopString } = useUtils()
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
    preAuthKey.expiration_date = new Date().toLocaleString()
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
    useDialog()
      .del('Are you sure you want to expire this PreAuthKey?', {
        ok_label: 'Expire',
      })
      .onOk(async () => {
        await expirePreAuthKey(key, props.componentProps.username)
        await getuserPreAuthKeys(props.componentProps.username)
        useNotify('PreAuthKey expired successfully', 'check')
      })
  } catch (error) {
    useNotify('Failed to expire the PreAuthKey', 'warning', 'negative')
  }
}
</script>
