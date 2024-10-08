<script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import EditStatusSelectionDialog from '@/components/payments/EditStatusSelectionDialog.vue';
import { usePaymentStore } from '@/store/usePaymentStore';
import { toast } from 'vue3-toastify';

const paymentStore = usePaymentStore()
const { updateOne, getAllPayments, updateSelectionStatus, getChangesPayment } = paymentStore
const { paymentsList, msgError, error, loading } = storeToRefs(paymentStore)


// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

getAllPayments(page.value, itemsPerPage.value)

const payments = computed(() => paymentsList.value?.content)
const totalPayments = computed(() => paymentsList.value?.totalElements)


const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })
const isAddPayementDialogVisible = ref(false);
const isEditStatusDialogVisible = ref(false)
const editPayment = ref<Payment>(null)
const editStatus = (item: Payment) => {
  editPayment.value = item
  isEditStatusDialogVisible.value = true
}


//👉 - Compare Implementation
const currentPaymentChanges = ref(null)
const isCompareDialogVisible = ref(false)
const compareChanges = (item) => {
  getChangesPayment(item.id).then((res) => {
    currentPaymentChanges.value = res.data.value
    isCompareDialogVisible.value = true
  })
}

const viewDetails = (item) => {
  console.log(item);

}

const clearFilters = () => {
  selectedStatus.value = ''
  selectedType.value = ''
  searchCode.value = ''
}

const updateStatus = async (newStatus, newPayment) => {
  updateOne(newPayment.id, newStatus).then(res => {
    if (!res) {
      if (msgError.value === '')
        toast.error('You cannot change the payment status to the same value. Please select a different status.');
      else
        toast.error(msgError.value)
    }
    else
      toast.success("The payment status has been successfully updated!");
  }).then(() => {
    clearFilters()
    getAllPayments(page.value, itemsPerPage.value);
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
const searchCode = ref('')

watch([selectedStatus, selectedType, searchCode], (newValue) => {
  page.value = 1;
  getAllPayments(page.value, itemsPerPage.value, newValue[0], newValue[1], newValue[2]);

})

const changeSize = (val) => {
  itemsPerPage.value = val
}

const changePage = (val) => {
  page.value = val
}

watch(itemsPerPage, (newVal) => {
  getAllPayments(page.value, newVal, selectedStatus.value, selectedType.value, searchCode.value);
});
watch(page, (newPage) => {
  getAllPayments(newPage, itemsPerPage.value, selectedStatus.value, selectedType.value, searchCode.value);
});

//👉 - Handle If Payment added or not
const afterSubmit = (statusCode: number) => {
  if (statusCode === 200) {
    toast.success('Payment successfully added ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getAllPayments(page.value, itemsPerPage.value, selectedStatus.value, selectedType.value);
  }
  else {
    toast.error('Payment was not added ❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }
}

//👉 - Bulk Status Payments Implementation
const isSelectionIdsDialogVisible = ref(false)
const selectedRows = ref<string[]>([])
const isSelected = ref(false)

const toggleOrDeleteSelection = (ids) => {
  isSelected.value = true
  selectedRows.value = ids
}

const changeStatusSelection = (newStatus: PAYMENT_STATUS) => {
  updateSelectionStatus(selectedRows.value, newStatus).then(res => {
    toast.success('Payments Status were Changed✅😍', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getAllPayments(page.value, itemsPerPage.value)
  }).catch((err) => {
    toast.error(err + '⛔❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  }
  ).finally(() => {
    selectedRows.value = []
    isSelected.value = false
  })
}


</script>

<template>

  <VCard>
    <VCardTitle class="pa-9 text-h3">
      Payments List
    </VCardTitle>
    <!-- 👉 Filters -->
    <VCardText>
      <VRow>
        <!-- 👉 Select Status -->
        <VCol cols="12" md="3" lg="3">
          <AppSelect v-model="selectedStatus" label="Status" placeholder="Select Status" :items="statusItems" clearable clear-icon="tabler-x" />
        </VCol>

        <!-- 👉 Select Type -->
        <VCol cols="12" md="3" lg="3">
          <AppSelect v-model="selectedType" label="Type" placeholder="Select Type" :items="typeItems" clearable clear-icon="tabler-x" />
        </VCol>
        <VCol cols="12" md="6" lg="6" class="d-flex  justify-end align-end gap-x-2">
          <VBtn v-show="isSelected" color="warning" prepend-icon="tabler-edit" text="Update Selection" @click="isSelectionIdsDialogVisible = true" />
          <VBtn color="primary" prepend-icon="tabler-new-section" text="New Payment" @click="isAddPayementDialogVisible = true" />

        </VCol>
      </VRow>
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

          <AppDataTableServer v-if="payments" @update:page="changePage" @update:items-per-page="changeSize" :model-value="selectedRows" :selected-item="'id'" @update:model-value="toggleOrDeleteSelection" :headers="[
              {
                key: 'studentDTO',
                title: 'Student Name',
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
                key: 'actions',
                title : 'Actions'
              }
            ]" :data="payments" :totalData="totalPayments" :actions="[
              { icon: 'tabler-edit', handler: (item) => editStatus(item) },
              { icon: 'tabler-git-compare', color:'error',handler: (item) => compareChanges(item) },
            ]" />

        </div>
        <div v-else>
          <Alert title="Info" text="No Payment Available" type="info" />
        </div>
      </div>
    </div>
  </VCard>

  <EditStatusSelectionDialog v-if="isSelectionIdsDialogVisible" v-model:is-dialog-visible="isSelectionIdsDialogVisible" @submit="changeStatusSelection" />
  <EditStatusPaymentDrawer v-if="editPayment" :edit-payment="editPayment" v-model:isDrawerOpen="isEditStatusDialogVisible" @on-update="updateStatus" />
  <AddPaymentDialog v-if="isAddPayementDialogVisible" v-model:is-dialog-visible="isAddPayementDialogVisible" @onSubmit="afterSubmit" />
  <CompareDialog v-if="currentPaymentChanges" :currentChanges="currentPaymentChanges" :is-dialog-visible="isCompareDialogVisible" @update:is-dialog-visible="isCompareDialogVisible =false" />
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

::v-deep(.v-table > .v-table__wrapper > table) {
  padding: 0 30px;
}
</style>

