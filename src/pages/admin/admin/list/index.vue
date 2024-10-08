<script setup lang="ts">
import { PROGRAM_ITEMS, Student } from '@/@core/types';
import { useAdminStore } from '@/store/useAdminStore';
import { useStudentStore } from '@/store/useStudentStore';

import { toast } from 'vue3-toastify';


const searchQuery = ref('')

// Data table options
const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], orderBy: '' })


const studentStore = useStudentStore()
const { getAllStudents, deleteUserByEmail, updateOne, toggleEnableUserAccount, uploadStudentFile, deleteMultipleStudents, resetPasswordToMultipleStudents, toggleMultipleStudents } = studentStore
const { studentsList } = storeToRefs(studentStore)



const adminStore = useAdminStore()
const { getAllAdmins } = adminStore
const { adminsList, loading, error } = storeToRefs(adminStore)


// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()


// const students = computed(() => studentsList.value)
const router = useRouter()
const students = computed(() => adminsList.value?.content)
const totalStudents = computed(() => adminsList.value?.totalElements)



const isEditStudentDialogVisible = ref(false)
const editStudent = ref<Student>()
const edit = (item: Student) => {
  editStudent.value = item
  isEditStudentDialogVisible.value = true
}

const viewAdmin = (item: Student) => {
  router.push('/admin/admin/details/' + item?.email)
}

