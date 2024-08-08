<template>
  <div class="content-interview">
    <app-toast position="top-right"/>
    <app-card >
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input-text class="input mb-3" placeholder="Компания" v-model="company" />
        <app-input-text
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Описание вакансии (ссылка)"
        />
        <app-input-text v-model="hrName" class="input mb-3" placeholder="Контакт (имя)" />
        <app-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <app-input-text
          v-model="contactWhatsApp"
          class="input mb-3"
          placeholder="WhatsApp телефон HR"
        />
        <app-input-text v-model="contactPhone" class="input mb-3" placeholder="Телефон HR" />
        <app-button
          @click="addNewInterview"
          label="Создать собеседование"
          :disabled="disabledSaveButton"
          :loading="loading"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type {IInterview} from '@/interfaces';
  import  { v4 as uuidv4 } from 'uuid';
  import { getAuth } from 'firebase/auth';
  import { getFirestore, setDoc, doc } from 'firebase/firestore'; // для сохранения в firebase
  import { useRouter } from 'vue-router';
  import { useToast } from 'primevue/usetoast';

  const company = ref<string>('');
  const vacancyLink = ref<string>('');
  const hrName = ref<string>('');
  const contactTelegram = ref<string>('');
  const contactWhatsApp = ref<string>('');
  const contactPhone = ref<string>('');
  const toast = useToast();
  
  const loading = ref<boolean>(false);
  const db = getFirestore();
  const route = useRouter();
  

  const addNewInterview = async(): Promise<void> => {

    loading.value = true;

    const payload: IInterview = {
      id: uuidv4(),
      company: company.value,
      vacancyLink: vacancyLink.value,
      hrName: hrName.value,
      contactTelegram: contactTelegram.value,
      contactWhatsApp: contactWhatsApp.value,
      contactPhone: contactPhone.value,
      createdAt: new Date(),
    }
    //console.log(payload);
    const userId = getAuth().currentUser?.uid // получение пользовтеля. Можно через pinia, можно через firebase, мы делаем через последнее.
    if(userId){
      try{
        await  setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload)
        toast.add({severity: "success", summary: "Success", detail: `Собеседование с id: ${payload.id} сохранено`, life: 3000})  
        route.push('/list')
      }catch(error: unknown){
        if(error instanceof Error){
          toast.add({severity: "error", summary: "Error", detail: error.message, life: 3000})
        }
      }finally{
        loading.value = false;
      }  
    } 
  }

  const disabledSaveButton = computed<boolean>( ()=> {
    return !(company.value && vacancyLink.value && hrName.value)
  })

</script>

<style scoped>

.input{
  width: 100%;
}

.content-interview {
  max-width: 600px;
  margin: auto;
}

</style>