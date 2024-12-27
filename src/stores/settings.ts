import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    apiKey: localStorage.getItem('moonshotApiKey') || '',
  }),
  actions: {
    setApiKey(key: string) {
      this.apiKey = key
      localStorage.setItem('moonshotApiKey', key)
    },
  },
})