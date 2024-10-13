<script setup lang="ts">
import pdf from '@jbtje/vite-vue3pdf';


interface Props {
  url: string
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', val: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const currentPage = ref(0)
const pageCount = ref(0)

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}


</script>

<template>
  <VDialog persistent :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible" @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          Receipt
        </h4>
        <p class="text-body-1 text-center mb-6">
          Updating user details will receive a privacy audit.
        </p>

        <VCol cols="12" md="12">
          <pdf v-if="url" :src="url" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"></pdf>
        </VCol>
        <!-- 👉 Submit and Cancel -->
        <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">

          <VBtn color="error" variant="tonal" @click="dialogModelValueUpdate(false)">
            Cancel
          </VBtn>
        </VCol>
      </VCardText>
    </VCard>
  </VDialog>
</template>
