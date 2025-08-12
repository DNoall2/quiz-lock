<template>
  <div>
    <NavBar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}


.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
<style>
:root {
  --color-background-light: #fff;
  --color-background-highlight-light: #f5f5f5;

  --color-background-dark: #504945;
  --color-background-highlight-dark: #665c54;

  --color-accent: #d65d0e;
  --color-accent-dark: #b94c0a;
  --color-accent-light: #e8a400;

  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-error: #f44336;
  --color-info: #00bcd4;
}

</style>
