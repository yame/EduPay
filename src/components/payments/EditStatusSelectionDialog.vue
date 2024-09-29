<script setup lang="ts">
import { PAYMENT_STATUS } from '@/@core/types';
import { VForm } from 'vuetify/components/VForm';


interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'submit', value: PAYMENT_STATUS): void
  (e: 'update:isDialogVisible', val: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()


const radioGroup = ref<PAYMENT_STATUS>()
const statusList = [
  { status: PAYMENT_STATUS.CREATED, color: 'primary' },
  { status: PAYMENT_STATUS.REJECTED, color: 'error' },
  { status: PAYMENT_STATUS.VALIDATED, color: 'success' }
]
const refForm = ref<VForm>()

const onFormSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('update:isDialogVisible', false)
      emit('submit', radioGroup.value!)
    }
  })
}

const onFormReset = () => {
  // userData.value = structuredClone(toRaw(props.userData))
  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 530" :model-value="props.isDialogVisible" @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          Edit Payment Status Selection
        </h4>
        <p class="text-body-1 text-center mb-6">
          Change the status of multiple payments
        </p>

        <!-- 👉 Form -->
        <VForm ref="refForm" class="mt-6" @submit.prevent="onFormSubmit">
          <VRow>
            <!-- 👉 Change Status -->
            <VRadioGroup v-model="radioGroup" inline :rules="[requiredValidator]" class="justify-center py-6">
              <!-- <VCol cols="12">
                <VLabel>Payment Status :</VLabel>
              </VCol> -->

              <VRadio v-for="(btn,n) in statusList" :color="btn.color" :key="n" :label="btn.status" :value="btn.status" />
            </VRadioGroup>
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit" append-icon="tabler-edit" color="warning">
                Update
              </VBtn>

              <VBtn color="error" prepend-icon="tabler-ban" variant="tonal" @click="onFormReset">
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
