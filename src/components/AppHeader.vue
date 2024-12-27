<template>
    <div class="header">
      <div class="left">
        <h1>Scene Generator</h1>
      </div>
      <div class="right">
        <button @click="openSettings">Settings</button>
      </div>
      <SettingsModal 
        v-model:visible="settingsVisible"
        :api-key="settingsStore.apiKey"
        @save="saveApiKey"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useSettingsStore } from '@/stores/settings'
  import SettingsModal from './SettingsModal.vue'
  
  const settingsVisible = ref(false)
  const settingsStore = useSettingsStore()
  
  const openSettings = () => {
    settingsVisible.value = true
  }
  
  const saveApiKey = (key: string) => {
    settingsStore.setApiKey(key)
    settingsVisible.value = false
  }
  </script>
  
  <style scoped>
  .header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  </style>