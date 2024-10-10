<script setup lang="ts">
import { VIcon } from 'vuetify/components';

const props = defineProps<Props>()
const emit = defineEmits<Emit>()



interface Props {
  isDialogVisible: boolean
  currentChanges: object
}

const currentPaymentData = ref(structuredClone(toRaw(props.currentChanges)))

watch(() => props.currentChanges, (val) => {
  currentPaymentData.value = val
})

interface Emit {
  (e: 'update:isDialogVisible', val: boolean): void
}

const dialogVisibleUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
//  "id": "49aca71d-5e98-41cd-ad38-b76b9d497a1e", "adminEmail": "hamza@damiri.com", "paymentId": "e8c6ef36-dd6f-49f0-8619-bd66a05e4c9f", "newStatus": "REJECTED", "oldStatus": "CREATED", "changeDate": "2024-09-28T15:39:11.000+00:00"
const paymentMethodsData = [
  {
    title: currentPaymentData.value?.adminEmail,
    type: 'Admin Email',
    img: 'tabler-mail',
  },
  {
    title: resolveStatusColor(currentPaymentData.value?.oldStatus)?.text,
    type: 'Old Status',
    img: 'tabler-file',
  },
  {
    title: resolveStatusColor(currentPaymentData.value?.newStatus)?.text,
    type: 'New Status',
    img: 'tabler-file-invoice',
  },
  {
    title: new Date(currentPaymentData.value?.changeDate).toDateString(),
    type: 'Change Date',
    img: 'tabler-calendar',
  }

]
</script>

<template>
  <VDialog :model-value="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 750" @update:model-value="dialogVisibleUpdate">
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn @click="emit('update:isDialogVisible', false)" />
    <VCard class="pa-2 pa-sm-10">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          Comparison of Payment Status
        </h4>

        <div v-for="(item, index) in paymentMethodsData" :key="index">
          <div class="d-flex justify-space-between align-center py-4 gap-x-4">
            <div class="d-flex align-center">
              <VIcon height="30" width="50" class="me-4">{{ item.img }}</VIcon>
              <h6 v-if="item.type!=='Old Status' && item.type!=='New Status'" class="text-h6">
                {{ item.title }}
              </h6>
              <VChip v-else class="text-h6" :color="resolveStatusColor(item.title)?.color">
                {{ item.title }}
              </VChip>
            </div>
            <div v-if="item.type!=='Old Status'" class="d-none d-sm-block text-body-1">
              {{ item.type }}
            </div>
            <div v-else class="d-none d-sm-block text-body-1 text-decoration-line-through">
              {{ item.type }}
            </div>
          </div>
          <VDivider v-if="index !== paymentMethodsData.length - 1" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.refer-link-input {
  .v-field--appended {
    padding-inline-end: 0;
  }

  .v-field__append-inner {
    padding-block-start: 0.125rem;
  }
}
</style>
