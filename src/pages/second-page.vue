<script setup lang="ts">
import type { Order } from '@db/apps/ecommerce/types'
import masterCardDark from '@images/icons/payments/img/master-dark.png'
import masterCardLight from '@images/icons/payments/img/mastercard.png'
import paypalDark from '@images/icons/payments/img/paypal-dark.png'
import paypalLight from '@images/icons/payments/img/paypal-light.png'

const widgetData = ref([
  { title: 'Pending Payment', value: 56, icon: 'tabler-calendar-stats' },
  { title: 'Completed', value: 12689, icon: 'tabler-checks' },
  { title: 'Refunded', value: 124, icon: 'tabler-wallet' },
  { title: 'Failed', value: 32, icon: 'tabler-alert-octagon' },
])

const mastercard = useGenerateImageVariant(masterCardLight, masterCardDark)
const paypal = useGenerateImageVariant(paypalLight, paypalDark)

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])

// Data table Headers
const headers = [
  { title: 'Order', key: 'order' },
  { title: 'Date', key: 'date' },
  { title: 'Customers', key: 'customers' },
  { title: 'Payment', key: 'payment', sortable: false },
  { title: 'Status', key: 'status' },
  { title: 'Method', key: 'method', sortable: false },
  { title: 'Action', key: 'actions', sortable: false },
]

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolvePaymentStatus = (status: number) => {
  if (status === 1)
    return { text: 'Paid', color: 'success' }
  if (status === 2)
    return { text: 'Pending', color: 'warning' }
  if (status === 3)
    return { text: 'Cancelled', color: 'secondary' }
  if (status === 4)
    return { text: 'Failed', color: 'error' }
}

const resolveStatus = (status: string) => {
  if (status === 'Delivered')
    return { text: 'Delivered', color: 'success' }
  if (status === 'Out for Delivery')
    return { text: 'Out for Delivery', color: 'primary' }
  if (status === 'Ready to Pickup')
    return { text: 'Ready to Pickup', color: 'info' }
  if (status === 'Dispatched')
    return { text: 'Dispatched', color: 'warning' }
}
const search = ref('')
// Fetch Orders
const { data: ordersData, execute: fetchOrders } = await useApi<any>(createUrl('/apps/ecommerce/orders',
  {
    query: {
      q: search,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const orders = computed((): Order[] => ordersData.value.orders)
const totalOrder = computed(() => ordersData.value.total)


const filtrer = ()=>{
  search.value = searchQuery.value
  fetchOrders()
}

const inputRef = ref('bissi')

onMounted(()=>{
  console.log(inputRef.value)
  console.log(inputRef.value.class)
  console.log(inputRef.value.value)
  console.log(inputRef.value.color)
  inputRef.value.focus()
})
</script>

<template>
  <div>
    <VTextField type="text" placeholder="Enter your name" class="w-25 mb-5" ref="inputRef"/> 
  </div>
  
  <div>
  

    <VCard>
      <!-- 👉 Filters -->
      <VCardText>
        <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Order"
            style=" max-inline-size: 200px; min-inline-size: 200px;"
          />
          <v-btn color="success" @click="filtrer">filtrer</v-btn>
          <div class="d-flex gap-x-4 align-center">
            <AppSelect
              v-model="itemsPerPage"
              style="min-inline-size: 6.25rem;"
              :items="[5, 10, 20, 50, 100]"
            />
            <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="tabler-upload"
              text="Export"
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- 👉 Order Table -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="orders"
        :items-length="totalOrder"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Order ID -->
        <!-- <template #item.order="{ item }">
          <RouterLink :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.order } }">
            #{{ item.order }}
          </RouterLink>
        </template> -->

        <!-- Date -->
        <template #item.date="{ item }">
        <span class="customer-title">  {{ new Date(item.date).toDateString() }}</span>
        </template>

        <!-- Customers  -->
        <!-- <template #item.customers="{ item }">
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              size="34"
              :color="!item.avatar.length ? 'primary' : ''"
              :variant="!item.avatar.length ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />

              <span
                v-else
                class="font-weight-medium"
              >{{ avatarText(item.customer) }}</span>
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1 font-weight-medium">
                <RouterLink
                  :to="{ name: 'pages-user-profile-tab', params: { tab: 'profile' } }"
                  class="text-link"
                >
                  {{ item.customer }}
                </RouterLink>
              </div>
              <div class="text-body-2">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template> -->

        <!-- Payments -->
        <!-- <template #item.payment="{ item }">
          <div
            :class="`text-${resolvePaymentStatus(item.payment)?.color}`"
            class="font-weight-medium d-flex align-center gap-x-2"
          >
            <VIcon
              icon="tabler-circle-filled"
              size="10"
            />
            <div style="line-height: 22px;">
              {{ resolvePaymentStatus(item.payment)?.text }}
            </div>
          </div>
        </template> -->

        <!-- Status -->
        <!-- <template #item.status="{ item }">
          <VChip
            v-bind="resolveStatus(item.status)"
            label
            size="small"
          />
        </template> -->

        <!-- Method -->
        <!-- <template #item.method="{ item }">
          <div class="d-flex align-center">
            <img
              :src="item.method === 'mastercard' ? mastercard : paypal"
              height="18"
            >
            <div class="text-body-1">
              ...{{ item.method === 'mastercard' ? item.methodNumber : '@gmail.com' }}
            </div>
          </div>
        </template> -->

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="view"
                  :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.order } }"
                >
                  View
                </VListItem>
                <VListItem
                  value="delete"
                  @click="deleteOrder(item.id)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalOrder"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}

::v-deep(.v-table .v-table__wrapper > table > tbody > tr > td){
  font-size: 12px ;
}
::v-deep(.v-data-table-header__content) {
  font-weight: bold !important;
}
</style>

