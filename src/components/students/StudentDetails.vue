

<script setup lang="ts">
import { EduPayUser } from '@/@core/types';


interface Props {
  admin: EduPayUser
}
const props = defineProps<Props>()
const email = ref(null)
onMounted(() => {
  email.value.focus();
})
console.log(props.admin);

</script>

<template>
  <VCard class='mt-5'>
    <div class="d-flex justify-space-around align-center py-5 ">
      <div class="text-body-1 ">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Email : </span>
          <v-text-field readonly ref="email">{{ props.admin?.email }}</v-text-field>
        </div>
      </div>
      <div v-if="Object.hasOwn(props.admin,'code')" class="text-body-1">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Code : </span>
          <v-chip :label="false" size="small" color="warning">{{ props.admin?.code }}</v-chip>
        </div>
      </div>
      <div v-if="Object.hasOwn(props.admin,'role')" class="text-body-1 ">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Department name : </span>
          <v-chip color="warning">{{ props.admin?.departmentName }}</v-chip>
        </div>

      </div>
      <div class="text-body-1 ">
        <div class="d-flex align-center gap-x-2">
          <span class="font-weight-bold text-h6">Role : </span>
          <v-chip color="warning">{{ Object.hasOwn(props.admin,'role') ? props.admin.role:'STUDENT' }}</v-chip>
        </div>

      </div>

    </div>
  </VCard>
</template>
