<template>
    <VAlert
      class="ma-5"
      variant="tonal"
      prominent
      :type="props?.type"
    >
     <template #title>
        {{props?.title}}
      </template>
      <template #text>
        {{props?.text}}
      </template>
    </VAlert>
</template>

<script setup lang="ts">

type Status = 'error' | 'success' | 'info' | 'warning';


interface Props{
  title:String,
  text:String,
  type:Status
}

const props = defineProps<Props>();


</script>
