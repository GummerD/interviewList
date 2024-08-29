<template>
    <app-confirm-dialog/>
    <app-spinner v-if="!isLoading" />
    <app-message 
        v-if="!interviews.length"
        severity="info"
    > Собеседований пока нет...</app-message>
    <div v-else>
        <h1>Список собеседований:</h1>
        <app-table :value="interviews" tableStyle="min-width: 50rem" v-if="isLoading">
            <app-column field="company" header="Company"></app-column>
            <app-column field="vacancyLink" header="VacancyLink">
                <template #body="slotProps">
                    <a :href="slotProps.data.vacancyLink" target="_blank">Ссылка на вакансию</a>
                </template>
            </app-column>
            <app-column field="hrName" header="HrName"></app-column>
            <app-column header="Пройденные этапы">
                <template #body="slotProps">
                    <span v-if="!slotProps.data.stages">Пройденных этапов нет</span>
                    <div class="flex gap-1" v-else>
                        <app-badge 
                            v-for="(stage, index) in slotProps.data.stages" 
                            :key="index" 
                            :value="index+1"
                            rounded
                            v-tooltip.top="stage.stageName"
                            ></app-badge>
                    </div> 
                </template>
            </app-column>
            <app-column header="Зарплатная вилка">
                <template #body="slotProps">
                    <span v-if="!slotProps.data.salaryFrom">Зарплатная вилка не указана</span>
                    <span v-else>{{slotProps.data.salaryFrom}} - {{slotProps.data.salaryTo}} </span>
                </template>
            </app-column>
            <app-column header="Контаткты" class="contacts">
                <template #body="slotProps" >
                    <div class="contacts">
                        <a 
                            :href="`http://t.me/${slotProps.data.contactTelegram}`" 
                            v-if="slotProps.data.contactTelegram" 
                            target="_blank"
                            class="contacts__telegram"
                            >
                            <span class="contacts__icon pi pi-telegram"></span>
                        </a>
                        <a 
                            :href="`https://wa.me/${slotProps.data.contactWhatsApp}`" 
                            v-if="slotProps.data.contactWhatsApp" 
                            target="_blank"
                            class="contacts__whatsapp"
                            >
                            <span class="contacts__icon pi pi-whatsapp"></span>
                        </a>
                        <a 
                            :href="`tel:${slotProps.data.contactPhone}`" 
                            v-if="slotProps.data.contactPhone" 
                            target="_blank"
                            class="contacts__phone"
                            >
                            <span class="contacts__icon pi pi-phone"></span>
                        </a>
                    </div>
                </template>
            </app-column>
            <app-column header="Результат">
                <template #body="slotProps">
                    <!-- Проверенный вариант разметки,который работает, можно еще через b
                    <span v-if="!slotProps.data.result">Результат пока нет</span>
                    <span v-else-if="slotProps.data.result == 'Offer'" style="color: green">{{slotProps.data.result}}</span>
                    <span v-else style="color: red">Отказ</span>
                    -->
                    <span v-if="!slotProps.data.result">Результат пока нет</span>
                    <template v-else>
                        <app-badge
                            :severity="slotProps.data.result === 'Offer' ?  'success': 'danger'"
                            :value="slotProps.data.result === 'Offer' ? 'Offer': 'Отказ'"
                        />
                    </template>
                </template>
            </app-column>
            <app-column>
                <template #body="slotProps" >
                    <div class="flex gap-2">
                        <router-link :to="`/interview/${slotProps.data.id}`">
                        <app-button icon="pi pi-pencil" severity="info"></app-button>
                        </router-link>
                        <app-button 
                            icon="pi pi-trash" 
                            severity="danger" 
                            @click="deleteInterview(slotProps.data.id)"></app-button>
                    </div>
                </template>
            </app-column>
        </app-table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    collection,
    query,
    orderBy,
    getDocs,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { useUserStore } from '@/stores/useUserStore';
import { db } from '@/main';
import type { IInterview } from '@/interfaces';
import { useConfirm } from 'primevue/useconfirm';

const userStore = useUserStore();
const userId = userStore.userId;

const interviews = ref<IInterview[]>([]);
const isLoading = ref<boolean>(true);

const confirm = useConfirm();

const getAllinterviews = async <T extends IInterview>(): Promise<T[]> => {
    // формируем запрос серверу с уже необходимыми параметрами:
    const getData = query(collection(db, `users/${userId}/interviews`), orderBy('createdAt', 'desc'));

    // отправляем запрос серверу с сформированным запросом:
    const listDocs = await getDocs(getData);

    //console.log(listDocs);
    // Полученная коллекция своеобразная ее необходимо правильно получить:
    return listDocs.docs.map((doc) => doc.data() as T)
}



const deleteInterview = async (id: string): Promise<void> => {
    confirm.require({
        message: 'Вы хотите удлить собеседование?',
        header: 'Удалить собеседование',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Отмена',
        acceptLabel: 'Удалить',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async ()=> {
            isLoading.value = false;
            await deleteDoc(doc(db, `users/${userId}/interviews`, id));

            const listInterviews: Array<IInterview> = await getAllinterviews();
            interviews.value = [...listInterviews];

            isLoading.value = true;
        }
    })
    //await 
}

onMounted(async () => {
    const listInterviews: Array<IInterview> = await getAllinterviews();
    //console.log(listInterviews);
    interviews.value = [...listInterviews];

    isLoading.value = true;
});

</script>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}

</style>