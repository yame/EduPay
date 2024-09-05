<script lang="ts" setup>
import { DtoNewPayment, PAYMENT_TYPE } from '@/@core/types';

interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'submit', value: DtoNewPayment): void
  (e: 'update:isDialogVisible', val: boolean): void
}



const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const isDialogVisible = ref(false)
const newPayment = reactive({
   studentCode : "",
   amount: "",
   paymentType : PAYMENT_TYPE.CHECK,
   date:new Date()
})


const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', newPayment.value)
}


</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
    max-width="600"
  >
    
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <!-- Dialog Content -->
    <VCard title="Payment Form">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newPayment.amount"
              label="First Name"
              placeholder="John"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newPayment.amount"
              label="Middle Name"
              placeholder="peter"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newPayment.amount"
              label="Last Name"
              persistent-hint
              placeholder="Doe"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="newPayment.amount"
              label="Email"
              placeholder="johndoe@email.com"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="newPayment.amount"
              label="Password"
              autocomplete="on"
              type="password"
              placeholder="············"
            />
          </VCol>
          
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
        <VBtn @click="isDialogVisible = false">
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
