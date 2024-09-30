<script setup lang="ts">
import { Payment } from '@/@core/types';
import { useNotificationStore } from '@/store/useNotificationStore';
import { toast } from 'vue3-toastify';



const notificationStore = useNotificationStore()
const { notificationsFromPagination, error, loading } = storeToRefs(notificationStore)
const { pageableNotifications, toggleSeen, toggleLocalNotification, readAllNotifications, removeNotification, deleteNotification, toggleSeenMultipleNotifications, deleteMultipleNotifications, markAsReadMultipleNotifications } = notificationStore

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const notifications = computed(() => notificationsFromPagination.value?.content)
const totalNotifications = computed(() => notificationsFromPagination.value?.totalElements)


const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })
const isAddPayementDialogVisible = ref(false);
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
  selectedSeen.value = ''

}


const selectedSeen = ref('')


watch([selectedSeen], (newValue) => {
  page.value = 1;
  pageableNotifications(page.value, itemsPerPage.value, newValue[0]);
})

const changeSize = (val) => {
  itemsPerPage.value = val
}

const changePage = (val) => {
  page.value = val
}

watch(itemsPerPage, (newVal) => {
  pageableNotifications(page.value, itemsPerPage.value)

});
watch(page, (newPage) => {
  pageableNotifications(page.value, itemsPerPage.value)
});

pageableNotifications(page.value, itemsPerPage.value)


const isSeenItems = ref([
  { title: "seen", value: true },
  { title: "unseen", value: false },
])

const toggle = (item) => {
  toggleSeen(item.notificationId).then(() => {
    toggleLocalNotification(item.notificationId)
  }).then(() => {
    toast.info('Notification was Toggled 😜')
  })
}



//👉 - Code For delete Notification
const remNotification = (notification) => {
  if (notification.seen) {
    console.table(notification);
    deleteNotification(notification.notificationId).then((res) => {
      removeNotification(notification.notificationId);
    }).finally(() => {
      pageableNotifications(page.value, itemsPerPage.value)
      toast.info('Notification was Deleted ')
    })
  }
}


//SECTION Selection Implementation

//👉 - Selected Rows Implementation here
const isSelected = ref(false)
const markAsReadSelected = ref(false)
const selectedRows = ref<number[]>([])
const toggleOrDeleteSelection = (ids) => {
  isSelected.value = true
  markAsReadSelected.value = true
  selectedRows.value = ids
}


const toggleSelection = () => {
  toggleSeenMultipleNotifications(selectedRows.value).then((res) => {

    const ids = new Set(selectedRows.value)
    ids.forEach(id => {
      toggleLocalNotification(id)
    })
    pageableNotifications(page.value, itemsPerPage.value)
    toast.success('notifications selection was toggled ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
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

const markAsReadSelection = () => {
  markAsReadSelected.value = false
  markAsReadMultipleNotifications(selectedRows.value).then((res) => {
    readAllNotifications(selectedRows.value)
    pageableNotifications(page.value, itemsPerPage.value)
    toast.success('notifications selection was marked as read ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
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

const deleteSelection = () => {
  deleteMultipleNotifications(selectedRows.value).then((res) => {
    const ids = new Set(selectedRows.value)
    ids.forEach(id => {
      removeNotification(id)
    })
    pageableNotifications(page.value, itemsPerPage.value)
    toast.success('notifications selection was deleted✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
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



//!SECTION


</script>

<template>

  <VCard>
    <VCardTitle class="pa-9 text-h3">
      Notifications List
    </VCardTitle>
    <!-- 👉 Filters -->
    <VCardText>
      <VRow>
        <!-- 👉 Select Seen -->
        <VCol cols="12" md="2" sm="4">
          <AppSelect v-model="selectedSeen" label="Filter by Viewed" placeholder="Is Seen" :items="isSeenItems" clearable clear-icon="tabler-x" />
        </VCol>
        <VCol cols="12" md="10" class="d-flex flex-row-reverse gap-x-4 flex-wrap gap-y-2">
          <VBtn v-show="isSelected" color="error" prepend-icon="tabler-trash" text="Delete selection" @click="deleteSelection" />
          <VBtn v-show="isSelected" color="secondary" prepend-icon="tabler-switch-horizontal" text="Toggle selection" @click="toggleSelection" />
          <VBtn v-show="isSelected" color="info" prepend-icon="tabler-eye" text="Mark As Read Selection" @click="markAsReadSelection" />
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
        <div v-if="notifications && notifications?.length >0">

          <VDivider />

          <AppDataTableServer v-if="notifications" :model-value="selectedRows" :selected-item="'notificationId'" @update:model-value="toggleOrDeleteSelection" @update:page="changePage" @update:items-per-page="changeSize" :headers="[
              {
                key: 'notificationId',
                title: 'Notification Id',
              },
              {
                key: 'registerDate',
                title: 'Register date',
                format: (item) => new Date(item.registerDate).toDateString()
              },
              
              {
                key: 'message',
                title: 'Message',
              },

              {
                key: 'seen',
                title: 'Is Seen',
              },
              {
                key: 'actions',
                title : 'Actions'
              }
            ]" @toggle-read="toggle" :data="notifications" :totalData="totalNotifications" :actions="[
              { icon: 'tabler-trash',color:'error', handler: (item) => remNotification(item),class:'not-allowed' }
            ]" />

        </div>
        <div v-else>
          <Alert title="Info" text="No Notification Available" type="info" />
        </div>
      </div>
    </div>
  </VCard>
  <!--
  <EditStatusPaymentDrawer v-if="editPayment" :edit-payment="editPayment" v-model:isDrawerOpen="isEditStatusDialogVisible" @on-update="updateStatus" />
  <AddPaymentDialog v-model:is-dialog-visible="isAddPayementDialogVisible" @onSubmit="afterSubmit" />-->

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

// ::v-deep(.v-btn .v-btn__content) {
//   cursor: not-allowed;
// }
</style>
