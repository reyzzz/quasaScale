<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-dark-header" bordered dark>
      <q-toolbar>
        <q-toolbar-title>QuasaScale</q-toolbar-title>
        <q-btn
          color="blue"
          flat
          round
          outline
          :icon="grid_view ? 'fa-solid fa-list' : 'grid_view'"
          @click="grid_view = !grid_view"
          v-if="$q.screen.gt.xs"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.xs ? true : false"
      v-model="drawer"
      bordered
      mini
      class="bg-dark-header"
      behavior="desktop"
    >
      <q-list>
        <template v-for="(link, index) in linksList" :key="index">
          <q-item clickable v-ripple :to="{ name: link.route }" exact>
            <q-item-section avatar>
              <q-icon :name="link.icon" size="md" />
            </q-item-section>
            <q-item-section class="text-h6">{{ link.label }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-footer
      boredred
      class="q-py-sm iphone-bottom-notch"
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
          :key="link.label"
          :to="{ name: link.route }"
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
import { useQuasar } from 'quasar'
defineOptions({
  name: 'MainLayout',
})

const $q = useQuasar()
const drawer = ref(true)
const { grid_view } = storeToRefs(useSettingsStore())
const linksList = ref([
  {
    icon: 'devices',
    route: 'nodes',
    label: 'Nodes',
  },
  {
    icon: 'person',
    route: 'users',
    label: 'Users',
  },
  {
    icon: 'dns',
    route: 'dns',
    label: 'DNS',
  },
])
</script>
