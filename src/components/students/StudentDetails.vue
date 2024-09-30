

<script setup lang="ts">
import { Student } from '@/@core/types';
import { VForm } from 'vuetify/components/VForm'


interface Props {
  student: Student
}
const props = defineProps<Props>()
const email = ref(null)
onMounted(() => {
  email.value.focus();
})

</script>

<template>
  <VCard class='mt-5'>
    <div class="d-flex justify-space-around align-center py-5 ">
      <div class="text-body-1 ">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Email : </span>
          <v-text-field readonly ref="email">{{ props.student.email }}</v-text-field>
        </div>
      </div>
      <div class="text-body-1">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Code : </span>
          <v-chip :label="false" size="small" color="warning">{{ props.student.code }}</v-chip>
        </div>
      </div>
      <div class="text-body-1 ">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Program : </span>
          <v-chip color="warning">{{ props.student.programId }}</v-chip>
        </div>

      </div>
      <div class="text-body-1 ">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Account : </span>
          <v-switch v-model="props.student.enabled" readonly color="warning"></v-switch>
        </div>
      </div>
    </div>
  </VCard>
</template>
