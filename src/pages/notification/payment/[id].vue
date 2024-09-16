  
  <script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import { usePaymentStore } from '@/store/usePaymentStore';
import pdf from '@jbtje/vite-vue3pdf';

const route = useRoute();
const currentPayment = ref<Payment>({
  id: route.params?.id,
  receipt: "",
  amount: 0,
  date: new Date(),
  type: PAYMENT_TYPE.CASH,
  status: PAYMENT_STATUS.CREATED,
  addedBy: "",
  studentCode: ''

})



//👉 -Handle url for pdf 
const currentPaymentPdfUrl = ref(null)
const currentPage = ref(0)
const pageCount = ref(0)
usePaymentStore().getPaymentFile(currentPayment.id).then(response => {
  const url = URL.createObjectURL(new Blob([response?.data], { type: 'application/pdf' }));
  currentPaymentPdfUrl.value = url
})



  </script>
<template>
  {{route.params.id}}

  <VCard class="pa-sm-10 pa-2">
    <VCardText>
      <!-- 👉 Title -->
      <h4 class="text-h4 text-center mb-2">
        New Payment Added Details
      </h4>
      <p class="text-body-1 text-center mb-6">
        Updating user details will receive a privacy audit.
      </p>

      <!-- 👉 Form -->
      <VForm class="mt-6">
        <VRow>
          <!-- 👉 Student Code -->
          <VCol cols="12" md="6">
            <AppTextField :rules="[requiredValidator]" v-model="currentPayment.studentCode" label="Student Code" :disabled="true" readonly="true" />
          </VCol>

          <!-- 👉 Amount -->
          <VCol cols="12" md="6">
            <AppTextField :rules="[requiredValidator]" v-model="currentPayment.amount" type="number" label="Amount" placeholder="Amount" readonly="true" />
          </VCol>

          <!-- 👉 Payment Type -->
          <VCol cols="12" md="6">
            <AppTextField :rules="[requiredValidator]" v-model="currentPayment.type" label="Type" placeholder="Type" readonly="true" />
          </VCol>

          <!-- 👉 Payment Type -->
          <VCol cols="12" md="6">
            <AppTextField :rules="[requiredValidator]" v-model="currentPayment.status" label="Status" placeholder="Status" readonly="true" />
          </VCol>

          <!-- 👉 Payment Type -->
          <VCol cols="12" md="6">
            <AppTextField :rules="[requiredValidator]" v-model="currentPayment.addedBy" label="Added By" placeholder="Added By" readonly="true" />
          </VCol>

          <!-- 👉 Payment Date -->
          <VCol cols="12" md="6">
            <AppDateTimePicker :rules="[requiredValidator]" v-model="currentPayment.date" label="Date" placeholder="Select date of your payment" readonly="true" />
          </VCol>

          <!-- 👉 Receipt -->
          <VCol cols="12" md="12">
            <pdf v-if="currentPaymentPdfUrl" :src="currentPaymentPdfUrl" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"></pdf>
          </VCol>

          <!-- 👉 Submit and Cancel -->
          <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
            <RouterLink to="/">
              <v-btn color="primary">Back To Dashboard</v-btn>
            </RouterLink>

          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style>
</style>
