<template>
  <q-layout view="hHh Lpr fFf">
    <q-header bordered class="bg-dark">
      <q-toolbar>
        <div
          v-if="$q.screen.lt.sm"
          class="row items-center justify-between full-width"
        >
          <div
            class="text-h6 text-weight-bold opacity-[1!important] title-text"
          >
            QuasaScale
          </div>
          <div
            class="q-ml-md row items-center gap-4px text-white text-subtitle1"
          >
            <animated-circle v-if="active_headscale !== undefined" />
            <span v-if="active_headscale !== undefined">
              {{ active_headscale.name }} {{ headscale_version }}
            </span>
            <q-btn
              icon="check"
              color="primary"
              class="q-ml-md"
              round
              flat
              @click="restartHeadscale"
              :loading="restarting"
              v-if="has_config_changed"
            ></q-btn>
          </div>
        </div>
        <q-toolbar-title
          v-else
          class="text-weight-bold text-[#ff8700] opacity-[1!important] text-shadow-[rgb(255,135,0)_0px_0px_1px,rgba(249,82,0,0.6)_0px_0px_5px,rgba(249,15,0,0.4)_0px_5px_4px]"
        >
          QuasaScale
        </q-toolbar-title>
        <q-btn
          color="primary"
          label="Apply changes"
          class="q-mr-md"
          icon="check"
          dense
          flat
          :loading="restarting"
          @click="restartHeadscale"
          v-if="$q.screen.gt.sm && has_config_changed"
        >
          <q-tooltip
            >For some changes to take effect, we need to restart headscale
            service</q-tooltip
          >
        </q-btn>
        <q-btn
          color="primary"
          flat
          round
          size="sm"
          outline
          :class="
            grid_view
              ? 'i-material-symbols:lists-rounded'
              : 'i-material-symbols-light:grid-view-rounded'
          "
          @click="grid_view = !grid_view"
          v-if="$q.screen.gt.xs"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.xs ? true : false"
      v-model="drawer"
      behavior="desktop"
      mini
      bordered
      class="relative"
    >
      <q-list class="q-gutter-y-sm pa4px">
        <template v-for="link in linksList" :key="link.label">
          <q-item
            clickable
            :to="{ name: link.route }"
            exact
            active-class="text-[#f6ae2d]"
            class="hover:rounded-lg"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" size="md">
                <q-tooltip anchor="center right" self="center left">
                  {{ link.label }}
                </q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-footer
      bordered
      class="pb-[env(safe-area-inset-bottom)] bg-dark"
      v-if="$q.screen.lt.sm"
    >
      <q-tabs
        no-caps
        dense
        indicator-color="transparent"
        active-class="text-[#f6ae2d]"
        class="bg-dark q-py-sm"
        align="justify"
      >
        <q-route-tab
          v-for="link in linksList"
          :key="link.label"
          :to="{ name: link.route }"
          :icon="link.icon"
          :label="link.mobile_label"
          active-class="text-primary"
          :ripple="false"
        />
      </q-tabs>
    </q-footer>
    <q-footer bordered class="bg-dark" v-else>
      <q-item>
        <q-item-section avatar>
          <div class="row items-center gap-4px">
            <animated-circle v-if="active_headscale !== undefined" />
            {{ active_headscale?.name }} {{ headscale_version }}
          </div>
        </q-item-section>
      </q-item>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { symOutlinedDevices } from '@quasar/extras/material-symbols-outlined'
import { AxiosError } from 'axios'

defineOptions({
  name: 'MainLayout',
})
const restarting = ref(false)
const $q = useQuasar()
const drawer = ref(true)
const { active_headscale } = storeToRefs(useHeadscaleInstancesStore())
const { getHeadscaleInstances } = useHeadscaleInstancesStore()
const { getUsers } = useUsersStore()
const { grid_view, has_config_changed, headscale_version } =
  storeToRefs(useSettingsStore())
useIcons()

const linksList = ref([
  {
    icon: symOutlinedDevices,
    route: 'nodes',
    label: 'Nodes',
    mobile_label: 'Nodes',
  },
  {
    icon: 'person',
    route: 'users',
    label: 'Users',
    mobile_label: 'Users',
  },
  {
    icon: 'eos-icons:dns',
    route: 'dns',
    label: 'DNS',
    mobile_label: 'DNS',
  },
  {
    icon: 'app_registration',
    route: 'acl',
    label: 'ACL',
    mobile_label: 'ACL',
  },
  {
    icon: 'simple-icons:tailscale',
    route: 'headscale-instances',
    label: 'Headscale Instances',
    mobile_label: 'Instances',
  },
])

const router = useRouter()
onMounted(async () => {
  await getHeadscaleInstances()

  if (active_headscale.value === undefined)
    router.replace({ name: 'headscale-instances' })
  else await getUsers()
})

async function restartHeadscale() {
  useDialog()
    .del(
      'Are you sure you want to restart headscale?<br>This might have a <b>downtime</b> up to <b>30s</b>',
      {
        ok_label: 'Restart',
        ok_color: 'primary',
        cancel_color: 'secondary',
      },
    )
    .onOk(async () => {
      try {
        restarting.value = true
        const resp = await api.post('/restart')
        useNotify(resp.data.message, 'check')
        has_config_changed.value = false
      } catch (ex) {
        if (ex instanceof AxiosError)
          useNotify(ex.response?.data.message, 'warning', 'negative')
      } finally {
        restarting.value = false
      }
    })
}
</script>
