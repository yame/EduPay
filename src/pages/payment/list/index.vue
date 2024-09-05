<script setup lang="ts">
import { Payment, PAYMENT_STATUS, PAYMENT_TYPE } from '@/@core/types';
import { usePaymentStore } from '@/store/usePaymentStore';

const paymentStore = usePaymentStore()
const {updateOne,getAllPayments} = paymentStore
const {paymentsList,error,loading} = storeToRefs(paymentStore)


// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

getAllPayments(page.value,itemsPerPage.value)

const payments = computed(() => paymentsList.value?.content)
const totalPayments = computed(() => paymentsList.value?.totalElements)


const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })

const isEditStatusDialogVisible= ref(false)
const editPayment = ref<Payment>(null)
const editStatus = (item:Payment)=>{
  editPayment.value = item
  isEditStatusDialogVisible.value = true
}

const viewDetails = (item)=>{
  console.log(item);
  
}

const clearFilters = ()=>{
  selectedStatus.value = ''
  selectedType.value = ''
  searchCode.value = ''
}

const updateStatus = (newStatus,newPayment)=>{
  console.log(newStatus)
  console.log(newPayment)
  updateOne(newPayment.id,newStatus).then(()=>{
    alert('changed')

  }).then(()=>{
    clearFilters()
    getAllPayments(page.value,itemsPerPage.value);
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

watch([selectedStatus,selectedType,searchCode],(newValue)=>{
    page.value = 1;
    getAllPayments(page.value,itemsPerPage.value,newValue[0],newValue[1],newValue[2]);

})

const changeSize = (val)=>{
    itemsPerPage.value = val
}


watch(itemsPerPage,(newVal)=>{
  getAllPayments(page.value,newVal)
})


definePage({
  meta :{
    action : 'manage',
    subject: 'ADMIN'
  }
})
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
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              label="Status"
              placeholder="Select Status"
              :items="statusItems"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <!-- 👉 Select Type -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedType"
              label="Type"
              placeholder="Select Type"
              :items="typeItems"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
    
          <!-- 👉 Select Stock Status -->
          <!-- <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStock"
              placeholder="Stock"
              :items="stockStatus"
              clearable
              clear-icon="tabler-x"
            />
          </VCol> -->
        </VRow>
      </VCardText>
      <VCardText>
        <div class="d-flex justify-sm-end justify-end flex-wrap gap-4">
             <VBtn
             
              variant="tonal"
              color="secondary"
              prepend-icon="tabler-upload"
              text="Export"
            />
          </div>
      </VCardText>

      <VDivider />
      <!-- 👉 Payments Table -->

      <div v-if="loading" class="p-5">  
        <VSkeletonLoader  v-for="i in 8" :key="i" type="table-row-divider" />
      </div>
      <div v-else>
        <div v-if="error">
          <Alert title="Error" text="Error of The server" type="error"/>
        </div>
        <div v-else>
          <div v-if="payments && payments.length>0">
           
        <VDivider/>
         <!-- <AppDataTableServer :headers="headers" :data="payments" :totalData = "totalPayments" :loading="loading" v-model:itemsPerPage = "itemsPerPage" v-model:page="page" :search="searchQuery" :error="error" @edit-status="editStatus" :actions="actions"></AppDataTableServer> -->


          <AppDataTableServer
            v-if="payments"

            :headers="[
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
              },
              {
                key: 'status',
                title: 'Status',
              },
              {
                key: 'actions',
                title : 'Actions'
              }
            ]"
            :data="payments"
            :totalData="totalPayments"
            :actions="[
              { icon: 'tabler-edit', handler: (item) => editStatus(item) },
            ]"
            @update:items-per-page="changeSize"
          />

          </div>
        <div v-else>
          <Alert title="Info" text="No Payment Available" type="info"/>
        </div>
        </div>
      </div>
    </VCard>


    <EditStatusPaymentDrawer v-if="editPayment" :edit-payment="editPayment" v-model:isDrawerOpen="isEditStatusDialogVisible"
    @on-update="updateStatus" />

</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}

::v-deep(.v-table .v-table__wrapper > table > tbody > tr > td){
  font-size: 12px ;
}

::v-deep(.v-data-table-header__content) {
  font-weight: bold !important;
}

::v-deep(.v-table > .v-table__wrapper > table){
    padding: 0 30px;
}

</style>

