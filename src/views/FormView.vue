<script setup lang="ts">
import WebForm from '../components/WebForm.vue'

const props = defineProps({
  formId: String
})
</script>

<template>
  <main>
    <div class="instructions">
      <p>In this example javascript to:</p>
      <ul>   
   * 
   * to the form inputs.
   * This script could be loaded from an external source in html header

        <li>insert help links
        
          Form must have an 'id' attribute and inputs must have 'name' attribute
        </li>
        <li>Adds a chat UI (not using iframe)</li>
        <li>makes calls to the V1 'field assist' endpoint of our service:<br />
          GET {{ `http://form-service/api/v1/<formId>/assist<fieldId>` }}</li>
        <li>Demonstrates how we can connect to our api via a websocket.</li>
      </ul>
    </div>
  <div class="content">
    <WebForm :form-id="props.formId"/>
  </div>
  </main>
</template>
<style scoped>
.instructions {
  margin: 2rem auto;
}

ul {
  padding-left: 1rem;
}

td {
  padding: 0.5rem;
}
tr > td:first-child {
  width: 20rem;
}
</style>



