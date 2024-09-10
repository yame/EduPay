<script setup lang="ts">
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types';
import { getLatestBarChartConfig } from '@core/libs/chartjs/chartjsConfig';
import BarChart from '@core/libs/chartjs/components/BarChart';
import { useTheme } from 'vuetify';

interface Props {
  colors: ChartJsCustomColors,
  statistics
}

const props = defineProps<Props>()

const vuetifyTheme = useTheme()

const chartOptions = computed(() => getLatestBarChartConfig(vuetifyTheme.current.value))

const data = {
  labels: props.statistics.labels || [],
  datasets: [
    {
      maxBarThickness: 15,
      backgroundColor: props.colors.barChartYellow,
      borderColor: 'transparent',
      borderRadius: { topRight: 15, topLeft: 15 },
      data: props.statistics.data || [],
    },
  ],
}

const emit = defineEmits()
watch(props.statistics, (val) => {
  emit('updateData', val)
})
</script>

<template>
  <BarChart :height="400" :chart-data="data" :chart-options="chartOptions" />
</template>
