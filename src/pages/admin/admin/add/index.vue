<script lang="ts" setup>
import { DEPARTMENT_ITEMS, DEPARTMENT_NAME, DtoNewAdmin } from "@/@core/types";
import { useAdminStore } from "@/store/useAdminStore";
import { toast } from 'vue3-toastify';
import { VForm } from "vuetify/components/VForm";

const adminStore = useAdminStore();
const { addOne } = adminStore

const router = useRouter()

const refForm = ref<VForm>();
const newAdmin = ref<DtoNewAdmin>({
  firstName: "",
  lastName: "",
  email: "",
  departmentName: DEPARTMENT_NAME.INFORMATICS
});


const addAdmin = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      addOne(newAdmin.value).then(() => {
        router.push('/admin/admin/list').then(() => {
          toast.success('Admin successfully added ✔', {
            "theme": useCookie('EduPayment-theme').value || 'auto'
          })
        })
      }).catch((err) => {
        toast.error('Error Admin not added 🧨❌', {
          "theme": useCookie('EduPayment-theme').value || 'auto'
        })
      })
    }
  })
}


</script>

<template>
  <v-card>
    <VCardTitle class="pa-5 text-h4">
      Admin Enrollment Form :
    </VCardTitle>
    <VForm class="pt-0 px-5 pb-5" ref="refForm" @submit.prevent="addAdmin">
      <VRow>
        <VCol cols="12" md="6">
          <AppTextField v-model="newAdmin.firstName" label="FirstName" placeholder="Your FirstName" :rules="[requiredValidator]" />
        </VCol>

        <VCol cols="12" md="6">
          <AppTextField v-model="newAdmin.lastName" label="FirstName" placeholder="Your LastName" :rules="[requiredValidator]" />
        </VCol>

        <VCol cols="12" md="6">
          <AppTextField v-model="newAdmin.email" label="Email" placeholder="Your Email" :rules="[requiredValidator]" />
        </VCol>

        <VCol cols="12" md="6">
          <AppAutocomplete v-model="newAdmin.departmentName" :items="DEPARTMENT_ITEMS" :rules="[requiredValidator]" placeholder="Your Sector" clearable label="Program" />
        </VCol>

        <VCol cols="12">
          <VBtn type="submit"> Add Admin </VBtn>
          <VBtn color="secondary" class="mx-4" type="reset" @click="refForm?.reset()">
            Reset
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </v-card>
</template>
