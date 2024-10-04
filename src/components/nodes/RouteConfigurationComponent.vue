<template>
  <q-card
    :bordered="$q.screen.gt.xs"
    flat
    style="height: calc(100vh - 314px)"
    class="w-100% rounded-xl! bg-stone-950"
  >
    <q-card-section class="row justify-between items-center q-py-sm">
      <div class="text-h6">
        Routes {{ $q.screen.gt.sm ? 'Management' : '' }}
      </div>
      <div>
        <q-btn icon="close" round flat v-close-popup />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="title-text text-h6 ml-1 mb-2" v-if="exitRoutes.length > 0">
        Exit Nodes
      </div>
      <template v-for="route in exitRoutes" :key="route.id">
        <q-card flat bordered class="rounded-xl q-mb-sm q-mr-xs">
          <q-card-section class="q-py-sm">
            <div class="row justify-between items-center">
              <div class="row items-center gap-4px">
                <AnimatedCircle :is_positive="route.enabled" />{{
                  route.prefix
                }}
              </div>

              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list style="width: max-content">
                    <q-item clickable @click="handleRoute(route)">
                      <q-item-section
                        :class="
                          route.enabled ? 'text-warning' : 'text-positive'
                        "
                      >
                        {{ route.enabled ? 'Disable Route' : 'Enable Route' }}
                      </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item clickable @click="deleteRoute(route.id)">
                      <q-item-section class="text-negative"
                        >Delete Route</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="text-info">
              <span
                class="text-weight-bold text-accent q-mr-xs hover:cursor-pointer"
                >Format:
              </span>
              <span>
                {{ route.format }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
      <div
        v-if="subNetRoutes.length > 0"
        class="title-text text-h6 ml-1 mb-2 mt-4"
      >
        Sub Nets
      </div>
      <q-scroll-area
        :style="{
          height:
            exitRoutes.length > 0
              ? 'calc(100vh - 670px)'
              : 'calc(100vh - 500px)',
        }"
        :visible="false"
        :thumb-style="{ width: '3px', backgroundColor: '#ff8700' }"
      >
        <template v-for="route in subNetRoutes" :key="route.id">
          <q-card flat bordered class="rounded-xl q-mb-sm q-mr-sm">
            <q-card-section class="q-py-sm">
              <div class="row justify-between items-center">
                <div class="row items-center gap-4px">
                  <AnimatedCircle :is_positive="route.enabled" />{{
                    route.prefix
                  }}
                </div>

                <q-btn flat round dense icon="more_vert">
                  <q-menu auto-close>
                    <q-list style="width: max-content">
                      <q-item clickable @click="handleRoute(route)">
                        <q-item-section
                          :class="
                            route.enabled ? 'text-warning' : 'text-positive'
                          "
                        >
                          {{ route.enabled ? 'Disable Route' : 'Enable Route' }}
                        </q-item-section>
                      </q-item>

                      <q-separator />
                      <q-item clickable @click="deleteRoute(route.id)">
                        <q-item-section class="text-negative"
                          >Delete Route</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>

              <div class="text-info">
                <span
                  class="text-weight-bold text-accent q-mr-xs hover:cursor-pointer"
                  >Format:
                </span>
                <span>
                  {{ route.format }}
                </span>
              </div>
            </q-card-section>
          </q-card>
        </template>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { QuasascaleRoute } from 'src/types/Database'
import AnimatedCircle from '../AnimatedCircle.vue'

const { enableRoute, disableRoute, removeRoute, getNodeRoutes } =
  useNodesStore()
const props = defineProps<{
  onDialogOk: () => void
  componentProps: {
    routes: QuasascaleRoute[]
    nodeId: string
  }
}>()

const exitRoutes = ref<QuasascaleRoute[]>([])
const subNetRoutes = ref<QuasascaleRoute[]>([])

async function handleRoute(route: QuasascaleRoute) {
  try {
    if (route.enabled) {
      await disableRoute(route.id)
      route.enabled = false
    } else {
      await enableRoute(route.id)
      route.enabled = true
    }
    useNotify(
      'Route ' + route.enabled ? 'enabled' : 'disabled' + 'successfully',
      'check',
    )
  } catch (error) {
    useNotify(
      'An error has occured while ' + route.enabled
        ? 'disabling'
        : 'enabling' + 'the route',
      'warning',
      'negative',
    )
  }
}

async function deleteRoute(routeId: string) {
  try {
    useDialog()
      .del()
      .onOk(async () => {
        await removeRoute(routeId)
        await getNodeRoutes(props.componentProps.nodeId)
        useNotify('Route deleted successfully', 'check')
      })
  } catch (error) {
    useNotify(
      'An error has occured while deleting this route',
      'warning',
      'negative',
    )
  }
}
onMounted(() => {
  exitRoutes.value = props.componentProps.routes.filter((route) => {
    return route.type === 'Exit node'
  })
  subNetRoutes.value = props.componentProps.routes.filter((route) => {
    return route.type === 'Subnet'
  })
})
</script>
