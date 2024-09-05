<script setup lang="ts">
interface Props {
  confirmationQuestion: string
  isDialogVisible: boolean
  title:string
  codeDelete:string
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: string): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', props.codeDelete)
  updateModelValue(false)
}


</script>

<template>
  <!-- 👉 Confirm Dialog -->
 <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
      <DialogCloseBtn @click="updateModelValue(false)" />
   <VCard class="text-center ">
     <VCol class="d-flex justify-center flex-column align-center">
       <VIcon
          icon="tabler-alert-triangle"
          variant="outlined"
          color="error"
          
          style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
        >
          
        </VIcon>
       <v-card-title class="text-h2 mt-5">
        {{props.title}}
      </v-card-title>
      
       
     </VCol>

        <VCardText class="text-h5 font-weight-medium  ">
          {{ props.confirmationQuestion }}
        </VCardText>

      <VCardText class="d-flex align-center justify-center  gap-4 mt-4">
        <VBtn
          size="small"
          color="success"
          variant="elevated"
          @click="onConfirmation"
          append-icon="tabler-check"
        >
          Supprimer 
        </VBtn>

        <VBtn
         size="small"
          color="error"
          variant="outlined"
          @click="updateModelValue(false)"
          append-icon="tabler-ban"
        >
          Annuler
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
