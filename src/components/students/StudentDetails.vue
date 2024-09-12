

<script setup lang="ts">
import { Student } from '@/@core/types';


interface Props {
  student: Student
}
const props = defineProps<Props>()


</script>

<template>
  <VCard class='mt-5'>
    <VCardItem>
      <VCardTitle class="text-body-1">
        Program : <span class="font-weight-bold text-h5">{{ props.student.programId }} </span>
      </VCardTitle>
      <VCardTitle class="text-body-1 ">
        <p class="clamp-text mb-0 ">
          Email : <span class="font-weight-bold text-h5">{{ props.student.email }}</span>
        </p>
      </VCardTitle>
    </VCardItem>
  </VCard>
</template>
