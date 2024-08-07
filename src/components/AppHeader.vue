<template>
    {{ userStore.userId }}
    <app-menubar class="menu" :model="items">
        <template #item="{ item, props }">
            <template v-if="item.show">
                <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
                    <span :class="item.icon"></span>
                    <span class="ml-2"> {{ item.label }}</span>
                </router-link>
            </template>
        </template>
        <template #end>
            <span 
                v-if="userStore.userId" 
                class="flex align-item-center menu_exit"
                @click="siginOutMethod"
                >
                <span class="pi pi-sign-out p-p-menuitem-icon"></span>
                <span class="ml-2">Выход</span>
            </span>
        </template>
    </app-menubar>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import type { ComputedRef } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

interface IMenueItem {
    label: string,
    icon: string,
    path: string,
    show: ComputedRef<boolean>
}

const items = ref<IMenueItem[]>([
    {
        label: "Авторизация",
        icon: 'pi pi-user',
        path: '/auth',
        show: computed((): boolean => !userStore.userId)
    },
    {
        label: "Добавить",
        icon: 'pi pi-plus',
        path: '/add',
        show: computed((): boolean => !!userStore.userId)
    },
    {
        label: "Список собеседований",
        icon: 'pi pi-list',
        path: '/list',
        show: computed((): boolean => !!userStore.userId)
    },
    {
        label: "Статистика",
        icon: 'pi pi-chart-pie',
        path: '/statistic',
        show: computed((): boolean => !!userStore.userId)
    },

])

const siginOutMethod = async (): Promise<void> => {
    await signOut(getAuth());
    router.push('/auth');
}

</script>

<style scoped>
.menu {
    margin: 30px 0;
}

.menu_exit {
    cursor: pointer;
}
</style>