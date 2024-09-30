<script setup lang="ts">
import { useNotificationStore } from '@/store/useNotificationStore';
import { useStatisticsStore } from '@/store/useStatisticsStore';
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types';
import { getLatestBarChartConfig, getPolarChartConfig } from '@core/libs/chartjs/chartjsConfig';
import BarChart from '@core/libs/chartjs/components/BarChart';
import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart';
import { ref } from 'vue';
import { useTheme } from 'vuetify';

// Get the statistics store
const notificationStore = useNotificationStore();
const { onLoginNotifications } = notificationStore;
const statisticsStore = useStatisticsStore();
const { statisticsBarCharData, statisticsPolarAreaCharData, error, loading, isDataFetched } = storeToRefs(statisticsStore);
const { onLoginFetchData, getDashboardData } = statisticsStore
const vuetifyTheme = useTheme()

const chartOptions = computed(() => getLatestBarChartConfig(vuetifyTheme.current.value))

const chartConfig = computed(() => getPolarChartConfig(vuetifyTheme.current.value))

// Define custom colors for the chart
const chartJsCustomColors: ChartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

// Define selectedOption and items for the month selection
const selectedOption = ref<{ title: string; pos: number }>({ title: 'Jan', pos: 1 });

const items = [
  { title: 'Jan', pos: 1 },
  { title: 'Feb', pos: 2 },
  { title: 'Mar', pos: 3 },
  { title: 'Apr', pos: 4 },
  { title: 'May', pos: 5 },
  { title: 'Jun', pos: 6 },
  { title: 'Jul', pos: 7 },
  { title: 'Aug', pos: 8 },
  { title: 'Sep', pos: 9 },
  { title: 'Oct', pos: 10 },
  { title: 'Nov', pos: 11 },
  { title: 'Dec', pos: 12 },
];

watch(selectedOption, async (val) => {
  if (val == null) {
    await getDashboardData()
  } else {
    await getDashboardData(val.pos);
  }

});

definePage({
  meta: {
    action: 'manage',
    subject: 'ADMIN'
  }
})

const route = useRoute()
// function sendMessage() {
//   WebSocketService.send('/app/myEndpoint', { content: 'Hello, WebSocket!' });
// }

console.error("INDEX BABY");


// watch(() => authStore.accessToken, (newToken) =>
//   instance?.appContext.config.globalProperties.$initWebSocketConnection(authStore.accessToken))


onMounted(async () => {
  if (!isDataFetched.value) {
    await getDashboardData()
  }
});

// watch(() => route.path, async (newRoute) => {
//   console.log(newRoute);
//   isDataFetched.value = false
// })


// watch(isDataFetched, async (newData) => {
//   console.log(newData);
// })


// watch(() => notificationStore.NonSeenNotificationsCount, async (newCount) => {
//   notificationStore.setNonSeenNotificationsCount(newCount);
// })


</script>

<template>
  <!-- Latest Statistics -->
  <VRow class="match-height">
    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <VCardTitle>Statistics by month</VCardTitle>

          <template #append>
            <div>
              <AppCombobox v-model="selectedOption" :items="items" item-title="title" item-value="pos" label="Filter by month" placeholder="all" return-object clearable class="width" />
            </div>
          </template>
        </VCardItem>

        <VCardText v-if="statisticsBarCharData">

          <BarChart :height="400" :chart-data="statisticsBarCharData" :chart-options="chartOptions" />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="6">
      <VCard title="Statistics by program">
        <VCardText v-if="statisticsPolarAreaCharData">
          <PolarAreaChart :height="400" :chart-data="statisticsPolarAreaCharData" :chart-options="chartConfig" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
::v-deep(.v-field) {
  width: 130px;
}
</style>
