<script lang="ts" setup>
import { DtoNewStudent, PROGRAM } from "@/@core/types";
import { useStudentStore } from '@/store/useStudentStore';
import { toast } from 'vue3-toastify';
import { VForm } from "vuetify/components/VForm";

const studentStore = useStudentStore();
const { addOne } = studentStore

const router = useRouter()

const refForm = ref<VForm>();
const programItems = [PROGRAM.SMA, PROGRAM.SMC, PROGRAM.SMI, PROGRAM.SMP, PROGRAM.SVT];
const newStudent = ref<DtoNewStudent>({
  code: "",
  programId: PROGRAM.SMA,
  firstName: "",
  lastName: "",
  email: "",
});


const addStudent = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      addOne(newStudent.value).then(() => {
        router.push('/student/list').then(() => {
          toast.success('Student successfully added ✔', {
            "theme": useCookie('EduPayment-theme').value || 'auto'
          })
        })
      }).catch((err) => {
        console.log(err);

        toast.error('Error Student not added 🧨❌', {
          "theme": useCookie('EduPayment-theme').value || 'auto'
        })
      })
    }
  })
}


</script>

<template>
  <v-card>
    <VForm class="pa-6" ref="refForm" @submit.prevent="addStudent">
      <VRow>
        <VCol cols="12" md="6">
          <AppTextField v-model="newStudent.code" label="Code" type="number" placeholder="Your Code" :rules="[requiredValidator]" />
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField v-model="newStudent.firstName" label="FirstName" placeholder="Your FirstName" :rules="[requiredValidator]" />
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField v-model="newStudent.lastName" label="LastName" placeholder="Your LastName" :rules="[requiredValidator]" />
        </VCol>

        <VCol cols="12" md="6">
          <AppTextField v-model="newStudent.email" label="Email" placeholder="Your Email" :rules="[requiredValidator, emailValidator]" />
        </VCol>

        <VCol cols="12" md="6">
          <AppAutocomplete v-model="newStudent.programId" :items="programItems" :rules="[requiredValidator]" placeholder="Your Sector" clearable label="Program" />
        </VCol>

        <VCol cols="12">
          <VBtn type="submit"> Add Student </VBtn>
          <VBtn color="secondary" class="mx-4" type="reset" @click="refForm?.reset()">
            Reset
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </v-card>
</template>
