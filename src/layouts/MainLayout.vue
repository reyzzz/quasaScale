<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-dark">
      <q-toolbar>
        <q-toolbar-title
          v-if="$q.screen.lt.sm"
          class="row text-weight-bold text-[#ff8700] opacity-[1!important] text-shadow-[rgb(255,135,0)_0px_0px_1px,rgba(249,82,0,0.6)_0px_0px_5px,rgba(249,15,0,0.4)_0px_5px_4px]"
        >
          QuasaScale
          <div
            class="q-ml-md row items-center gap-4px text-white text-subtitle1"
          >
            <span
              class="relative flex h-3 w-3"
              v-if="active_headscale !== undefined"
            >
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ade25d]"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-[#ade25d]"
              ></span>
            </span>
            {{ active_headscale?.name }} selected
          </div>
        </q-toolbar-title>
        <q-toolbar-title
          v-else
          class="text-weight-bold text-[#ff8700] opacity-[1!important] text-shadow-[rgb(255,135,0)_0px_0px_1px,rgba(249,82,0,0.6)_0px_0px_5px,rgba(249,15,0,0.4)_0px_5px_4px]"
        >
          QuasaScale
        </q-toolbar-title>
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
            :disable="
              link.route === 'dns' &&
              active_headscale?.quasascale_backend_url === ''
            "
            :to="{ name: link.route }"
            exact
            active-class="text-[#f6ae2d]"
            class="hover:rounded-lg"
          >
            <q-item-section avatar>
              <span :class="link.icon">
                <q-tooltip anchor="center right" self="center left">
                  {{ link.label }}
                </q-tooltip>
              </span>
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
          :class="link.icon"
          :label="link.label"
          active-class="text-primary"
          :ripple="false"
        />
      </q-tabs>
    </q-footer>
    <q-footer bordered class="bg-dark" v-else>
      <q-item>
        <q-item-section avatar>
          <div class="row items-center gap-4px">
            <span
              class="relative flex h-3 w-3"
              v-if="active_headscale !== undefined"
            >
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ade25d]"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-[#ade25d]"
              ></span>
            </span>
            {{ active_headscale?.name }} selected
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
defineOptions({
  name: 'MainLayout',
})

const $q = useQuasar()
const drawer = ref(true)
const { active_headscale } = storeToRefs(useHeadscaleInstancesStore())
const { getHeadscaleInstances } = useHeadscaleInstancesStore()
const { grid_view } = storeToRefs(useSettingsStore())
const linksList = ref([
  {
    icon: 'i-material-symbols:devices-outline-rounded w-8 h-8',
    route: 'nodes',
    label: 'Nodes',
  },
  {
    icon: 'i-material-symbols:person w-8 h-8',
    route: 'users',
    label: 'Users',
  },
  {
    icon: 'i-carbon:server-dns w-8 h-8',
    route: 'dns',
    label: 'Domains',
  },
  {
    icon: 'i-simple-icons:tailscale w-7 h-7',
    route: 'headscale-instances',
    label: 'Headscale Instances',
  },
])
const router = useRouter()
onMounted(async () => {
  await getHeadscaleInstances()
  if (active_headscale.value === undefined)
    router.replace({ name: 'headscale-instances' })
})
</script>
