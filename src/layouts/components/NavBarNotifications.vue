<script lang="ts" setup>
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Notification } from '@layouts/types';

const notificationStore = useNotificationStore()
const { notificationsList } = storeToRefs(notificationStore)
const { markAllAsRead } = notificationStore

// const notifications = ref<Notification[]>([
//   {
//     id: 1,
//     img: avatar4,
//     title: 'Congratulation Flora! 🎉',
//     subtitle: 'Won the monthly best seller badge',
//     time: 'Today',
//     isSeen: false,
//     color: 'error'
//   }
// ])

const removeNotification = (notificationId: number) => {
  notificationsList.value.forEach((item, index) => {
    if (notificationId === item.id)
      notificationsList.value.splice(index, 1)
  })
}

const markRead = (notificationId: number[]) => {
  notificationsList.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
}

const markUnRead = (notificationId: number[]) => {
  notificationsList.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = (notification: Notification) => {
  if (!notification.isSeen)
    markRead([notification.id])
}
</script>

<template>
  <Notifications :notifications="notificationsList" @remove="removeNotification" @read="markRead" @unread="markUnRead" @click:notification="handleNotificationClick" />
</template>
