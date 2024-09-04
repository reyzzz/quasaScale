<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-if="$q.platform.is.desktop"
        />

        <q-toolbar-title> QuasaScale App </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      v-if="$q.platform.is.desktop"
    >
      <q-list>
        <q-item-label header class="text-primary text-h6 title">
          HeadScale
        </q-item-label>
        <template v-for="(link, index) in linksList" :key="index">
          <q-item clickable v-ripple :to="{ name: link.route }">
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
      v-if="$q.platform.is.mobile"
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
defineOptions({
  name: 'MainLayout',
})

const $q = useQuasar()
const leftDrawerOpen = ref(false)
const linksList = ref([
  {
    title: 'User',
    icon: 'person',
    route: 'user',
    label: 'User',
  },
])
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
