<template>
  <app-spinner v-if="isLoading"/>
  <div v-else class="container">
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
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './stores/useUserStore';

const userStore = useUserStore();

const isLoading = ref<boolean>(true)

onMounted(()=>{
  onAuthStateChanged(getAuth(), (user) => {
    if (user){
      userStore.userId = user.uid;
    }else{
      userStore.userId = '';
    }
    isLoading.value = false
  })
})

</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}
</style>
