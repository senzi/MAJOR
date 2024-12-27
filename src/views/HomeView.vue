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
    <PreviewModal
      v-model:visible="previewVisible"
      :scene="selectedScene"
      v-if="selectedScene"
    />
  </div>
</template>



复制
<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import SceneCard from '@/components/SceneCard.vue'
import PreviewModal from '@/components/PreviewModal.vue'
import { scenes } from '@/data/scenes'
import type { Scene } from '@/types/scene'
import { ref } from 'vue'

const router = useRouter()
const previewVisible = ref(false)
const selectedScene = ref<Scene | null>(null)

const goToChat = (scene: Scene) => {
  router.push(`/chat/${scene.id}`)
}

const previewScene = (scene: Scene) => {
  selectedScene.value = scene
  previewVisible.value = true
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