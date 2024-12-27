<template>
  <div class="card" @click="$emit('click')">
    <h3 class="card-title">{{ scene.title }}</h3>
    <p class="card-description">{{ scene.description }}</p>
    <div class="card-preview">
      <button @click.stop="$emit('preview')">预览示例</button>
    </div>
    <div class="card-tags">
      <span v-for="tag in scene.tags" :key="tag" class="tag">
        #{{ tag }}
      </span>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import type { Scene } from '@/types/scene'

defineProps<{
  scene: Scene
}>()

defineEmits<{
  click: []
  preview: []
}>()
</script>
  
<style scoped>
.card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--primary-light);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.card-description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-preview button {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.card-preview button:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: white;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--background);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
}
</style>