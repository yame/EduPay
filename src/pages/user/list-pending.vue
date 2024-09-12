 <script setup lang="ts">
import { PROGRAM } from "@/@core/types";
import { useAuthStore } from "@/store/useAuthStore";


const authStore = useAuthStore()
const { approveRegistration, declineRegistration, banRegistration } = authStore

const { data: pendingStudents, isFetching, error, execute: fetchPendingStudents } = await useApi('/user/pending-students')
const search = ref('')

// headers
const headers = [
  { title: 'prénom', key: 'firstName' },
  { title: 'nom', key: 'lastName' },
  { title: 'email', key: 'email' },
  { title: 'Register Date', key: 'registerDate' },
  { title: 'Programme', key: 'programID' },
  { title: 'code', key: 'code' },
  // { title: 'STATUS', key: 'status' },
  { title: 'actions', key: 'actions', sortable: false },
]

// 👉 methods
const resolveProgram = (program: string) => {
  console.log(program);

  if (program === PROGRAM.SMA)
    return { text: PROGRAM.SMA, color: 'success' }
  if (program === PROGRAM.SMC)
    return { text: PROGRAM.SMC, color: 'primary' }
  if (program === PROGRAM.SMI)
    return { text: PROGRAM.SMI, color: 'info' }
  if (program === PROGRAM.SMP)
    return { text: PROGRAM.SMP, color: 'secondary' }
  if (program === PROGRAM.SMP)
    return { text: PROGRAM.SVT, color: 'warning' }
  return { text: 'null', color: '#768' }
}

const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })



if (error.value)
  console.error(error.value)

function addStatusFields() {
  pendingStudents.value.forEach(user => {
    if (!('isApproved' in user)) user.isApproved = false;
    if (!('isDeclined' in user)) user.isDeclined = false;
    if (!('isBanned' in user)) user.isBanned = false;
  });
}
function approveUser(email) {
  console.log(email);
  approveRegistration(email).then(() => {
    updateUserStatus(email, { isApproved: true, isDeclined: false, isBanned: false });
  }).finally(() => {
    fetchPendingStudents()
  })
}
function declineUser(email) {
  declineRegistration(email).then(() => {
    updateUserStatus(email, { isApproved: false, isDeclined: true, isBanned: false });
  }).finally(() => {
    fetchPendingStudents()
  })
}
function banUser(email) {
  console.log(email);
  banRegistration(email).then(() => {
    updateUserStatus(email, { isApproved: false, isDeclined: false, isBanned: true });
  }).finally(() => {
    fetchPendingStudents()
  })
}
function updateUserStatus(email, status) {
  const user = pendingStudents.value.find(user => user.email === email);
  if (user) {
    Object.assign(user, status);
  }
}
addStatusFields()
console.table(pendingStudents.value)
</script>

<template>
  <VCard>
    <VCardTitle class="pa-9 text-h3">
      Pending Students
    </VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="12" offset-md="8" md="4">
          <AppTextField v-model="search" placeholder="Search ..." append-inner-icon="tabler-search" single-line hide-details dense outlined />
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable v-if="pendingStudents" :headers="headers" :items="pendingStudents || []" :search="search" :items-per-page="options.itemsPerPage" :page="options.page" :options="options" class="text-no-wrap">

      <template #item.registerDate="{ item }">
        <span class="customer-title"> {{ new Date(item.registerDate).toDateString() }}</span>
      </template>

      <template #item.programID="{item}">
        <VChip :color="resolveProgram(item.programID)?.color" label size="small">
          {{ resolveProgram(item.programID).text }}
        </VChip>
      </template>

      <template #item.actions="{item}">
        <IconBtn>
          <VIcon icon="tabler-dots-vertical" />
          <VMenu activator="parent" transition="slide-x-transition" offset-y>
            <VList>
              <!-- Approve Section -->
              <VListItem @click="approveUser(item.email)">

                <VListItemTitle class="mt-2"><span class="text-transform-underline text-uppercase text-success">Approve User</span>
                  <VIcon color="success">tabler-circle-check</VIcon>
                </VListItemTitle>
                <VListItemSubtitle class="mb-2">
                  <VSwitch v-model="item.isApproved" color="success" :label="item.isApproved ? 'Approved' : 'Not Approved'" dense />
                </VListItemSubtitle>
              </VListItem>
              <v-divider></v-divider>
              <!-- Decline Section -->
              <VListItem @click="declineUser(item.email)">

                <VListItemTitle class="mt-2"><span class="text-underline text-uppercase text-warning">Decline User</span>
                  <VIcon color="warning">mdi-close-circle</VIcon>
                </VListItemTitle>
                <VListItemSubtitle class="mb-2">
                  <VSwitch v-model="item.isDeclined" color="warning" :label="item.isDeclined ? 'Declined' : 'Not Declined'" dense />
                </VListItemSubtitle>
              </VListItem>
              <v-divider></v-divider>

              <!-- Ban Section -->
              <VListItem @click="banUser(item.email)">

                <VListItemTitle class="mt-2"><span class="text-underline text-uppercase text-error">Ban User</span>
                  <VIcon color="error">tabler-ban</VIcon>
                </VListItemTitle>
                <VListItemSubtitle class="mb-2">
                  <VSwitch v-model="item.isBanned" color="error" :label="item.isBanned ? 'Banned' : 'Not Banned'" dense />
                </VListItemSubtitle>
              </VListItem>
            </VList>
          </VMenu>

          <!-- <VMenu activator="parent" transition="slide-x-transition">
            <VList>
              <VListItem @click="approveUser(item.email)">
                <v-icon>tabler-check</v-icon>
                <VSwitch v-model="item.isApproved" color="success" :label="`${item.isApproved ? 'User Approved' : 'User not Approved'} `" />
              </VListItem>
              <VListItem @click="declineUser(item.email)">
                <v-icon>tabler-x</v-icon>
                <VSwitch v-model="item.isDeclined" color="warning" :label="`${item.isDeclined ? 'User Declined' : 'User not Declined'} `" />
              </VListItem>
              <VListItem @click="banUser(item.email)">
                <v-icon>tabler-ban</v-icon>
                <VSwitch v-model="item.isBanned" color="error" :label="`${item.isBanned ? 'User Banned' : 'User not Banned'} `" />
              </VListItem>
            </VList>
          </VMenu> -->
        </IconBtn>
        <!-- <VMenu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <VBtn v-bind="attrs" @click="on" color="blue" small>
              
              <VIcon right>tabler-chevron-down</VIcon>
            </VBtn>
          </template>
          <v-list>
            <v-list-item @click="approveUser(item.id)">
             
                <v-icon>tabler-check</v-icon>
              <v-list-item-title>Approve</v-list-item-title>
            </v-list-item>
            <v-list-item @click="declineUser(item.id)">
             
                <v-icon>tabler-cancel</v-icon>
              <v-list-item-title>Decline</v-list-item-title>
            </v-list-item>
            <v-list-item @click="banUser(item.id)">
             
                <v-icon>tabler-ban</v-icon>
              <v-list-item-title>Ban</v-list-item-title>
            </v-list-item>
          </v-list>
        </VMenu> -->
      </template>
      <template #bottom>
        <VCardText class="pt-2">
          <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
            <VTextField v-model="options.itemsPerPage" label="Rows per page:" type="number" min="-1" max="15" hide-details variant="underlined" style="max-inline-size: 8rem;min-inline-size: 5rem;" />

            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5" :length="Math.ceil(pendingStudents?.length / options.itemsPerPage)" />
          </div>
        </VCardText>
      </template>

    </VDataTable>
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
