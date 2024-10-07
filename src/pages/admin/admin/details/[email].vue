
<script setup lang="ts">
import { useAuthStore } from '@/store/useAuthStore';
import { VCardTitle } from 'vuetify/components';


const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore)

watch(currentUser)

</script>

<template>
  <VCard>
    <VCardTitle class="pt-9 pl-10 text-h5 mb-5"> <span class="letter-spacing font-weight-bold">Student Infos : <span>
          <VAvatar size="34" icon="tabler-school" color="warning" />
          <span class="text-white ms-2 text-warning text-underline text-uppercase mb-5">{{ currentUser?.lastName }} {{ currentUser?.firstName }} </span>
        </span>
      </span>
      <StudentDetails v-if="currentUser" :admin="currentUser" />
      <div v-else>
        <VSkeletonLoader v-for="i in 1" :key="i" type="card-avatar" />
      </div>
    </VCardTitle>

  </VCard>

</template>



<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid
    rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}

::v-deep(.v-table .v-table__wrapper > table > tbody > tr > td) {
  font-size: 12px;
}
::v-deep(.v-data-table-header__content) {
  font-weight: bold !important;
}
</style>


