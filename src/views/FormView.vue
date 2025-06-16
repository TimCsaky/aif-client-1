<script setup lang="ts">
import WebForm from '../components/WebForm.vue'

const props = defineProps({
  formId: String
})
</script>

<template>
  <main>
  <div class="content">
    <WebForm :form-id="props.formId"/>
  </div>
  </main>
</template>


