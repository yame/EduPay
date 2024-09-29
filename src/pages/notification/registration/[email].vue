  
  <script setup lang="ts">
import { PROGRAM, Student } from '@/@core/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useStudentStore } from '@/store/useStudentStore';
import { toast } from 'vue3-toastify';



const authStore = useAuthStore()
const { approveRegistration, declineRegistration, banRegistration } = authStore

const route = useRoute();
const router = useRouter();
const currentStudent = ref<Student>({
  email: route.params.email,
  code: "",
  firstName: "",
  lastName: "",
  programID: PROGRAM.SMA,
  registerDate: ""
})


const approve = () => {
  approveRegistration(currentStudent.value.email).then(() => router.push('/').then(() => {
    toast.success('Registration was approved ✔', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }))
}

const decline = () => {
  declineRegistration(currentStudent.value.email).then(() => router.push('/').then(() => {
    toast.warning('Registration was declined ✔', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }))
}

const ban = () => {
  banRegistration(currentStudent.value.email).then(() => router.push('/').then(() => {
    toast.error('Registration was banned ✔', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }))
}



useStudentStore().getPendingStudentsByEmail(route.params.email).then(res => {
  currentStudent.value = res.data.value;
})


watch(() => route.params.email, (newValue) => {
  useStudentStore().getPendingStudentsByEmail(newValue).then(res => {
    currentStudent.value = res.data.value;
  })
})

// watch(() => currentStudent, (newValue) => {
//   useStudentStore().getPendingStudentsByEmail(route.params.email).then(res => {
//     currentStudent.value = res.data.value;
//   })
// })

</script>
<template>

  <VCard class="pa-sm-10 pa-2" v-if="currentStudent">
    <VCardText>
      <!-- 👉 Title -->
      <h4 class="text-h4 text-center mb-2">
        New Registration Added Details
      </h4>
      <p class="text-body-1 text-center mb-6">
        Updating user details will receive a privacy audit.
      </p>

      <!-- 👉 Form -->
      <VForm class="mt-6">
        <VRow>
          <!-- 👉 Student Code -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currentStudent.email" label="email" :disabled="true" :readonly="true" />
          </VCol>

          <!-- 👉 Student Code -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currentStudent.code" label="Student Code" placeholder="Student Code" :readonly="true" />
          </VCol>

          <!-- 👉 Student First Name -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currentStudent.firstName" label="First Name" placeholder="First Name" :readonly="true" />
          </VCol>

          <!-- 👉 Student Last Name -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currentStudent.lastName" label="Last Name" placeholder="Last Name" :readonly="true" />
          </VCol>

          <!-- 👉 Student program -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currentStudent.programID" label="Program Id" placeholder="Program Id" :readonly="true" />
          </VCol>

          <!-- 👉 Student Date -->
          <VCol cols="12" md="6">
            <AppDateTimePicker v-model="currentStudent.registerDate" label="RegisterDate" placeholder="RegisterDate" :readonly="true" />
          </VCol>

          <!-- 👉 Submit and Cancel -->
          <VCol cols="12" class="d-flex flex-wrap justify-center gap-4 mt-5">
            <VBtn color="success" prepend-icon="tabler-check" @click="approve">
              <v-tooltip top activator="parent">
                Approve Registration
              </v-tooltip>
              Approve
            </VBtn>
            <VBtn color="warning" prepend-icon="tabler-x" @click="decline">
              <v-tooltip top activator="parent">
                Decline Registration
              </v-tooltip>
              Decline
            </VBtn>
            <VBtn color="error" prepend-icon="tabler-ban" @click="ban">
              <v-tooltip top activator="parent">
                Ban Registration
              </v-tooltip>
              Ban
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style>
</style>
