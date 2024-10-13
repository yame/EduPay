
<script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useStudentStore } from '@/store/useStudentStore';
import { toast } from 'vue3-toastify';
import { VCardText, VCardTitle } from 'vuetify/components';

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

const resolvePaymentStatus = (status: string) => {
  if (status === PAYMENT_STATUS.CREATED)
    return { text: PAYMENT_STATUS.CREATED, color: 'primary' }
  if (status === PAYMENT_STATUS.VALIDATED)
    return { text: PAYMENT_STATUS.VALIDATED, color: 'success' }
  return { text: PAYMENT_STATUS.REJECTED, color: 'error' }
}

const resolvePaymentType = (type: string) => {
  if (type === PAYMENT_TYPE.CASH)
    return { text: PAYMENT_TYPE.CASH, color: 'success' }
  if (type === PAYMENT_TYPE.CHECK)
    return { text: PAYMENT_TYPE.CHECK, color: 'primary' }
  if (type === PAYMENT_TYPE.DEPOSIT)
    return { text: PAYMENT_TYPE.DEPOSIT, color: 'info' }
  return { text: PAYMENT_TYPE.TRANSFER, color: 'warning' }
}



const router = useRouter()
const route = useRoute()
const search = ref('')
// Fetch Orders


const studentStore = useStudentStore()
const { getStudentByCode } = studentStore
const { currentStudent } = storeToRefs(studentStore)

const isViewReceiptPDFVisible = ref(false)
const pdfUrl = ref(null)
const paymentStore = usePaymentStore()
const { getPaymentFile, getPaymentsByStudent, updateOne, getAllPayments } = paymentStore
const { paymentsList, error, loading } = storeToRefs(paymentStore)



// const { data: paymentsData, execute: fetchPayments } = await useApi('/payments/student/'+route.params.code)

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
    getAllPayments(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value, route.params?.code);
  }
  else {
    toast.error('Payment was not added ❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }
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
    getAllPayments(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value, route.params?.code);
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
  getAllPayments(page.value, itemsPerPage.value, newValue[0], newValue[1], route?.params?.code);

})

const changeSize = (val) => {
  itemsPerPage.value = val
}

const changePage = (val) => {
  page.value = val
}
watch(itemsPerPage, (newVal) => {
  getAllPayments(page.value, newVal, selectedStatus.value, selectedType.value, route.params?.code);
});
watch(page, (newPage) => {
  getAllPayments(newPage, itemsPerPage.value, selectedStatus.value, selectedType.value, route.params?.code);
});




onMounted(() => {
  getAllPayments(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value, route.params?.code).then(() => {
    getStudentByCode(route.params?.code)
  })
})

</script>

<template>
  <VCard>
    <VCardTitle class="pt-9 pl-10 text-h5 mb-5"> <span class="letter-spacing font-weight-bold">Student Infos : <span>
          <VAvatar size="34" icon="tabler-school" color="warning" />
          <span class="text-white ms-2 text-warning text-underline text-uppercase mb-5">{{ currentStudent?.lastName }} {{ currentStudent?.firstName }} </span>
        </span>
      </span>
      <StudentDetails v-if="currentStudent" :student="currentStudent" />
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
          <!-- <AppDataTableServer :headers="headers" :data="payments" :totalData = "totalPayments" :loading="loading" v-model:itemsPerPage = "itemsPerPage" v-model:page="page" :search="searchQuery" :error="error" @edit-status="editStatus" :actions="actions"></AppDataTableServer> -->

          <AppDataTableServer v-if="payments" :headers="[
              {
                key: 'studentDTO',
                title: 'Student',
                format: (item) => item.studentDTO?.lastName + ' ' + item.studentDTO?.firstName
              },
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
                format: (item) => item.amount + ' DH '

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
                key: 'actions',
                title : 'Actions'
              }
            ]" @viewPDF="viewPDF" :data="payments" :totalData="totalPayments" :actions="[
              { icon: 'tabler-edit', handler: (item) => editStatus(item) },
            ]" @update:items-per-page="changeSize" @update:page="changePage" />

        </div>
        <div v-else>
          <Alert title="Info" text="No Payment Available" type="info" />
        </div>
      </div>
    </div>
  </VCard>

  <EditStatusPaymentDrawer v-if="editPayment" :edit-payment="editPayment" v-model:isDrawerOpen="isEditStatusDialogVisible" @on-update="updateStatus" />

  <AddPaymentDialog v-model:is-dialog-visible="isAddPayementDialogVisible" :student-code="route.params?.code" @onSubmit="afterSubmit" />
  <ViewReceiptDialog v-if="isViewReceiptPDFVisible" v-model:is-dialog-visible="isViewReceiptPDFVisible" :url="pdfUrl" />

</template>



<style lang="scss" scoped>
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
</style>


