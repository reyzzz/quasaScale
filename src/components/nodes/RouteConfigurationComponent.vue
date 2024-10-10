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
      <div
        class="title-text text-h6 ml-1 mb-2"
        v-if="exitRoutes.IP_v4 !== undefined && exitRoutes.IP_v6 !== undefined"
      >
        Exit Nodes
      </div>
      <q-list
        separator
        bordered
        class="rounded-xl"
        v-if="exitRoutes.IP_v4 !== undefined && exitRoutes.IP_v6 !== undefined"
      >
        <q-item>
          <q-item-section side>
            <animated-circle :is_positive="exitRoutes.IP_v4.enabled" />
          </q-item-section>
          <q-item-section>
            <div>{{ exitRoutes.IP_v4.prefix }}</div>
            <div>{{ exitRoutes.IP_v6.prefix }}</div>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <q-btn
                :color="exitRoutes.IP_v4.enabled ? 'warning' : 'positive '"
                :icon="exitRoutes.IP_v4.enabled ? 'power_off' : 'power'"
                @click="handleRoute(exitRoutes.IP_v4)"
                dense
                round
                flat
              >
                <q-tooltip>{{
                  exitRoutes.IP_v4.enabled ? 'Disable Route' : 'Enable Route'
                }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="deleteRoute(exitRoutes.IP_v4.id)"
                icon="delete"
                color="negative"
                dense
                flat
                round
              >
                <q-tooltip>Delete Route</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div
        v-if="subNetRoutes.length > 0"
        class="title-text text-h6 ml-1 mb-2 mt-4"
      >
        Sub Nets
      </div>
      <q-scroll-area
        :style="{
          height:
            exitRoutes.IP_v4 !== undefined
              ? 'calc(100vh - 670px)'
              : 'calc(100vh - 500px)',
        }"
        :visible="false"
        :thumb-style="{ width: '3px', backgroundColor: '#ff8700' }"
      >
        <q-list
          separator
          bordered
          class="rounded-xl"
          v-if="subNetRoutes.length > 0"
        >
          <template v-for="route in subNetRoutes" :key="route.id">
            <q-item>
              <q-item-section side>
                <animated-circle :is_positive="route.enabled" />
              </q-item-section>
              <q-item-section>
                {{ route.prefix }}
              </q-item-section>
              <q-item-section side>
                <div class="row items-center">
                  <q-btn
                    :color="route.enabled ? 'warning' : 'positive'"
                    :icon="route.enabled ? 'power_off' : 'power'"
                    @click="handleRoute(route)"
                    dense
                    round
                    flat
                  >
                    <q-tooltip>{{
                      route ? 'Disable Route' : 'Enable Route'
                    }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    @click="deleteRoute(route.id)"
                    icon="delete"
                    color="negative"
                    dense
                    flat
                    round
                  >
                    <q-tooltip>Delete Route</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { QuasascaleRoute } from 'src/types/Database'
defineOptions({ name: 'routes-dialog' })
const { enableRoute, disableRoute, removeRoute, getNodeRoutes } =
  useNodesStore()
const props = defineProps<{
  componentProps: {
    routes: QuasascaleRoute[]
    nodeId: string
  }
}>()

const exitRoutes = ref<
  Partial<{
    IP_v4: QuasascaleRoute
    IP_v6: QuasascaleRoute
  }>
>({})
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
      `Route ${route.enabled ? 'enabled' : 'disabled'}  successfully`,
      'check',
    )
  } catch {}
}

async function deleteRoute(routeId: string) {
  try {
    useDialog()
      .del()
      .onOk(async () => {
        await removeRoute(routeId)
        await getNodeRoutes(props.componentProps.nodeId)
        seperateRoutesByType()
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
  seperateRoutesByType()
})

function seperateRoutesByType() {
  const exitRouteArray = props.componentProps.routes.filter((route) => {
    return route.type === 'Exit node'
  })
  if (exitRouteArray.length > 0) {
    if (exitRouteArray[0].prefix === '::/0') {
      exitRoutes.value.IP_v6 = exitRouteArray[0]
      exitRoutes.value.IP_v4 = exitRouteArray[1]
    } else {
      exitRoutes.value.IP_v6 = exitRouteArray[1]
      exitRoutes.value.IP_v4 = exitRouteArray[0]
    }
  }
  subNetRoutes.value = props.componentProps.routes.filter((route) => {
    return route.type === 'Subnet'
  })
}
</script>
