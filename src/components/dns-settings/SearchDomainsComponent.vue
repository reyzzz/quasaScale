<template>
  <q-card flat bordered class="rounded-xl">
    <q-form @submit="updateDomains">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6 q-mb-sm title-text">Search Domains</div>
          <div>
            <q-btn
              flat
              round
              dense
              class="q-mr-md"
              color="secondary"
              v-if="showDomainsSave"
              @click="undoDomainsChanges"
              icon="undo"
            />
            <q-btn
              flat
              round
              dense
              color="positive"
              v-if="showDomainsSave"
              type="submit"
              icon="save"
            />
          </div>
        </div>

        <div class="text-info">
          Set custom DNS search domains for your Tailnet. When using Magic DNS,
          your tailnet domain is used as the first search domain
        </div>
        <q-list separator bordered class="rounded-xl q-mt-sm">
          <q-item>
            <q-item-section class="text-info text-body1">{{
              tailnetName
            }}</q-item-section>
            <q-item-section avatar>
              <q-icon name="lock" color="primary" />
            </q-item-section>
          </q-item>
          <template v-for="(domain, index) in domains" :key="index">
            <q-item>
              <q-item-section class="text-info text-body1">
                <q-input
                  v-model="domain.name"
                  borderless
                  v-if="!domain.old"
                  hide-bottom-space
                  no-error-icon
                  :rules="[(val) => !!val || 'Field required']"
                  dense
                  placeholder="Enter domain name here"
                />
                <span v-else>
                  {{ domain.name }}
                </span></q-item-section
              >

              <q-btn
                color="negative"
                dense
                class="absolute top-2 right-3"
                size="md"
                flat
                icon="delete"
                round
                @click="domains.splice(index, 1)"
              />
            </q-item>
          </template>
        </q-list>
        <div class="row px-12px pt-8px justify-end">
          <q-btn flat round dense icon="add" @click="addDomain" />
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
const { updateDomains, undoDomainsChanges, addDomain } = useDnsSettingsStore()
const { showDomainsSave, tailnetName, domains } = storeToRefs(
  useDnsSettingsStore(),
)
</script>
