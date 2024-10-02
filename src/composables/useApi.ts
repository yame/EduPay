import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }

      return { options }
    },
    async afterFetch(ctx) {
      const { data, response } = ctx

      // Handle HTTP errors
      if (!response.ok) {
        const errorBody = await response.text(); // or response.json() if expecting JSON
        console.error(`Error ${response.status}: ${errorBody}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
      }

      // Parse data if it's JSON
      let parsedData = null;
      try {
        parsedData = destr(data);
      } catch (error) {
        console.error(error);
      }

      return { data: parsedData, response };
    },
  },
})
