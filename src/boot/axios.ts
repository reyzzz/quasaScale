import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import AnimatedCircle from 'src/components/AnimatedCircle.vue'
import 'uno.css'
declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create()
export default boot(async ({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const { active_headscale } = storeToRefs(useHeadscaleInstancesStore())
  const { getHeadscaleInstances } = useHeadscaleInstancesStore()
  await getHeadscaleInstances()
  watch(
    active_headscale,
    (newConfig) => {
      if (newConfig) {
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newConfig.headscale_api_key || ''}`
        api.defaults.baseURL = newConfig.quasascale_backend_url
      }
    },
    { immediate: true, deep: true },
  )
  app.component('animated-circle', AnimatedCircle)
  //app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  //app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
