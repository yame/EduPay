<script lang="ts" setup>
import { router } from '@/plugins/1.router';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Notification } from '@layouts/types';

const notificationStore = useNotificationStore()
const { notificationsList, notificationsListStudent, NonSeenNotificationsCount } = storeToRefs(notificationStore)
const { markAllAsRead, toggleSeen, toggleLocalNotification, deleteNotification, removeNotification, readAllNotifications, toggleSeenStudent, deleteNotificationStudent, toggleLocalNotificationStudent, removeNotificationStudent } = notificationStore

const badgeProps = ref({ content: notificationsList.value.length, max: '99', showMenu: false })
const router = useRouter();

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

badgeProps.value.content = notificationsList.value.length

watch(notificationsList, (newNotificationsList: Notification[]) => {
  notificationsList.value = newNotificationsList
})

watch(notificationsListStudent, (newNotificationsListStudent: Notification[]) => {
  notificationsListStudent.value = newNotificationsListStudent
})

//👉 - Delete from BD and from local notificationList Data
const remNotification = (notificationId: number) => {
  if (currentUser.value?.role === 'ADMIN')
    deleteNotification(notificationId).then((res) => {
      removeNotification(notificationId);
    })
  else {
    deleteNotificationStudent(notificationId).then((res) => {
      removeNotificationStudent(notificationId);
    })
  }
}

//👉 - Mark All read api and local data
const markAllRead = (allNotificationsIds: number[]) => {
  if (currentUser.value?.role === 'ADMIN')
    markAllAsRead().then(() => {
      readAllNotifications(allNotificationsIds)
    })
}

//👉 - Mark read for local data and toggle for the api
const markRead = (notificationId: number) => {
  if (currentUser.value?.role === 'ADMIN')
    toggleSeen(notificationId).then((res) => {
      toggleLocalNotification(notificationId)
    })
  else {
    toggleSeenStudent(notificationId).then((res) => {
      toggleLocalNotificationStudent(notificationId)
    })
  }
}

//👉 - Mark unread for local data and toggle for the api
const markUnRead = (notificationId: number) => {
  if (currentUser.value?.role === 'ADMIN')
    toggleSeen(notificationId).then((res) => {
      toggleLocalNotification(notificationId)
    })
  else {
    toggleSeenStudent(notificationId).then((res) => {
      toggleLocalNotificationStudent(notificationId)
    })
  }
}

//👉 - handle each click notification
const handleNotificationClick = (notification: Notification) => {
  if (currentUser.value?.role === 'ADMIN') {
    if (!notification.isSeen)
      markRead(notification.id)
    notification.paymentId === undefined ? router.push(`/admin/notification/registration/${notification.email}`) : router.push(`/admin/notification/payment/${notification.paymentId}`)
    toggle(false)
  }
  else {
    if (!notification.isSeen)
      markRead(notification.id)
    console.error(notification.subtitle);

    router.push(`/student/${notification.paymentId}`)
    toggle(false)

  }
}

//👉 - Event emitters that offers toggling the menu of notification when it needs
const toggle = (val) => {
  badgeProps.value.showMenu = val
}



//👉 - Passing Only 10 first notifications 
const displayedNotifications = computed(() => {
  if (currentUser.value?.role === 'ADMIN')
    return notificationsList.value.slice(0, 10);
  if (currentUser.value?.role === 'STUDENT')
    return notificationsListStudent.value
});

</script>

<template>
  <div v-if="currentUser">
    <Notifications :notifications="displayedNotifications" :badge-props="badgeProps" @mark-all-read="markAllRead" @remove="remNotification" @read="markRead" @unread="markUnRead" @click:notification="handleNotificationClick" @toggle-menu="toggle" />

  </div>

</template>
