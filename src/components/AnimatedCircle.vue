<template>
  <span class="relative flex h-3 w-3">
    <span
      class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
      :class="props.is_positive ? 'bg-[#ade25d]' : 'bg-[#c10015]'"
    >
    </span>
    <span
      class="relative inline-flex rounded-full h-3 w-3"
      :class="props.is_positive ? 'bg-[#ade25d]' : 'bg-[#c10015]'"
    >
    </span>
  </span>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    is_positive?: boolean
  }>(),
  {
    is_positive: true,
  },
)
</script>
