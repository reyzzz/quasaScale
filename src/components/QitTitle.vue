<template>
  <slot name="left" />

  <q-toolbar-title>{{ title }}</q-toolbar-title>

  <slot name="right" />
</template>

<script setup lang="ts">
defineProps<{
  title: string | null | undefined
}>()
</script>
