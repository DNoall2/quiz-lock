<template>
  <button class="icon-button" @click="$emit('click')">
    <Icon :path="path" :size="size" />
    {{ label }}
  </button>
</template>

<script setup>
import Icon from './Icon.vue';

defineProps({
  path: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24,
  },
  label: {
    type: String,
    required: false,
    default: null,
  }
});

defineEmits(['click']);


</script>

<style scoped>

.icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
}

.icon-button:hover {
  cursor: pointer;
}

</style>
