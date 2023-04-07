<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.q-page-container {
  background: rgb(251, 203, 103);
  background: linear-gradient(135deg, rgba(251, 203, 103, 0.7) 0%, rgba(0, 145, 145, 0.7) 50%, rgba(235, 97, 97, 0.7) 100%);
}
</style>
