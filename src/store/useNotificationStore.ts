import { getNotificationTime } from "@/@core/utils/helpers";
import { Notification } from "@/@layouts/types";
export const useNotificationStore = defineStore("notification", () => {

  const notificationsList = ref<Notification[]>([])
  const notificationsListStudent = ref<Notification[]>([])
  const notificationsFromPagination = ref()
  const NonSeenNotificationsCount = ref<number>(0)
  const loading = ref(false)
  const error = ref('')


  //SECTION - Student Processus
  //👉 - Add A notification to our local data for student
  function pushNotificationStudent(message: Notification) {
    const jsonObject = JSON.parse(message);
    const notification: Notification = {
      id: jsonObject.notificationId,
      paymentId: jsonObject.paymentId,
      icon: 'tabler-alert-octagon',
      title: `Your Payment Status: Updated 📊`,
      subtitle: jsonObject.message,
      time: getNotificationTime(jsonObject.registerDate),
      isSeen: jsonObject.seen,
      color: 'error'
    }
    // //👉 - Check if a notification has the same id already exists
    const exists = notificationsListStudent.value.some((n) => n.id === notification.id)
    if (!exists) {
      notificationsListStudent.value.unshift(notification)
    }
  }
  //👉 - Remove searched notification 
  function removeNotificationStudent(id: number) {
    const idSet = new Set(notificationsListStudent.value.map(notification => notification.id));
    if (idSet.has(id)) {
      notificationsListStudent.value = notificationsListStudent.value.filter(notification => notification.id !== id);
      idSet.delete(id);
    }
  }
  //👉 - Mark All notifications readd
  function readAllNotificationsStudent(ids: number[]) {
    const idSet = new Set(ids)
    notificationsListStudent.value.forEach((n) => {
      if (idSet.has(n.id) && !n.isSeen) {
        n.isSeen = true
      }
    })
  }
  //👉 - Toggle Seen Notification
  function toggleLocalNotificationStudent(id: number) {
    // const idsSet = new Set(notificationsList.value.map(n=>n.id))
    const searchedNotification = notificationsListStudent.value.find(n => n.id === id)
    if (searchedNotification) {
      searchedNotification.isSeen = !searchedNotification.isSeen;
    }
  }
  //!SECTION


  //SECTION - Student Section Api
  //👉 - Toggle Seen Notification Student
  async function toggleSeenStudent(id: number) {
    const response = await useApi('/notifications/student/toggle-seen?id=' + id).patch()
    return response.data.value
  }

  //👉 - Delete Notification Student
  async function deleteNotificationStudent(id: number) {
    return await useApi('/notifications/student/delete?id=' + id).delete()
  }


  //!SECTION



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
    if (!exists) {
      notificationsList.value.unshift(notification)
    }
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
    if (searchedNotification) {
      searchedNotification.isSeen = !searchedNotification.isSeen;
    }
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


  //👉 - Set NonSeenNotificationsCount
  function setNonSeenNotificationsCount(count: number) {
    NonSeenNotificationsCount.value = count
  }

  function decrement() {
    if (NonSeenNotificationsCount.value > 0)
      NonSeenNotificationsCount.value--;
  }


  //SECTION SELECTION ACTIONS

  //👉 - Delete bulk of Notifications 
  async function deleteMultipleNotifications(ids: number[]) {
    const response = await $api('/notifications/delete-list', {
      method: 'DELETE',
      body: ids
    })
    return response
  }

  //👉 - Toggle_Seen for bulk of Notifications 
  async function toggleSeenMultipleNotifications(ids: number[]) {
    const response = await $api('/notifications/toggle-seen-list', {
      method: 'PATCH',
      body: ids
    })
    return response
  }

  //👉 - Mark_AS_Read bulk of Notifications 
  async function markAsReadMultipleNotifications(ids: number[]) {
    const response = await $api('/notifications/mark-as-read-list', {
      method: 'PATCH',
      body:
        ids

    })
    return response
  }
  //!SECTION

  return {
    NonSeenNotificationsCount, notificationsListStudent, notificationsList, notificationsFromPagination, loading, error, pageableNotifications, pushNotification, setNonSeenNotificationsCount, onLoginNotifications, markAllAsRead, removeNotification, readAllNotifications, deleteNotification, toggleSeen, toggleLocalNotification, deleteMultipleNotifications, toggleSeenMultipleNotifications, markAsReadMultipleNotifications, decrement, pushNotificationStudent
    , removeNotificationStudent,
    readAllNotificationsStudent,
    toggleLocalNotificationStudent, toggleSeenStudent
    , deleteNotificationStudent
  };
}, {
  persist: true
});

