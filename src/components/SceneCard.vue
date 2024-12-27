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
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.card-description {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.card-preview button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
}

.card-preview button:hover {
  background: #eee;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.875rem;
  color: #666;
  background: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}
</style>