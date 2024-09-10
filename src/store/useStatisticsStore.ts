import type { ChartJsCustomColors } from '@/views/charts/chartjs/types';

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
export const useStatisticsStore = defineStore('statistic', () => {

  const statisticsBarCharData = ref()
  const statisticsPolarAreaCharData = ref()
  const loading = ref(true)
  const error = ref('')

  //👉 - Get Statistics by amount 
  async function getStatisticsByAmount(month?: number) {
    try {
      const url = month !== undefined
        ? `/payments/statistics-by-mount?month=${month}`
        : '/payments/statistics-by-mount';
      const { data, error: hasError, isFetching } = await useApi(url)
      if (data.value) {
        const months = Object.keys(data.value)
        const values = Object.values(data.value)

        statisticsBarCharData.value = {
          labels: months,
          datasets: [
            {
              maxBarThickness: 15,
              backgroundColor: chartJsCustomColors.lineChartPrimary,
              borderColor: 'transparent',
              borderRadius: { topRight: 15, topLeft: 15 },
              data: values,
            },
          ],
        }
      }
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }
  //👉 - Get Statistics by program 
  async function getStatisticsByProgram(month?: number) {
    try {
      const url = `/user/student/count-by-program`

      const { data, error: hasError, isFetching } = await useApi(url)
      if (data.value) {
        const labels = Object.keys(data.value)
        const values = Object.values(data.value)
        console.log(values[0]);


        statisticsPolarAreaCharData.value = {
          labels: labels,
          datasets: [
            {
              borderWidth: 0,
              label: 'Total Students ',
              data: values.map(v => v[0]),
              backgroundColor: [chartJsCustomColors.primary, chartJsCustomColors.yellow, chartJsCustomColors.polarChartWarning, chartJsCustomColors.polarChartInfo, chartJsCustomColors.polarChartGrey, chartJsCustomColors.polarChartGreen],
            },
          ],
        }

      }
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }
  return {
    statisticsBarCharData, statisticsPolarAreaCharData, error, loading, getStatisticsByAmount, getStatisticsByProgram
  }
})
