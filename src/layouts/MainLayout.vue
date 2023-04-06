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
  padding: 20px;
  background: rgb(251, 203, 103);
  background: linear-gradient(135deg, rgba(251, 203, 103, 1) 0%, rgba(0, 145, 145, 1) 50%, rgba(235, 97, 97, 1) 100%);
}
</style>
