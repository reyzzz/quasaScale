<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="save">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{
              props.componentProps.tag_owner.name !== 'tag:'
                ? 'Edit Tag Owners'
                : 'Add Tag Owners'
            }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <p class="text-body2">
          TagOwners in Tailscale is an association between a TAG and the people
          allowed to set this TAG on a server. This is documented
          <a
            href="https://tailscale.com/kb/1068/acl-tags#defining-a-tag"
            target="_blank"
            class="text-primary"
          >
            here
          </a>
          and explained
          <a
            href="https://tailscale.com/blog/rbac-like-it-was-meant-to-be/"
            target="_blank"
            class="text-primary"
          >
            here </a
          >.
        </p>
        <q-input
          outlined
          hide-bottom-space
          v-model="_tag_owner.name"
          label="Tag"
          :rules="[
            (val) => val.length > 4 || 'You need to enter a tag',
            (val) => val.startsWith('tag:') || 'Tag must start with tag:',
            () => checkTagOwnername() || 'Tag name already used',
          ]"
          lazy-rules="ondemand"
        />
        <div class="px-8px py-4px text-subtitle1">Owners:</div>
        <q-list separator bordered class="rounded-xl">
          <template v-for="(value, index) in _tag_owner.value" :key="value">
            <q-item>
              <q-item-section>
                <span class="text-body1 text-info">{{ value }}</span>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  color="negative"
                  flat
                  round
                  dense
                  icon="delete"
                  @click="_tag_owner.value.splice(index, 1)"
                />
              </q-item-section>
            </q-item>
          </template>
          <OwnerSelector
            v-model="_tag_owner.value"
            v-model:is_adding="show_add_card"
            v-if="show_add_card"
          />
        </q-list>
        <div class="row px-12px pt-8px justify-end">
          <q-btn
            flat
            round
            dense
            class="q-mr-xs q-mb-sm"
            :icon="!show_add_card ? 'add' : 'remove'"
            @click="show_add_card = !show_add_card"
          />
        </div>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          color="primary"
          label="save"
          type="submit"
          icon="save"
          rounded
          outline
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
defineOptions({ name: 'tag-owners-dialog' })
import { extend } from 'quasar'
import { RowTagOwner } from 'src/types/Database'
import OwnerSelector from './OwnerSelector.vue'

const props = defineProps<{
  onDialogOK: (tag_owner: RowTagOwner) => void
  componentProps: {
    tag_owner: RowTagOwner
    all_tag_owners: RowTagOwner[]
  }
}>()

const show_add_card = ref(props.componentProps.tag_owner.name === 'tag:')

const _tag_owner = ref<RowTagOwner>(
  extend(true, {}, props.componentProps.tag_owner),
)

function checkTagOwnername() {
  const tag_owner = props.componentProps.all_tag_owners.find(
    (tag_owner) => tag_owner.name === _tag_owner.value.name,
  )
  if (
    tag_owner &&
    _tag_owner.value.name !== props.componentProps.tag_owner.name
  )
    return false

  return true
}

function save() {
  if (_tag_owner.value.value.length === 0) {
    useNotify('Please select at least one group or user', 'warning', 'negative')
    return
  }
  props.onDialogOK(_tag_owner.value)
}
</script>
