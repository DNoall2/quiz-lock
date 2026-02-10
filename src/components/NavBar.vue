<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link" active-class="active-link"
      >Site List</router-link
    >
    <router-link to="/quizzes" class="nav-link" active-class="active-link"
      >Quiz List</router-link
    >
    <router-link to="/settings" class="nav-link" active-class="active-link"
      >Settings</router-link
    >
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background-color: var(--surface-1);
  border-bottom: 1px solid var(--accent-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", Roboto, sans-serif;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #000;
}

.active-link {
  background-color: var(--accent-color);
  color: white;
  font-weight: 600;
}
</style>