const emailStudent = ref('')
const isDeleteDialogVisible = ref(false)
const deleteAdmin = (item) => {
  deleteUserByEmail(item).then(() => {
    getAllAdmins(page.value, itemsPerPage.value)
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

const selectedProgram = ref('')
const searchedCode = ref('')
const searchedFirstName = ref('')
const searchedLastName = ref('')

watch([selectedProgram, searchedCode, searchedLastName, searchedLastName], (newValue) => {
  page.value = 1;
  getAllAdmins(page.value, itemsPerPage.value, newValue[0], newValue[1], newValue[2]);
})

const changeSize = (val) => {
  itemsPerPage.value = val
}
const changeTotalData = (val) => {
  totalStudents.value = val
}


watch(itemsPerPage, (newVal) => {
  getAllAdmins(page.value, itemsPerPage.value);
})


const toggleAccount = (item) => {
  console.log(item)
  toggleEnableUserAccount(item.email).then((res) => {
    return (res.data.value);

  }
  ).then((res) => {
    if (!item.enabled)
      toast.error(res + ' 🧨❌', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
    else
      toast.success(res + ' ✅', {
        "theme": useCookie('EduPayment-theme').value || 'auto'
      })
  }).then(() => {
    getAllAdmins(page.value, itemsPerPage.value);
  })
}

onMounted(() => {
  getAllAdmins(page.value, itemsPerPage.value)
})

//👉 - File options
interface FileData {
  file: File
  url: string
}

const fileData = ref<FileData[]>([])
const blob = ref(null)
const file = ref([])

const selectFile = (e) => {
  console.log(file.value[0]);

  // if (file.value.length > 0) {
  //   const originalFile = file.value[0];
  //   // const newFileName = `${originalFile.name.split('.')[0]}${Date.now()}.${originalFile.name.split('.').pop()}`;
  //   const newFileName = `p.pdf`;

  //   const renamedFile = new File([originalFile], newFileName, { type: originalFile.type });

  //   fileData.value[0] = {
  //     file: renamedFile,
  //     url: useObjectUrl(renamedFile).value ?? '',
  //   };
  //   file.value[0] = renamedFile
  //   blob.value = fileData.value[0].url;
  //   console.log(fileData.value[0]);
  // }
};
const isLoading = ref(false)
const loadStudents = () => {
  isLoading.value = true
  uploadStudentFile(file.value[0]).then(res => {
    console.log(res.status);
    toast.success(res.split('.')[0] + ' ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })

  }).then(() => {
    getAllStudents(page.value, itemsPerPage.value).then(() => {
      file.value = []
      isLoading.value = false
    })
  }).catch(err => {
    isLoading.value = false
    toast.error(err + '⛔❌', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
  })
}


//👉 - Selected Rows Implementation here
const isSelected = ref(false)
const selectedRows = ref<String[]>([])
const toggleOrDeleteSelection = (listEmails) => {
  isSelected.value = true
  selectedRows.value = listEmails
}

const deleteSelection = () => {
  console.table(selectedRows.value);
  deleteMultipleStudents(selectedRows.value).then((res) => {
    console.warn(res)
    toast.success(res + '✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getAllStudents(page.value, itemsPerPage.value)
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

const resetPwSelection = () => {
  console.table(selectedRows.value);
  resetPasswordToMultipleStudents(selectedRows.value).then((res) => {
    console.warn(res)
    toast.success(res + '✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getAllStudents(page.value, itemsPerPage.value)
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

const toggleSelection = () => {
  console.table(selectedRows.value);
  toggleMultipleStudents(selectedRows.value).then((res) => {
    console.warn(res)
    toast.success('Accounts were toggled ✅', {
      "theme": useCookie('EduPayment-theme').value || 'auto'
    })
    getAllStudents(page.value, itemsPerPage.value)
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
      Admins List
    </VCardTitle>
    <!-- 👉 Filters -->
    <VCardText>
      <VRow>

        <!-- <VCol cols="12" sm="6" md="6" lg="5">
          <VFileInput label="Load Students from file" v-model="file" @change="selectFile" accept=".xlsx" placeholder="Load Students from an excel file" />
        </VCol>
        <VCol cols="12" sm="6" md="3" lg="6">
          <VBtn :loading="isLoading" @click="loadStudents" color="success" prepend-icon="tabler-upload" text="Load Students" :disabled=" file.length < 1" />

        </VCol>-->
        <VCol cols="12" class="d-flex flex-row-reverse gap-x-4 flex-wrap gap-y-2">
          <VBtn color="primary" prepend-icon="tabler-plus" text="New Admin" @click="$router.push('/admin/admin/add')" />
          <VBtn v-show="isSelected" color="error" prepend-icon="tabler-trash" text="Delete selection" @click="deleteSelection" />
          <VBtn v-show="isSelected" color="secondary" prepend-icon="tabler-switch-horizontal" text="Toggle selection" @click="toggleSelection" />
          <VBtn v-show="isSelected" color="warning" prepend-icon="tabler-restore" text="Reset password selection" @click="resetPwSelection" />
        </VCol>

      </VRow>
    </VCardText>
    <v-divider></v-divider>
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

          <AppDataTableServer :model-value="selectedRows" :selected-item="'email'" :headers="[
              
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
                key: 'departmentName',
                title: 'DepartmentName',
              },
              {
                key: 'actions',
                title : 'Actions'
              },
              {
                key: 'enabled',
                title : 'toogle Account'
              }
            ]" :data="students" :totalData="totalStudents" :actions="[
              { icon: 'tabler-edit',color:'warning' ,handler: (item) => edit(item) },
              { icon: 'tabler-trash',color:'error', handler: (item) => deleteOne(item) },
            ]" @update:items-per-page="changeSize" @update:total-data="changeTotalData" @toggleAccount="toggleAccount" @update:model-value="toggleOrDeleteSelection" />

        </div>
        <div v-else>
          <Alert title="Info" text="No Payment Available" type="info" />
        </div>
      </div>
    </div>

    <EditStudentDrawer v-if="isEditStudentDialogVisible" :edit-student="editStudent" v-model:isDrawerOpen="isEditStudentDialogVisible" @on-update="updateStudent" />

    <DeleteConfirmation v-if="isDeleteDialogVisible" :code-delete="emailStudent" v-model:is-dialog-visible="isDeleteDialogVisible" confirmation-question="Vouler vous vraiment supprimer l'Etudiant ? " title="SUPPRESSION" @confirm="deleteAdmin" />

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
  padding: 0 0 30px 30px;
}
</style>

