import { useNotificationStore } from '@/store/useNotificationStore';
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

type Statistics = {
  countStudentsByProgram: {
    [key: string]: [number, number];
  };
  paymentsCountByMonth: {
    [key: string]: number;
  };
  NonSeenNotificationsCount: number
};

export const useStatisticsStore = defineStore('statistic', () => {

  const statisticsBarCharData = ref()
  const statisticsPolarAreaCharData = ref()
  const nonSeenNotificationCount = ref(0)
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



  // ? '/app/on-login-data'
  //     : `/app/dashboard-data?month=${month}`

  //👉 - On Login Fetch Data
  async function onLoginFetchData(url: string) {
    //👉 - Get Data From Hamza's Server 
    const { data, error: isError, isFetching } = await useApi(url)

    //👉 - Set NonSeenNotificationsCount after login Admin
    if ((data.value as Statistics).NonSeenNotificationsCount)
      useNotificationStore().setNonSeenNotificationsCount((data.value as Statistics).NonSeenNotificationsCount)

    //👉 - Retrieve and Split the Program Statistics Object After Each Login
    const programs = Object.keys((data.value as Statistics).countStudentsByProgram)
    const programsValues = Object.values((data.value as Statistics).countStudentsByProgram)
    statisticsPolarAreaCharData.value = {
      labels: programs,
      datasets: [
        {
          borderWidth: 0,
          label: 'Total Students ',
          data: programsValues.map(v => v[0]),
          backgroundColor: [chartJsCustomColors.primary, chartJsCustomColors.yellow, chartJsCustomColors.polarChartWarning, chartJsCustomColors.polarChartInfo, chartJsCustomColors.polarChartGrey, chartJsCustomColors.polarChartGreen],
        },
      ],
    }

    //👉 - Retrieve and Split the Month Statistics Object After Each Login 
    const months = Object.keys((data.value as Statistics).paymentsCountByMonth)
    const monthsValues = Object.values((data.value as Statistics).paymentsCountByMonth)
    statisticsBarCharData.value = {
      labels: months,
      datasets: [
        {
          maxBarThickness: 15,
          backgroundColor: chartJsCustomColors.lineChartPrimary,
          borderColor: 'transparent',
          borderRadius: { topRight: 15, topLeft: 15 },
          data: monthsValues,
        },
      ],
    }

    loading.value = isFetching.value
    error.value = isError.value
  }

  async function getDashboardData(month?: number) {
    const url = month ? `/app/dashboard-data?month=${month}` : `/app/dashboard-data`
    await onLoginFetchData(url);
  }


  return {
    statisticsBarCharData, statisticsPolarAreaCharData, error, loading, onLoginFetchData, getDashboardData
  }
})
