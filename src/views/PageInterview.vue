<template>
    <app-spinner v-if="isLoading"/>
    <div class="content-interview" v-else-if="interview?.id && !isLoading">
        {{ interview  }}
        <app-card>
            <template #title>Собеседование в компанию "{{ interview.company  }}"</template>
            <template #content>
                <div class="flex flex-column gap-2">
                    <lable for="company">Компания</lable>
                    <app-input-text class="input mb-3" id="company" v-model="interview.company"/>
                </div>
                <div class="flex flex-column gap-2">
                    <lable for="vacancyLink">Описание вакансии {ссылка}</lable>
                    <app-input-text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink"/>
                </div>
                <div class="flex flex-column gap-2">
                    <lable for="hrName">Контатк (имя)</lable>
                    <app-input-text class="input mb-3" id="hrName" v-model="interview.hrName" />
                </div>
                <div class="flex flex-column gap-2">
                    <lable for="contactTelegram">Контакт телеграмм HR</lable>
                    <app-input-text class="input mb-3" id="contactTelegram" v-model="interview.contactTelegram"/>
                </div>
                <div class="flex flex-column gap-2">
                    <lable for="contactWhatsApp">Контакт вотсап HR</lable>
                    <app-input-text class="input mb-3" id="contactWhatsApp" v-model="interview.contactWhatsApp"/>
                </div>
                <div class="flex flex-column gap-2">
                    <lable for="contactPhone">Контакт телефон HR</lable>
                    <app-input-text class="input mb-3" id="contactPhone" v-model="interview.contactPhone"/>
                </div>
                <div class="input_bottom">
                    <app-input-number inputId="salaryFrom" placeholder="Зарплатная вилка от:" v-model="interview.salaryFrom"/>
                    <app-input-number inputId="salaryTo" placeholder="Зарплатная вилка до:" v-model="interview.salaryTo"/>   
                </div>
                <app-button class="mb-3" label="Добавить этап" severity="info" icon="pi pi-plus" @click="addStage"/>
                <template v-if="interview.stages">
                    <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
                        <div class="flex flex-column gap-2">
                            <label :for="`stage-name-${index}`">Название этапа</label>
                            <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.stageName"/>
                        </div>
                        <div class="flex flex-column gap-2">
                            <label :for="`stage-calendar-${index}`">Календарь</label>
                            <app-calendar 
                                :id="`stage-calendar-${index}`" 
                                class="input mb-3" 
                                dateFormat="dd.mm.yy" 
                                @date-select="saveDateStage(index)"
                                v-model=" stage.stageCalendar"/>
                        </div>
                        <div class="flex flex-column gap-2">
                            <lable :for="`stage-comments-${index}`">Комментарии</lable>
                            <app-textarea class="input mb-3" :id="`stage-comments-${index}`" rows="5" v-model="stage.stageComments"/>
                        </div>
                        <app-button class="mb-3" label="Удалить этап" icon="pi pi-trash" severity="danger" @click="removeStage(index)"></app-button>
                    </div>
                </template>
                <div class="flex flex-wrap gap-3 mb-3">
                    <div class="flex align-items-center">
                        <app-radiobutton inputId="interviewResult1" name="result" value="Refusal" v-model="interview.result"/>
                        <label class="ml-1" for="interviewResult1">Отказ</label>
                    </div>
                    <div class="flex align-items-center">
                        <app-radiobutton inputId="interviewResult2" name="result" value="Offer" v-model="interview.result"/>
                        <label class="ml-1" for="interviewResult2">Offer</label>
                    </div>
                </div>
                <div>
                    <app-button class="mb-3" label="Сохраниить" icon="pi pi-save" severity="info" @click="saveInterview"></app-button>
                </div>
            </template>
        </app-card>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import {doc, getDoc, updateDoc} from 'firebase/firestore';
    import { useUserStore } from '@/stores/useUserStore';
    import type { IInterview, IStage } from '@/interfaces';
    import { db } from '@/main';
    import dayjs from 'dayjs';

    const interview = ref<IInterview>();
    const route = useRoute();
    const userStore = useUserStore();
    const isLoading = ref<boolean>(true) ;

    const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string);

    const getData = async (): Promise<void> => {
        isLoading.value = true;
        const docSnap = await getDoc(docref);
        interview.value = docSnap.data() as IInterview;
        console.log(interview);
        isLoading.value = false;
    }

    const addStage = () => {
        if(interview.value){
            if(!interview.value.stages){
                interview.value.stages = [];
            }
            interview.value.stages.push({  stageName: '', stageCalendar: '', stageComments:  ''})
        }
    }

    const removeStage = (index: number) => {
        if(interview.value){
            if(interview.value.stages){
                interview.value.stages.splice(index, 1);
            }
            //console.log(interview.value.stages);
        }
    }

    const saveDateStage = (index: number) => {
        if(interview.value?.stages && interview.value.stages.length){
            const date = interview.value.stages[index].stageCalendar
            interview.value.stages[index].stageCalendar = dayjs(date).format('DD.MM.YYYY')
        }
    }

    const saveInterview = async (): Promise<void> => {
        isLoading.value = true;
        
        // приведение даты в удобоворимый вид

        await updateDoc(docref, { ...interview.value} );

        getData();

        isLoading.value = false;
    }

    onMounted( async() => await getData() )


</script>

<style scoped>
    .content-interview {
        max-width: 600px;
        margin: auto;

    }

    .input {
        width: 100%;
    }

    .interview-stage {
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;
    }

    .input_bottom{
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    } 
</style>