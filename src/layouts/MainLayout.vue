<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      reveal
      :reveal-offset="100"
      :class="$q.dark.isActive ? 'bg-dark-header' : 'bg-primary'"
      class="text-white q-py-xs q-mb-xs row justify-between"
    >
      <div>
        <TeleportTarget
          id="target"
          class="q-toolbar row no-wrap items-center"
          role="toolbar"
        />
      </div>

      <q-btn
        color="blue"
        size="md"
        flat
        round
        outline
        :icon="grid_view ? 'fa-solid fa-list' : 'grid_view'"
        @click="grid_view = !grid_view"
      />
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.sm ? true : false"
      v-model="drawer"
      show-if-above
      :width="250"
      :class="$q.dark.isActive ? 'bg-dark-header' : 'bg-blue-grey-1'"
    >
      <div
        class="row q-py-sm q-px-md items-center text-h5 text-purple-14 text-bold"
      >
        <q-icon name="tap_and_play" />
        <span class="q-ml-md">HeadScale</span>
      </div>
      <q-list>
        <template v-for="(link, index) in linksList" :key="index">
          <q-item
            clickable
            v-ripple
            :to="{ name: link.route }"
            exact
            class="q-mx-md"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" size="md" />
            </q-item-section>
            <q-item-section class="text-h6">{{ link.label }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>
    <q-footer
      class="bg-white footer-top-border q-py-sm iphone-bottom-notch"
      v-if="$q.screen.lt.sm"
    >
      <q-tabs
        no-caps
        dense
        indicator-color="transparent"
        :active-color="$q.dark.isActive ? 'white' : 'black'"
        :class="$q.dark.isActive ? 'text-dark-primary' : 'text-blue-grey-7'"
        align="justify"
      >
        <q-route-tab
          v-for="link in linksList"
          :key="link.title"
          :to="{ name: link.route }"
          :name="link.title"
          :icon="link.icon"
          :label="link.label"
          active-class="text-primary"
          :ripple="false"
        />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings-store'
import { storeToRefs } from 'pinia'
defineOptions({
  name: 'MainLayout',
})

const $q = useQuasar()
const drawer = ref(true)
const { grid_view } = storeToRefs(useSettingsStore())
const linksList = ref([
  {
    title: 'Nodes',
    icon: 'devices',
    route: 'nodes',
    label: 'Nodes',
  },
  {
    title: 'Users',
    icon: 'person',
    route: 'users',
    label: 'User',
  },
  {
    title: 'DNS',
    icon: 'dns',
    route: 'dns',
    label: 'DNS',
  },
])
</script>
