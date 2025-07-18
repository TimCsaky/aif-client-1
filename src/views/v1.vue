<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

/**
 * AI Form integration example
 * adds help links to the form inputs.
 * calls our 
 * This script could be loaded from an external source in html header
 */

// internal form stuff for Vue
const currentFormData = ref('')
const location = ref('')
const office = ref('')


onMounted(() => {
  
  // @ts-ignore
  const form = document.forms['myFormName'];
  form.querySelectorAll('input, textarea').forEach((input: any) => {
    // insert help links corresponding to each input
    const helpTextDiv = document.createElement("div");
    helpTextDiv.classList.add('help-text');
    input.parentNode?.insertBefore(helpTextDiv, input.nextSibling);
    const helpLink = document.createElement('a');
    helpLink.href = '#';
    helpLink.textContent = 'Help';
    helpLink.setAttribute('data-field-name', (input.name).toString());
    helpLink.classList.add('help-link');
    helpLink.setAttribute('data-help', input.getAttribute('data-help') || '');
    helpLink.addEventListener('click', handleAssist);
    input.parentNode?.insertBefore(helpLink, input.nextSibling);
  });

  // hide chat iframe from other demo
  const iframe = document.getElementById("chat-iframe");
  if(iframe) iframe.style.display = "none";

});

/**
 * When a help link is clicked
 * make a call to our API > AI service
 */
const handleAssist = async (event: Event) => {
  try {
    const helpLink = event.currentTarget as any;
    const form = helpLink.closest("form");
    const data = {
      formName: 'myFormName',
      fieldName: helpLink.getAttribute('data-field-name'),
      fieldHelp: helpLink.getAttribute('data-help'),
      formData: Object.fromEntries((new FormData(form as HTMLFormElement)).entries()),
      formSchema: {} // see other demo
    }
    console.log(data);

    // post data to our AI Form API
    const response = await axios.post(
        `http://localhost:3000/api/v1/assist`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
    console.log(response.data);
    const aiResponse = response.data.aiResponse

    // add ai response to DOM
    if (helpLink.nextSibling) {
      (helpLink.nextSibling as HTMLElement).textContent = aiResponse;
    }
  } catch (err) {
    console.log(err);
  } 
};


/**
 * websocket stuff
 * could be useful for getting assistance in realtime
 */
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");
// Open connection
socket.addEventListener("open", () => {
  socket.send(JSON.stringify({
    status: `connection open`,
    // formName: aiformId.value
  }));
});
// On form change, send form data to API
const handleChange = (event: Event) => {
  const form = event.currentTarget as HTMLElement;
  const formData = new FormData(form as HTMLFormElement);
  const data = {
    status: 'form changed',
    formData: Object.fromEntries(formData.entries())
  }
  // just for demo
  // DON'T DO THIS IN PRODUCTION
  socket.send(JSON.stringify(data))
};
// Listen for response frm Websocket server
socket.addEventListener("message", (event) => {
  currentFormData.value =  JSON.parse(event.data);
});


</script>

<template>
  <main>
    <div class="instructions">
      <p>This example uses javascript to:</p>
      <ul> 
        <li>Add help links to the form inputs.</li>
        <li>make calls to the V1 'field assist' endpoint of our service:<br />
          GET {{ `http://form-service/api/v1/assist` }}</li>
        <li>connect to our api via a websocket.</li>
      </ul>
      <p>html form and input elements must have a 'name' attribute</p>
    </div>
  <div class="content">
  <!-- ref="myForm" -->
  <form
    @submit.prevent=""
    @input="handleChange"
    
    name="myFormName"
    class="webform"
  >
  <!--:data-aif-formId="props.formId"-->
    <div>
      <label>Location:</label>
      <input
        data-help="a location in Canada"
        v-model="location"
        name="location"
        type="text" />
    </div>
    <div>
      <label>Office:</label>
      <input
        data-help="The Address of a Service BC office"
        v-model="office"
        name="office"
        type="text" />
    </div>
    <!-- <button
      :disabled="true"
      type="submit"
      class="submit-btn"
    >
      Submit
    </button> -->

  </form>

  <!-- form data via websocket-->
  <div v-if="currentFormData" id="web-socket-div">
    <h3 class="collapsible">Response from API via websocket:</h3>
    <pre class="collapsible-content">{{ currentFormData }}</pre>
  </div>
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




