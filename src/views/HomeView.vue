<template>
  <div class="home">
    <AppHeader />
    <main>
      <div class="scenes-grid">
        <SceneCard
          v-for="scene in scenes"
          :key="scene.id"
          :scene="scene"
          @click="goToChat(scene)"
          @preview="previewScene(scene)"
        />
      </div>
    </main>
  </div>
</template>



复制
<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import SceneCard from '@/components/SceneCard.vue'
import { scenes } from '@/data/scenes'
import type { Scene } from '@/types/scene'

const router = useRouter()

const goToChat = (scene: Scene) => {
  router.push(`/chat/${scene.id}`)
}

const previewScene = (scene: Scene) => {
  // 实现预览逻辑
  console.log('Preview scene:', scene)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
</style>