<template>
  <nav class="navbar">
    <router-link to="/">Site List</router-link>
    <router-link to="/quizzes">Quizzes</router-link>
    <router-link to="/settings">Settings</router-link>
  </nav>
</template>

<script setup>

</script>

<style scoped>
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f2f2f2;
  }

  .router-link-active {
    font-weight: bold;
  }

</style>
