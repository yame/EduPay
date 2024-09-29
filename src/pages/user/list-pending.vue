 <script setup lang="ts">
import { useAuthStore } from "@/store/useAuthStore";
import { useStudentStore } from "@/store/useStudentStore";
import { toast } from "vue3-toastify";

const studentStore = useStudentStore()
const { getPendingStudents, approveMultipleUsers, banMultipleUsers, declineMultipleUsers } = studentStore
const { loading, error, pendingStudents } = storeToRefs(studentStore)
const authStore = useAuthStore()
const { approveRegistration, declineRegistration, banRegistration } = authStore

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const search = ref('')


const pending_Students = computed(() => pendingStudents.value?.content)
const totalPendingStudents = computed(() => pendingStudents.value?.totalElements)

// 👉 methods
if (error.value)
  console.error(error.value)

function approveUser({ email }) {
  approveRegistration(email).then(() => {
    getPendingStudents(page.value, itemsPerPage.value).then(() => {
      toast.success('Registration was approved ✔', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    })
  })
}
function declineUser({ email }) {
  declineRegistration(email).then(() => {
    getPendingStudents(page.value, itemsPerPage.value).then(() => {
      toast.warning('Registration was declined ✔', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    })
  })
}
function banUser({ email }) {
  banRegistration(email).then(() => {
    getPendingStudents(page.value, itemsPerPage.value).then(() => {
      toast.error('Registration was banned ✔', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    })
  })
}


const changeSize = (val) => {
  itemsPerPage.value = val
}

const changeTotalData = (val) => {
  pendingStudents.value = val
}

watch([search], (newValue) => {
  page.value = 1;
  getPendingStudents(page.value, itemsPerPage.value, newValue[0]);

})

getPendingStudents(page.value, itemsPerPage.value)


//SECTION Selection Implementation

//👉 - Selected Rows Implementation here
const isSelected = ref(false)
const selectedRows = ref<String[]>([])
const toggleOrDeleteSelection = (listEmails) => {
  isSelected.value = true
  selectedRows.value = listEmails
}


const approveSelection = () => {
  console.table(selectedRows.value);
  approveMultipleUsers(selectedRows.value).then((res) => {
    console.warn(res)
    toast.success(res + '✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getPendingStudents(page.value, itemsPerPage.value)
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

const declineSelection = () => {
  console.table(selectedRows.value);
  declineMultipleUsers(selectedRows.value).then((res) => {
    console.warn(res)
    toast.success('Student account was declined ❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getPendingStudents(page.value, itemsPerPage.value)
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

const banSelection = () => {
  console.table(selectedRows.value);
  banMultipleUsers(selectedRows.value).then((res) => {
    console.warn(res)
    toast.success(res + ' ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getPendingStudents(page.value, itemsPerPage.value)
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
      Pending Students
    </VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="12" md="4">
          <VTextField v-model="search" label="Email" placeholder="Search by email..." append-inner-icon="tabler-search" clearable variant="outlined" />
        </VCol>
        <VCol cols="12" md="8" class="d-flex gap-x-3">
          <VBtn v-show="isSelected" color="success" append-icon="tabler-circle-check" text="Approve selection" @click="approveSelection" />
          <VBtn v-show="isSelected" color="warning" append-icon="tabler-xbox-x" text="Decline selection" @click="declineSelection" />
          <VBtn v-show="isSelected" color="error" append-icon="tabler-ban" text="Ban selection" @click="banSelection" />
        </VCol>
      </VRow>
    </VCardText>
    <VDivider />
    <VCardText>
      <div v-if="loading" class="p-5">
        <VSkeletonLoader v-for="i in 8" :key="i" type="table-row-divider" />
      </div>
      <div v-else>
        <div v-if="error">
          <Alert title="Error" text="Error of The server" type="error" />
        </div>
        <div v-else>
          <div v-if="pending_Students && pending_Students?.length>0">

            <VDivider />
            <!-- <AppDataTableServer :headers="headers" :data="students" :totalData = "totalStudents" :loading="loading" v-model:itemsPerPage = "itemsPerPage" v-model:page="page" :search="searchQuery" :error="error" @edit-status="editStatus" :actions="actions"></AppDataTableServer> -->

            <AppDataTableServer :model-value="selectedRows" :selected-item="'email'" :headers="[
              {
                key: 'code',
                title: 'Code',
              },
              {
                key: 'Student',
                title: 'Student',
                format: (item) => item?.lastName + ' ' + item?.firstName
              },
              {
                key: 'email',
                title: 'Email',
              },
              {
                key: 'programID',
                title: 'Program',
              },
              {
                key: 'Register DAte',
                title: 'registerDate',
                 format: (item) => new Date(item.registerDate).toDateString()             
                 },
              {
                key: 'actions',
                title : 'Actions'
              }
            ]" :data="pending_Students" :totalData="totalPendingStudents" :actions="[
              { icon: 'tabler-circle-check',color:'success', handler: (item) => approveUser(item) },
              { icon: 'tabler-xbox-x',color:'warning' ,handler: (item) => declineUser(item) },
              { icon: 'tabler-ban',color:'error', handler: (item) => banUser(item) },
            ]" @update:items-per-page="changeSize" @update:total-data="changeTotalData" @update:model-value="toggleOrDeleteSelection" />

          </div>
          <div v-else>
            <Alert title="Info" text="No Student Available" type="info" />
          </div>
        </div>
      </div>
    </VCardText>

  </VCard>
</template>




<style lang="scss" scoped>
.v-table th .v-data-table-header__content {
  font-size: 1.2em;

  font-weight: bolder;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  font-size: 12px;
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
