<script setup lang="ts">
import { PROGRAM, PROGRAM_ITEMS, Student } from "@/@core/types";
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';



const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
  (e: 'onUpdate', val: Payment): void
  // (e: 'removeEvent', eventId: string): void
}>()

interface Props {
  isDrawerOpen: boolean
  editStudent?: Student
}



const props = withDefaults(defineProps<Props>(), {
  editStudent: () => ({
    code: null,
    email: null,
    firstName: null,
    lastName: null,
    programId: PROGRAM.SMA
  })
})

const newStudent = ref<Student>(structuredClone(toRaw(props.editStudent)))

// watch(props, () => {
//   newStudent.value = structuredClone(toRaw(props.editStudent))
// })



const refForm = ref<VForm>()



const handleSubmit = () => {
  refForm.value?.validate()
    .then(({ valid }) => {
      if (valid) {
        emit('onUpdate', newStudent.value)
        emit('update:isDrawerOpen', false)
      }
    }).finally(() => refForm.value?.reset())
}


// 👉 Form

const onCancel = () => {
  emit('update:isDrawerOpen', false)
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer temporary location="end" :model-value="props.isDrawerOpen" width="370" :border="0" class="scrollable-content" @update:model-value="dialogModelValueUpdate">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection title="MODIFICATION" @cancel="$emit('update:isDrawerOpen', false)">

    </AppDrawerHeaderSection>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <VCol cols="12">
                <AppTextField v-model="newStudent.code" label="Code" placeholder="Entrer le code de l'Etudiant(e)" disabled />
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="newStudent.firstName" label="Prénom" placeholder="Entrer le Prénom  du l'Etudiant(e)" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="newStudent.lastName" label="Nom" placeholder="Entrer le Nom  du l'Etudiant(e)" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="newStudent.email" label="Email" placeholder="ouss@example.com" type="email" :rules="[requiredValidator, emailValidator]" />
              </VCol>
              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect :items="PROGRAM_ITEMS" v-model="newStudent.programId" label="Program" placeholder="Active" color="secondary" chips />
              </VCol>
              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn block type="submit" class="mb-3 mt-6" variant="outlined" color="success">
                  Confirmer
                </VBtn>
                <VBtn block color="error" @click="onCancel">
                  Annuler
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
          <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
