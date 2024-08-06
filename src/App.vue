<template>
  <div class="container">
    <AppHeader></AppHeader>
    <div class="contant">
      <RouterView>
        
      </RouterView>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue';

</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}
</style>
