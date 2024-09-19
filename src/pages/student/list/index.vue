<script setup lang="ts">
import { PROGRAM, PROGRAM_ITEMS, Student } from '@/@core/types';
import { useStudentStore } from '@/store/useStudentStore';

import { toast } from 'vue3-toastify';


const searchQuery = ref('')

// Data table options
const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], orderBy: '' })


const studentStore = useStudentStore()
const { getAllStudents, deleteUserByEmail, updateOne, toggleEnableUserAccount } = studentStore
const { studentsList, loading, error } = storeToRefs(studentStore)


// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()


// const students = computed(() => studentsList.value)
const router = useRouter()
const students = computed(() => studentsList.value?.content)
const totalStudents = computed(() => studentsList.value?.totalElements)



const isEditStudentDialogVisible = ref(false)
const editStudent = ref<Student>()
const edit = (item: Student) => {
  editStudent.value = item
  isEditStudentDialogVisible.value = true
}

const viewStudent = (item: Student) => {
  router.push('/student/details/' + item?.code)
}

const emailStudent = ref('')
const isDeleteDialogVisible = ref(false)
const deleteStudent = (item) => {
  deleteUserByEmail(item).then(() => {
    getAllStudents()
  })
}
const deleteOne = (item) => {
  emailStudent.value = item.email
  isDeleteDialogVisible.value = true
}

const updateStudent = (item) => {
  console.log(item);
  updateOne(item).then(() => {
    getAllStudents(page.value, itemsPerPage.value).then(() => {
      toast.success('Student successfully updated ✅', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    }).catch(() => toast.error('Student not Updated  🧨❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    }))
  })
}


const programItems = ref([
  { title: PROGRAM.SMP, value: PROGRAM.SMP },
  { title: PROGRAM.SMA, value: PROGRAM.SMA },
  { title: PROGRAM.SMI, value: PROGRAM.SMI },
  { title: PROGRAM.SMC, value: PROGRAM.SMC },
  { title: PROGRAM.SVT, value: PROGRAM.SVT }

])

const selectedProgram = ref('')
const searchedCode = ref('')
const searchedFirstName = ref('')
const searchedLastName = ref('')

watch([selectedProgram, searchedCode, searchedLastName, searchedLastName], (newValue) => {
  page.value = 1;
  getAllStudents(page.value, itemsPerPage.value, newValue[0], newValue[1], newValue[2]);
})

const changeSize = (val) => {
  itemsPerPage.value = val
}
const changeTotalData = (val) => {
  totalStudents.value = val
}


watch(itemsPerPage, (newVal) => {
  getAllStudents(page.value, itemsPerPage.value);
})


const toggleAccount = (item) => {
  toggleEnableUserAccount(item.email).then(() => {
    accountStates.value = accountStates.value.map((student) =>
      student.email === item.email
        ? { ...student, accountActive: item.accountActive }  // Toggle the accountActive state
        : student
    )
  }
  ).then(() => {
    if (item.accountActive)
      toast.error('Student Account is Disabled  🧨❌', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    else
      toast.success('Student Account is Enabled ✅', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
  })
}
const accountStates = ref(null)
onMounted(() => {
  getAllStudents(page.value, itemsPerPage.value).then(() => {
    accountStates.value = studentsList.value.content.map((s) => {
      return { ...s, accountActive: false }
    })
  }).then(() => console.log(accountStates.value))


})
// const accountStates = computed(()=>studentsList.value?.reduce((prev,acc)=>))

</script>

<template>

  <VCard>
    <VCardTitle class="pa-9 text-h3">
      Students List
    </VCardTitle>
    <!-- 👉 Filters -->
    <VCardText>
      <VRow>
        <!-- 👉 Select Status -->
        <VCol cols="12" sm="3">
          <AppSelect v-model="selectedProgram" label="Program" placeholder="Select Program" :items="PROGRAM_ITEMS" clearable clear-icon="tabler-x" />
        </VCol>

        <!-- 👉 Select Type -->
        <VCol cols="12" sm="3">
          <AppTextField v-model="searchedCode" label="Code" placeholder="Code" clearable clear-icon="tabler-x" />
        </VCol>
        <VCol cols="12" sm="3">
          <AppTextField v-model="searchedLastName" label="LastName" placeholder="LastName" clearable clear-icon="tabler-x" />
        </VCol>
        <VCol cols="12" sm="3">
          <AppTextField v-model="searchedFirstName" label="FirstName" placeholder="FirstName" clearable clear-icon="tabler-x" />
        </VCol>
      </VRow>
    </VCardText>
    <VCardText>
      <div class="d-flex justify-sm-end  flex-wrap gap-4">
        <VBtn color="primary" prepend-icon="tabler-plus" text="New Student" @click="$router.push('/student/add')" />
        <VBtn color="success" prepend-icon="tabler-upload" text="Export" />
      </div>
    </VCardText>

    <VDivider />
    <!-- 👉 students Table -->

    <div v-if="loading" class="p-5">
      <VSkeletonLoader v-for="i in 8" :key="i" type="table-row-divider" />
    </div>
    <div v-else>
      <div v-if="error">
        <Alert title="Error" text="Error of The server" type="error" />
      </div>
      <div v-else>
        <div v-if="students && students?.length>0">

          <VDivider />
          <!-- <AppDataTableServer :headers="headers" :data="students" :totalData = "totalStudents" :loading="loading" v-model:itemsPerPage = "itemsPerPage" v-model:page="page" :search="searchQuery" :error="error" @edit-status="editStatus" :actions="actions"></AppDataTableServer> -->

          <AppDataTableServer v-if="accountStates" :headers="[
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
                key: 'programId',
                title: 'Program',
              },
              {
                key: 'actions',
                title : 'Actions'
              },
              {
                key: 'account',
                title : 'toogle Account'
              }
            ]" :data="students" :totalData="totalStudents" :actions="[
              { icon: 'tabler-eye',color:'secondary', handler: (item) => viewStudent(item) },
              { icon: 'tabler-edit',color:'warning' ,handler: (item) => edit(item) },
              { icon: 'tabler-trash',color:'error', handler: (item) => deleteOne(item) },
            ]" @update:items-per-page="changeSize" @update:total-data="changeTotalData" @toggleAccount="toggleAccount" />

        </div>
        <div v-else>
          <Alert title="Info" text="No Payment Available" type="info" />
        </div>
      </div>
    </div>

    <EditStudentDrawer v-if="isEditStudentDialogVisible" :edit-student="editStudent" v-model:isDrawerOpen="isEditStudentDialogVisible" @on-update="updateStudent" />

    <DeleteConfirmation v-if="isDeleteDialogVisible" :code-delete="emailStudent" v-model:is-dialog-visible="isDeleteDialogVisible" confirmation-question="Vouler vous vraiment supprimer l'Etudiant ? " title="SUPPRESSION" @confirm="deleteStudent" />

  </VCard>
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

