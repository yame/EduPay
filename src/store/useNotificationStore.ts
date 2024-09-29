import { getNotificationTime } from "@/@core/utils/helpers";
import { Notification } from "@/@layouts/types";
export const useNotificationStore = defineStore("notification", () => {

  const notificationsList = ref<Notification[]>([])
  const notificationsFromPagination = ref()
  const loading = ref(false)
  const error = ref('')


  //SECTION - ACTIONS FOR MANAGING LOCAL DATA
  //👉 - Add A notification to our local data
  function pushNotification(message: Notification) {
    const jsonObject = JSON.parse(message);
    const notification: Notification = message.includes('payment') ? {
      id: jsonObject.notificationId,
      paymentId: jsonObject.paymentId,
      icon: 'tabler-coin',
      title: `New Payment 💸💰`,
      subtitle: jsonObject.message,
      time: getNotificationTime(jsonObject.registerDate),
      isSeen: jsonObject.seen,
      color: 'success'
    } : {
      id: jsonObject.notificationId,
      email: jsonObject.email,
      icon: 'tabler-school',
      title: `New Registration 💁🏼‍♂️`,
      subtitle: jsonObject.message,
      time: getNotificationTime(jsonObject.registerDate),
      isSeen: jsonObject.seen,
      color: 'warning'
    };

    // //👉 - Check if a notification has the same id already exists
    const exists = notificationsList.value.some((n) => n.id === notification.id)
    if (!exists)
      notificationsList.value.unshift(notification)
  }
  //👉 - Remove searched notification 
  function removeNotification(id: number) {
    const idSet = new Set(notificationsList.value.map(notification => notification.id));
    if (idSet.has(id)) {
      notificationsList.value = notificationsList.value.filter(notification => notification.id !== id);
      idSet.delete(id);
    }
  }
  //👉 - Mark All notifications readd
  function readAllNotifications(ids: number[]) {
    const idSet = new Set(ids)
    notificationsList.value.forEach((n) => {
      if (idSet.has(n.id) && !n.isSeen) {
        n.isSeen = true
      }
    })
  }
  //👉 - Toggle Seen Notification
  function toggleLocalNotification(id: number) {
    // const idsSet = new Set(notificationsList.value.map(n=>n.id))
    const searchedNotification = notificationsList.value.find(n => n.id === id)
    if (searchedNotification)
      searchedNotification.isSeen = !searchedNotification.isSeen;
  }
  //!SECTION


  //SECTION - ACTIONS FOR HANDLING API REQUEST
  //👉 - Mark All read api
  async function markAllAsRead() {
    try {
      return await useApi('/notifications/mark-all-as-read').post()
    } catch (error) {
      console.log(error)
    }
  }
  //👉 - fetch notifications after login
  async function onLoginNotifications() {
    try {
      const { data, error } = await useApi('/user/on-login-notifications')
      // notificationsList.value = data.value
      console.log(data.value);
      if (error)
        console.log(error.value);

    } catch (error) {
      console.log(error);

    }

  }
  //👉 - Delete Notification
  async function deleteNotification(id: number) {
    return await useApi('/notifications/delete?id=' + id).post()
  }
  //👉 - Toggle Seen Notification
  async function toggleSeen(id: number) {
    const response = await useApi('/notifications/toggle-seen?id=' + id).patch()
    return response.data.value
  }
  //👉 - Pageable Notification
  async function pageableNotifications(page?: Number, size?: Number, seen?: Boolean) {

    const { data, error: hasError, isFetching } = await useApi(createUrl('/notifications/pageable', {
      query: {
        seen,
        page: (page - 1),
        size,

      }
    })
    )
    notificationsFromPagination.value = data.value
    // console.log(notificationsFromPagination.value);

    loading.value = isFetching.value
    console.log(loading.value);

    error.value = hasError.value
  }
  //!SECTION


  return { notificationsList, notificationsFromPagination, loading, error, pageableNotifications, pushNotification, onLoginNotifications, markAllAsRead, removeNotification, readAllNotifications, deleteNotification, toggleSeen, toggleLocalNotification };
}, {
  persist: true
});

