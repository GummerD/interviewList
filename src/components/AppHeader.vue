<template>
    <app-menubar class="menu" :model="items">
        <template #item="{ item, props }">
            <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
                <span :class="item.icon"></span>
                <span class="ml-2"> {{ item.label }}</span>
            </router-link>
        </template>
    </app-menubar>
</template>

<script setup lang="ts">

import { ref } from 'vue';

interface IMenueItem {
    label: string,
    icon: string,
    path: string
}

const items = ref<IMenueItem[]>([
    {
        label: "Авторизация",
        icon: 'pi pi-user',
        path: '/auth',
    },
    {
        label: "Добавить",
        icon: 'pi pi-plus',
        path: '/add'
    },
    {
        label: "Список собеседований",
        icon: 'pi pi-list',
        path: '/list'
    },
    {
        label: "Статистика",
        icon: 'pi pi-chart-pie',
        path: '/statistic'
    },

])
</script>

<style scoped>
.menu {
    margin: 30px 0;
}

.menu_exit {
    cursor: pointer;
}
</style>