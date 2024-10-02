  
  <script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useStudentStore } from '@/store/useStudentStore';
import pdf from '@jbtje/vite-vue3pdf';
import { toast } from 'vue3-toastify';

const paymentStore = usePaymentStore()
const { currentPayment, loading } = storeToRefs(paymentStore)

const studentStore = useStudentStore()
const { generateReceiptPayment } = (studentStore)

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
const isStatusChanged = ref(false)

const router = useRouter()

usePaymentStore().getPaymentFile(route.params.id).then(response => {
  const url = URL.createObjectURL(new Blob([response?.data], { type: 'application/pdf' }));
  currentPaymentPdfUrl.value = url
})

usePaymentStore().getPaymentById(route.params.id).then(() => {
  currPayment.value = currentPayment.value
  if (currPayment.value.status !== PAYMENT_STATUS.VALIDATED)
    toast.info('You cannot download your receipt at this time. Please contact your administration for further assistance.');
})


watch(() => route.params.id, (newValue) => {
  usePaymentStore().getPaymentFile(newValue).then(response => {
    const url = URL.createObjectURL(new Blob([response?.data], { type: 'application/pdf' }));
    currentPaymentPdfUrl.value = url
  })
  usePaymentStore().getPaymentById(newValue).then(() => {
    currPayment.value = currentPayment.value
    if (currPayment.value.status !== PAYMENT_STATUS.VALIDATED)
      toast.info('You cannot download your receipt at this time. Please contact your administration for further assistance.');
  })
})

//👉 - Prevent updating a new Payment until status chande to rejected or validated
watch(() => currentPayment.value?.status, (newStatus) => {
  if (newStatus !== PAYMENT_STATUS.CREATED)
    isStatusChanged.value = true
  else
    isStatusChanged.value = false

})

const isDownloaded = ref(false)
const downloadReceipt = () => {
  generateReceiptPayment(route.params.id).then(response => {
    console.log(response);
    if (response.status === 200) {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Extract filename from Content-Disposition header
      let filename = 'download.pdf';

      const contentDisposition = response.headers['content-disposition'];
      console.warn('Content-Disposition:', contentDisposition);
      if (contentDisposition) {
        const matches = /filename[^=\n]*=(.*?)(;|$)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].trim().replace(/['"]/g, '');
        }
      }

      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setTimeout(() => {
        isDownloaded.value = true
      }, 3000);

    }
  })
}

watch(isDownloaded, (newValue) => {
  router.push('/student/payments-student').then(() => {
    toast.success('Receipt successfully downloaded ✔', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  })
})

definePage({
  meta: {
    action: 'manage',
    subject: 'STUDENT'
  }
})


</script>
<template>

  <VCard class="pa-sm-10 pa-2" v-if="currentPayment">
    <VCardText>
      <!-- 👉 Title -->
      <h4 class="text-h4 text-center mb-2">
        Your Payment Details
      </h4>
      <p class="text-body-1 text-center mb-6">
        NOTE!! : You Cannot Update the status of your payment
      </p>

      <!-- 👉 Form -->
      <VForm class="mt-6">
        <VRow>
          <!-- 👉 Id Payment -->
          <VCol cols="12" md="6">
            <AppTextField v-model="currPayment.id" label="Id Payment" :disabled="true" :readonly="true" />
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
            <AppSelect :rules="[requiredValidator]" v-model="currPayment.status" label="Status" :readonly="true" placeholder="Status" :items="statusItems" item-title="title" item-value="value">
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

          <VRow class="justify-center">
            <!-- 👉 Receipt -->
            <VCol cols="12" md="6">
              <pdf v-if="currentPaymentPdfUrl && !loading" :src="currentPaymentPdfUrl" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"></pdf>
              <VCol v-else cols="12" md="12">
                <VSkeletonLoader type="image" max-width="1800" />
              </VCol>
            </VCol>

          </VRow>

          <!-- 👉 Submit and Cancel -->
          <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
            <RouterLink to="/">
              <v-btn color="primary">Back To your payment List</v-btn>
            </RouterLink>
            <v-btn v-show="currentPayment.status===PAYMENT_STATUS.VALIDATED" prepend-icon="tabler-download" color="warning" @click="downloadReceipt">Download receipt</v-btn>

          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style>
</style>
