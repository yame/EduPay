  
  <script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import { router } from '@/plugins/3.router';
import { usePaymentStore } from '@/store/usePaymentStore';
import pdf from '@jbtje/vite-vue3pdf';
import { toast } from 'vue3-toastify';
const paymentStore = usePaymentStore()
const { currentPayment } = storeToRefs(paymentStore)
const route = useRoute();
const currPayment = ref<Payment>({
  id: route.params?.id,
  receipt: "",
  amount: 0,
  date: new Date(),
  type: PAYMENT_TYPE.CASH,
  status: PAYMENT_STATUS.CREATED,
  addedBy: "",
  studentCode: ''
})

const statusItems = ref([
  { title: PAYMENT_STATUS.CREATED, value: PAYMENT_STATUS.CREATED },
  { title: PAYMENT_STATUS.REJECTED, value: PAYMENT_STATUS.REJECTED },
  { title: PAYMENT_STATUS.VALIDATED, value: PAYMENT_STATUS.VALIDATED },
])
//👉 - methodes
const resolveStatusColor = (status: string) => {
  if (status === PAYMENT_STATUS.CREATED)
    return { text: PAYMENT_STATUS.CREATED, color: 'primary', icon: 'tabler-check' }
  if (status === PAYMENT_STATUS.REJECTED)
    return { text: PAYMENT_STATUS.REJECTED, color: 'error', icon: 'tabler-ban' }
  if (status === PAYMENT_STATUS.VALIDATED)
    return { text: PAYMENT_STATUS.VALIDATED, color: 'success', icon: 'tabler-checks' }
}

//👉 -Handle url for pdf 
const currentPaymentPdfUrl = ref(null)
const currentPage = ref(0)
const pageCount = ref(0)
usePaymentStore().getPaymentFile(route.params.id).then(response => {
  const url = URL.createObjectURL(new Blob([response?.data], { type: 'application/pdf' }));
  currentPaymentPdfUrl.value = url
})

usePaymentStore().getPaymentById(route.params.id).then(() => {
  currPayment.value = currentPayment.value
})




const updatePayment = () => {
  console.log(currPayment.value.status);

  usePaymentStore().updateOne(route.params?.id, currPayment.value.status).then(() => {
    router.push('/').then(() => {
      toast.success('Paymant successfully Updated ⚡✔', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    })
  })
}

</script>
<template>

  <VCard class="pa-sm-10 pa-2" v-if="currentPayment">
    <VCardText>
      <!-- 👉 Title -->
      <h4 class="text-h4 text-center mb-2">
        New Payment Added Details
      </h4>
      <p class="text-body-1 text-center mb-6">
        NOTE : Update the status of this payment
      </p>

      <!-- 👉 Form -->
      <VForm class="mt-6">
        <VRow>
          <!-- 👉 Student Code -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currPayment.id" label="Student Code" :disabled="true" :readonly="true" />
          </VCol>

          <!-- 👉 Amount -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currPayment.amount" type="number" label="Amount" placeholder="Amount" :readonly="true" />
          </VCol>

          <!-- 👉 Payment Type -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currPayment.type" label="Type" placeholder="Type" :readonly="true" />
          </VCol>

          <!-- 👉 Payment Status -->
          <VCol cols="12" md="6">
            <AppSelect :rules="[requiredValidator]" v-model="currPayment.status" label="Status" placeholder="Status" :items="statusItems" item-title="title" item-value="value">
              <template #selection="{ item }">
                <VChip :color="resolveStatusColor(item.title)?.color">
                  <template #prepend>
                    <VIcon>
                      {{ resolveStatusColor(item.title)?.icon }}
                    </VIcon>
                  </template>
                  <span class="ml-1">{{ resolveStatusColor(item.title)?.text }}</span>
                </VChip>
              </template>
            </AppSelect>
          </VCol>

          <!-- 👉 Payment addedBy -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currPayment.addedBy" label="Added By" placeholder="Added By" :readonly="true" />
          </VCol>

          <!-- 👉 Payment Date -->
          <VCol cols="12" md="6">
            <AppDateTimePicker v-model="currPayment.date" label="Date" placeholder="Select date of your payment" :readonly="true" />
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
            <v-btn color="warning" @click="updatePayment">Update Payment</v-btn>

          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style>
</style>
