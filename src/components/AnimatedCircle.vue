<template>
  <div class="relative h-2 w-2">
    <span
      class="animate-ping absolute h-full w-full rounded-full opacity-75"
      :class="props.is_positive ? 'bg-[#ade25d]' : 'bg-[#c10015]'"
    >
    </span>
    <span
      class="absolute rounded-full h-2 w-2"
      :class="props.is_positive ? 'bg-[#ade25d]' : 'bg-[#c10015]'"
    >
    </span>
  </div>
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
