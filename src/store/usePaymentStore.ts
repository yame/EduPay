import { DtoNewPayment, Payment, PAYMENT_STATUS, PAYMENT_TYPE } from "@/@core/types";
import axios from 'axios';
import { File } from "buffer";
import { UUID } from "crypto";

export const usePaymentStore = defineStore('payment', () => {

  const paymentsList = ref<Payment[]>()
  const currentPayment = ref<Payment>()
  const currentEmail = ref(null)
  const currentReceipt = ref<File>()
  const loading = ref(true)
  const error = ref('')
  const msgError = ref('')

  //👉 - Get all payments 
  async function getAllPayments(currentPage?: Number, itemsPerPage?: Number, status?: string, type?: string, code?: string, min?: number, max?: number) {
    try {
      const { data, error: hasError, isFetching } = await useApi(createUrl('/payments/filter', {
        query: {
          page: (currentPage - 1),
          size: itemsPerPage,
          status: status?.toString(),
          type: type?.toString(),
          code: code?.toString()
        }
      })
      )
      paymentsList.value = data.value as Payment[]
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Get all payments by student
  async function getPaymentsByStudent(currentPage?: Number, itemsPerPage?: Number, status?: string, type?: string, min?: number, max?: number) {
    try {
      const { data, error: hasError, isFetching } = await useApi(createUrl('/payments/student-payments', {
        query: {
          page: (currentPage - 1),
          size: itemsPerPage,
          status: status?.toString(),
          type: type?.toString(),
        }
      })
      )
      paymentsList.value = data.value as Payment[]
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }


  //👉 - Find payment by its id
  async function getPaymentById(id: UUID) {
    try {
      const { data, error: hasError, isFetching } = await useApi(`/payments/${id}`)
      currentPayment.value = data.value as Payment
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Get payments by the status
  async function getPaymentByStatus(status: PAYMENT_STATUS) {
    try {
      const { data, error: hasError, isFetching } = await useApi(`/payments/status/${status}`)
      paymentsList.value = data.value as Payment[]
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Get payments by the status
  async function getPaymentByType(type: PAYMENT_TYPE) {
    try {
      const { data, error: hasError, isFetching } = await useApi(`/payments/type/${type}`)
      paymentsList.value = data.value as Payment[]
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Update the payment status
  async function updateOne(id: UUID, newStatus: PAYMENT_STATUS) {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/payments/${id}/status-update?newStatus=${newStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${useCookie('accessToken').value}`,
        },
      })

      return response.data
    } catch (err) {
      if (err.response) {
        console.warn(err.response.data);
        msgError.value = err.response.data
      }
      return null;
    }
  }

  //👉 - Add Payment 
  async function addOne(newPayment: DtoNewPayment, file) {
    const formData = new FormData()
    const dateFormat = (new Date(newPayment.date)).toISOString()
    formData.append('studentCode', newPayment.studentCode.toString());
    formData.append('paymentType', newPayment.paymentType.toString());
    formData.append('date', dateFormat);
    formData.append('amount', newPayment.amount.toString());
    formData.append('file', file);

    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payments/new`, formData, {
      headers: {
        Authorization: `Bearer ${useCookie('accessToken').value}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(res.status);

    return res.status
  }

  //👉 - Get PaymentFile
  async function getPaymentFile(paymentId) {
    try {
      loading.value = true
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/payments/receipt/${paymentId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${useCookie('accessToken').value}`,
        },
      })
      loading.value = false
      return response

    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

  }

  //👉 - Update Status's bulk of Payments 
  async function updateSelectionStatus(ids: string[], newStatus: PAYMENT_STATUS) {
    const response = await $api('/payments/list/update-status', {
      method: 'PATCH',
      body: {
        newPaymentStatus: newStatus,
        ids: ids
      }
    })
    return response
  }

  return { msgError, paymentsList, currentPayment, currentReceipt, error, loading, getAllPayments, getPaymentById, getPaymentByStatus, getPaymentByType, getPaymentFile, getPaymentsByStudent, updateOne, addOne, updateSelectionStatus }
})
