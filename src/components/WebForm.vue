<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

// props
const props = defineProps({
  formId: String
})

// form data
const aiformId = ref('9d52c6d44c1342ddf23b487b6cd4d726') // form ID for NR-AI-Form service

// internal form stuff for Vue
const myForm = ref<HTMLFormElement | null>(null);
const currentFormData = ref('')
const location = ref('')
const office = ref('')


onMounted(() => {
  /**
   * AI Form integration script
   * adds help links/divs and required html attributes
   * to the form inputs.
   * This script could be loaded from an external source in html header
   */
  const formElement = document.querySelectorAll(`[data-aif-formId="${aiformId.value}"]`);
  formElement.forEach((form) => {
    form.querySelectorAll('input, textarea').forEach((input: Element, idx: number) => {
      // insert help links corresponding to each input
      const helpTextDiv = document.createElement("div");
      helpTextDiv.classList.add('help-text');
      input.parentNode?.insertBefore(helpTextDiv, input.nextSibling);
      const helpLink = document.createElement('a');
      helpLink.href = '#';
      helpLink.textContent = 'Help';
      helpLink.setAttribute('data-aif-fieldId', idx.toString());
      helpLink.classList.add('help-link');
      helpLink.addEventListener('click', handleAssist);
      helpLink.setAttribute('data-aif-help', input.getAttribute('data-aif-help') || '');
      input.setAttribute('data-aif-fieldId', `nraiform-${idx.toString()}`);
      input.setAttribute('name', idx.toString());
      input.parentNode?.insertBefore(helpLink, input.nextSibling);
    });
  });
});

/**
 * When a help link is clicked
 * make a call to our API > AI service
 */
const handleAssist = async (event: Event) => {
  try {
    const form = document.querySelector(`[data-aif-formId="${aiformId.value}"]`);
    if(form) {
      // get formData and convert to JSON
      const formData = new FormData(form as HTMLFormElement);
      const jsonObject = Object.fromEntries(formData.entries());
      // const formJson = JSON.stringify(jsonObject);

      const field = event.currentTarget as Element;
      if(field){
        const fieldId = field.getAttribute('data-aif-fieldId');
        const data = {
          formId: aiformId.value,
          fieldId: field.getAttribute('data-aif-fieldId'),
          fieldHelp: field.getAttribute('data-aif-help'),
          // formData: {
          //   location: location.value,
          //   office: office.value,
          // },
          formData: jsonObject
        }
        console.log(data);
        const res = await axios.post(
            `http://localhost:3000/api/webform/${aiformId.value}/assist/${fieldId}`,
            data,
            { headers: { 'Content-Type': 'application/json' } }
          );

        console.log(res.data);

        const aiResponse = res.data.aiResponse
        // const helpDiv = document.createElement('div');
        // helpDiv.textContent = aiResponse;
        // field.parentNode?.insertBefore(helpDiv, field.nextSibling);
        if (field.nextSibling) {
          (field.nextSibling as HTMLElement).textContent = aiResponse;
        }

      }
    }

  } catch (err) {
    console.log(err);
  } finally {
    // submitting.value = false;
  }
};





/**
 * websocket stuff
 * could be useful for know the full form data in realtime
 */
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");
// Open connection
socket.addEventListener("open", () => {
  socket.send(JSON.stringify({
    status: `connection open`,
    formId: aiformId.value
  }));
});
// On form change, send form data to API
const handleChange = (event: Event) => {
  const form = event.currentTarget as HTMLElement;
  const formData = new FormData(form as HTMLFormElement);
  const data = {
    status: 'form changed',
    formId: aiformId.value,
    formData: Object.fromEntries(formData.entries())
    // formData: {
    //   location: location.value,
    //   office: office.value,
    // }
  }
  socket.send(JSON.stringify(data))
};
// Listen for response frm Websocket server
socket.addEventListener("message", (event) => {
  currentFormData.value =  JSON.parse(event.data);
});


</script>

<template>
  <form
    @submit.prevent=""
    @change="handleChange"
    ref="myForm"
    :data-aif-formId="aiformId"
    class="webform"
  >
  <!--:data-aif-formId="props.formId"-->
    <div>
      <label>Location:</label>
      <input
        data-aif-help="a location in Canada"
        v-model="location"
        type="text" />
    </div>
    <div>
      <label>Office:</label>
      <input
        data-aif-help="The Address of a Service BC office"
        v-model="office"
        type="text" />
    </div>
    <button
      :disabled="true"
      type="submit"
      class="submit-btn"
    >
      Submit
    </button>

  </form>

  <!-- form data via websocket-->
  <div v-if="currentFormData" id="web-socket-div">
    <h3 class="collapsible">Response from API via websocket:</h3>
    <pre class="collapsible-content">{{ currentFormData }}</pre>
  </div>
</template>

<style scoped>

form.webform {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form.webform label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

form.webform input[type="text"],
form.webform textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 4px;
  box-sizing: border-box;
}

.help-link {
  margin-left: 10px;
  font-size: 0.95em;
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.help-link:hover {
  color: #1e40af;
}

.submit-btn {
  background-color: #7d98d4;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 8rem;
}

#web-socket-div {
  margin-top: 100px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

pre {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 4px;
  font-size: 0.95em;
  overflow-x: auto;
  margin-top: 16px;
}

/* .collapsible {
  background-color: #777;
  color: white;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.active, .collapsible:hover {
  background-color: #555;
}
 */

</style>
