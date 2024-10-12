<template>
  <q-page>
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
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel class="p-8px sm:p-16px" name="groups">
        <GroupsComponent />
      </q-tab-panel>
      <q-tab-panel class="p-8px sm:p-16px" name="tagOwners">
        <TagOwnersComponent />
      </q-tab-panel>
      <q-tab-panel class="p-8px sm:p-16px" name="hosts">
        <HostsComponent />
      </q-tab-panel>
      <q-tab-panel class="p-8px sm:p-16px" name="acls">
        <AclsComponent />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script lang="ts" setup>
import AclsComponent from 'src/components/acl/acls/AclsComponent.vue'
import GroupsComponent from 'src/components/acl/groups/GroupsComponent.vue'
import HostsComponent from 'src/components/acl/hosts/HostsComponent.vue'
import TagOwnersComponent from 'src/components/acl/tag-owners/TagOwnersComponent.vue'

const tab = ref('groups')
const { getACL } = useAclsStore()
onMounted(async () => {
  await getACL()
})
</script>
