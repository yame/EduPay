import { getNotificationTime } from "@/@core/utils/helpers";
import { Notification } from "@/@layouts/types";
export const useNotificationStore = defineStore("notification", () => {
  const notificationsList = ref<Notification[]>([])

  function pushNotification(message: Notification) {
    console.log(message);
    const jsonObject = JSON.parse(message);
    console.log(jsonObject);
    const notification: Notification = {
      id: jsonObject.email,
      icon: 'tabler-school',
      title: `New Registration ⚡`,
      subtitle: jsonObject.message,
      time: getNotificationTime(jsonObject.registerDate),
      isSeen: jsonObject.seen,
      color: 'warning'
    };

    // //👉 - Check if a notification has the same id already exists
    // const exists = notificationsList.value.some((n) => n.id === notification.id)
    // if (!exists)
    notificationsList.value.push(notification)
  }

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


  return { notificationsList, pushNotification, onLoginNotifications, markAllAsRead }
}
) 
