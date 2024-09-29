<script lang="ts" setup>
import { router } from '@/plugins/3.router';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Notification } from '@layouts/types';

const notificationStore = useNotificationStore()
const { notificationsList } = storeToRefs(notificationStore)
const { markAllAsRead, toggleSeen, toggleLocalNotification, deleteNotification, removeNotification, readAllNotifications } = notificationStore

const badgeProps = ref({ content: notificationsList.value.length, max: '99', showMenu: false })
const router = useRouter();

badgeProps.value.content = notificationsList.value.length


//👉 - Delete from BD and from local notificationList Data
const remNotification = (notificationId: number) => {
  deleteNotification(notificationId).then((res) => {
    removeNotification(notificationId);
  })

}

// watch(notificationsList, (newNotificationsList: Notification[]) => {
//   notificationsList.value = newNotificationsList
// })

//👉 - Mark All read api and local data
const markAllRead = (allNotificationsIds: number[]) => {
  markAllAsRead().then(() => {
    readAllNotifications(allNotificationsIds)
  })
}

//👉 - Mark read for local data and toggle for the api
const markRead = (notificationId: number) => {
  toggleSeen(notificationId).then((res) => {
    toggleLocalNotification(notificationId)
  })
}

//👉 - Mark unread for local data and toggle for the api
const markUnRead = (notificationId: number) => {
  toggleSeen(notificationId).then((res) => {
    toggleLocalNotification(notificationId)
  })
}

//👉 - handle each click notification
const handleNotificationClick = (notification: Notification) => {
  if (!notification.isSeen)
    markRead(notification.id)
  notification.paymentId === undefined ? router.push(`/notification/registration/${notification.email}`) : router.push(`/notification/payment/${notification.paymentId}`)
  toggle(false)

}

//👉 - Event emitters that offers toggling the menu of notification when it needs
const toggle = (val) => {
  badgeProps.value.showMenu = val
}

// 👉 - Sort notifications before passing them to the child component
// const sortedNotifications = computed(() => {
//   return notificationsList.value.sort((a, b) => {
//     // First, sort by isSeen (false should come before true)
//     const seenComparison = Number(a.isSeen) - Number(b.isSeen);

//     // If isSeen is the same, sort by registerDate (most recent first)
//     if (seenComparison === 0) {
//       return new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime();
//     }
//     return seenComparison;
//   });
// });

//👉 - Passing Only 10 first notifications 
const displayedNotifications = computed(() => {
  return notificationsList.value.slice(0, 10);
});

</script>

<template>
  <Notifications :notifications="displayedNotifications" :badge-props="badgeProps" @mark-all-read="markAllRead" @remove="remNotification" @read="markRead" @unread="markUnRead" @click:notification="handleNotificationClick" @toggle-menu="toggle" />
</template>
