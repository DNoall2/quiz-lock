<template>
  <div>
    <NavBar />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
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
