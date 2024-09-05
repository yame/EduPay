<script setup lang="ts">
import { Payment, PAYMENT_STATUS } from "@/@core/types";
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';



const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
  (e: 'onUpdate',val1: PAYMENT_STATUS , val2: Payment): void
}>()

interface Props {
  isDrawerOpen: boolean
  editPayment: Payment
}



const props =defineProps<Props>()

const editPayment = ref<Payment>(structuredClone(toRaw(props.editPayment)))


// 👉 store
// const store = useCalendarStore()
const refForm = ref<VForm>()


//👉 - methodes
const resolveStatusColor = (status: string) => {
  if (status === 'Confirmed')
    return { text: 'Confirmed', color: 'success', icon: 'tabler-check' }
  if (status === 'Completed')
    return { text: 'Completed', color: 'primary', icon: 'tabler-checks' }
  if (status === 'Cancelled')
    return { text: 'Cancelled', color: 'error', icon: 'tabler-ban' }
}

const paymentStatus = ref([PAYMENT_STATUS.CREATED,PAYMENT_STATUS.REJECTED,PAYMENT_STATUS.VALIDATED]);




const handleSubmit = () => {
  refForm.value?.validate()
    .then(({ valid }) => {
      if (valid) {
        emit('onUpdate',newStatus.value,props.editPayment)
        dialogModelValueUpdate(false)
      }
    })
}


// 👉 Form

const onCancel = () => {
  dialogModelValueUpdate(false)
}


const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}


// const isChangedStatus = computed({
//   get(){return props.editPayment.status},
//   set(value){    
//     props.editPayment.status = value
// },
// })

const newStatus = ref(props.editPayment.status)
watch(() => props.editPayment?.status, (newValue) => {
 newStatus.value = newValue;
})



</script>

<template>
  <VNavigationDrawer temporary location="end" :model-value="props.isDrawerOpen" width="370" :border="0"
    class="scrollable-content" @update:model-value="dialogModelValueUpdate">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection title="MODIFICATION OF THE PAYMENT'S STATUS "  @cancel="$emit('update:isDrawerOpen', false)">
     
    </AppDrawerHeaderSection>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect :items="paymentStatus" v-model="newStatus"
                  label="Status" placeholder="Active" color="secondary" chips />
              </VCol>


              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn block type="submit" class="mb-3 mt-6" variant="outlined" color="success" >
                  Confirm
                </VBtn>
                <VBtn block color="error" @click="onCancel">
                  Cancel
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
