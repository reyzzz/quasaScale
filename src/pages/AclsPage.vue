<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="groups" label="Groups" />
    <q-tab name="tagOwners" label="Tag Owners" />
    <q-tab name="hosts" label="Hosts" />
    <q-tab name="acls" label="acls" />
  </q-tabs>

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="groups">
      <GroupsComponent />
    </q-tab-panel>
    <q-tab-panel name="tagOwners">
      <TagOwnersComponent />
    </q-tab-panel>
    <q-tab-panel name="hosts">
      <HostsComponent />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts" setup>
import GroupsComponent from 'src/components/acl/groups/GroupsComponent.vue'
import HostsComponent from 'src/components/acl/hosts/HostsComponent.vue'
import TagOwnersComponent from 'src/components/acl/tag-owners/TagOwnersComponent.vue'

const tab = ref('groups')
</script>
