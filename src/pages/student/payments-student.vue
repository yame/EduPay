
<script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import { useAuthStore } from '@/store/useAuthStore';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useStudentStore } from '@/store/useStudentStore';
import { toast } from 'vue3-toastify';
import { VCardText, VCardTitle } from 'vuetify/components';


//ℹ️ - If You want to toggle Side_Menu
// const configStore = useConfigStore()
// configStore.isVerticalNavCollapsed = true;

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()


// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const router = useRouter()
const route = useRoute()
const search = ref('')


const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);


const studentStore = useStudentStore();
const { currentStudent } = storeToRefs(studentStore);
const { getStudentByEmail, generateReceiptPayment } = (studentStore);


const isViewReceiptPDFVisible = ref(false)
const pdfUrl = ref(null)
const paymentStore = usePaymentStore()
const { getPaymentFile, getPaymentsByStudent, updateOne } = paymentStore
const { paymentsList, error, loading } = storeToRefs(paymentStore)

const payments = computed(() => paymentsList.value?.content)
const totalPayments = computed(() => paymentsList.value?.totalElements)

const filtrer = () => {
  search.value = searchQuery.value
  getPaymentsByStudent(route.params?.code)
}

const isAddPayementDialogVisible = ref(false)
//👉 - Handle If Payment added or not
const afterSubmit = (statusCode: number) => {
  if (statusCode === 200) {
    toast.success('Payment successfully added ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getPaymentsByStudent(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value);
  }
  else {
    toast.error('Payment was not added ❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }
}

const isDownloaded = ref(false)


const downloadReceipt = (id) => {
  generateReceiptPayment(id).then(response => {
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
        isDownloaded.value = true;
      }, 3000);

    }
  })
}


const generatePdf = (item: Payment) => {
  downloadReceipt(item.id)
}


const viewPDF = (item: Payment) => {

  usePaymentStore().getPaymentFile(item.id).then(response => {
    const url = URL.createObjectURL(new Blob([response?.data], { type: 'application/pdf' }));
    pdfUrl.value = url
    isViewReceiptPDFVisible.value = true
  })
}


const isEditStatusDialogVisible = ref(false)
const editPayment = ref<Payment>(null)
const editStatus = (item: Payment) => {
  editPayment.value = item
  isEditStatusDialogVisible.value = true
}

const viewDetails = (item) => {
  console.log(item);

}

const clearFilters = () => {
  selectedStatus.value = ''
  selectedType.value = ''
}

const updateStatus = (newStatus, newPayment) => {
  updateOne(newPayment.id, newStatus).then(() => {
    clearFilters()
    getPaymentsByStudent(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value);
  }).catch(err => {
    toast.success('Error from the server 💥❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }).finally(() => {
    toast.success('Status was Changed successfully ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  })
}


const statusItems = ref([
  { title: PAYMENT_STATUS.CREATED, value: PAYMENT_STATUS.CREATED },
  { title: PAYMENT_STATUS.REJECTED, value: PAYMENT_STATUS.REJECTED },
  { title: PAYMENT_STATUS.VALIDATED, value: PAYMENT_STATUS.VALIDATED },
])
const typeItems = ref([
  { title: PAYMENT_TYPE.CASH, value: PAYMENT_TYPE.CASH },
  { title: PAYMENT_TYPE.CHECK, value: PAYMENT_TYPE.CHECK },
  { title: PAYMENT_TYPE.TRANSFER, value: PAYMENT_TYPE.TRANSFER },
  { title: PAYMENT_TYPE.DEPOSIT, value: PAYMENT_TYPE.DEPOSIT }

])
const selectedStatus = ref('')
const selectedType = ref('')

watch([selectedStatus, selectedType], (newValue) => {
  page.value = 1;
  getPaymentsByStudent(page.value, itemsPerPage.value, newValue[0], newValue[1], route?.params?.code);

})

const changeSize = (val) => {
  itemsPerPage.value = val
}

const changePage = (val) => {
  page.value = val
}
watch(itemsPerPage, (newVal) => {
  getPaymentsByStudent(page.value, newVal, selectedStatus.value, selectedType.value);
});
watch(page, (newPage) => {
  getPaymentsByStudent(newPage, itemsPerPage.value, selectedStatus.value, selectedType.value);
});



const userData = useCookie("userData").value
onMounted(() => {
  getStudentByEmail(userData.email).then(() => {
    getPaymentsByStudent(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value)
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
  <VCard>
    <VCardTitle class="pt-9 pl-10 text-h5 mb-5"> <span class="letter-spacing font-weight-bold">Student Infos : <span>
          <VAvatar size="34" icon="tabler-school" color="warning" />
          <span class="text-white ms-2 text-warning text-underline text-uppercase mb-5">{{ userData?.lastName }} {{ userData?.firstName }} </span>
        </span>
      </span>
      <StudentDetails v-if="currentStudent" :admin="currentStudent" />
      <div v-else>
        <VSkeletonLoader v-for="i in 1" :key="i" type="card-avatar" />
      </div>
    </VCardTitle>

    <VCardTitle class="pa-9 text-h3">
      Payments List
    </VCardTitle>
    <!-- 👉 Filters -->
    <VCardText>
      <VRow>
        <!-- 👉 Select Status -->
        <VCol cols="12" sm="4">
          <AppSelect v-model="selectedStatus" label="Status" placeholder="Select Status" :items="statusItems" clearable clear-icon="tabler-x" />
        </VCol>

        <!-- 👉 Select Type -->
        <VCol cols="12" sm="4">
          <AppSelect v-model="selectedType" label="Type" placeholder="Select Type" :items="typeItems" clearable clear-icon="tabler-x" />
        </VCol>
      </VRow>
    </VCardText>
    <VCardText>
      <div class="d-flex justify-sm-end justify-end flex-wrap gap-4">
        <VBtn class="mr-3" color="primary" prepend-icon="tabler-new-section" text="New Payment" @click="isAddPayementDialogVisible = true" />
        <!-- <VBtn v-if="$can('manage', 'all')" color="success" prepend-icon="tabler-upload" text="Export" /> -->
      </div>
    </VCardText>

    <VDivider />
    <!-- 👉 Payments Table -->

    <div v-if="loading" class="p-5">
      <VSkeletonLoader v-for="i in 8" :key="i" type="table-row-divider" />
    </div>
    <div v-else>
      <div v-if="error">
        <Alert title="Error" text="Error of The server" type="error" />
      </div>
      <div v-else>
        <div v-if="payments && payments.length>0">

          <VDivider />

          <AppDataTableServer v-if="payments" :headers="[
              // {
              //   key: 'studentDTO',
              //   title: 'Student',
              //   format: (item) => item.studentDTO?.lastName + ' ' + item.studentDTO?.firstName
              // },
              {
                key: 'date',
                title: 'Date',
                format: (item) => new Date(item.date).toDateString()
              },
              {
                key: 'type',
                title: 'Type',
              },
              {
                key: 'amount',
                title: 'Amount',
              },
              {
                key: 'status',
                title: 'Status',
              },
              {
                key: 'receipt',
                title: 'receipt',
              },
              {
                key: 'receipt-pdf',
                title: 'Confirmation Receipt',
              }

            ]" @viewPDF="viewPDF" @downloadPdf="generatePdf" :data="payments" :totalData="totalPayments" @update:items-per-page="changeSize" @update:page="changePage" />

        </div>
        <div v-else>
          <Alert title="Info" text="No Payment Available" type="info" />
        </div>
      </div>
    </div>
  </VCard>

  <EditStatusPaymentDrawer v-if="editPayment" :edit-payment="editPayment" v-model:isDrawerOpen="isEditStatusDialogVisible" @on-update="updateStatus" />

  <AddPaymentDialog v-if="currentStudent" v-model:is-dialog-visible="isAddPayementDialogVisible" :student-code="currentStudent.code" @onSubmit="afterSubmit" />
  <ViewReceiptDialog v-if="isViewReceiptPDFVisible" v-model:is-dialog-visible="isViewReceiptPDFVisible" :url="pdfUrl" />

</template>



<!-- <style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid
    rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}

::v-deep(.v-table .v-table__wrapper > table > tbody > tr > td) {
  font-size: 12px;
}
::v-deep(.v-data-table-header__content) {
  font-weight: bold !important;
}
</style> -->


