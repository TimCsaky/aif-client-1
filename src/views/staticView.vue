<script setup lang="ts">
import { onBeforeMount } from 'vue'

onBeforeMount(() => {

// Link to Form AI script
// there are better ways of doing this.
  const inlineScript = document.createElement('script');
  inlineScript.id = 'form-assist-inline-script';
  inlineScript.textContent = `
  const formAssistClient = {
      client: '79376007',
      url: window.location.href
  }`;
  if (!document.getElementById("form-assist-inline-script")) document.body.appendChild(inlineScript);

  const externalScript = document.createElement('script')
  externalScript.id = 'form-assist-external-script';
  externalScript.type = 'module'
  externalScript.src = 'http://localhost:3000/script.js'
  if (!document.getElementById("form-assist-external-script"))  document.body.appendChild(externalScript)
})

</script>

<template>
  <main>
    <div class="instructions">
      <p>This webpage represents the client's webform.
        client links to our javascript:</p>
      <pre>{{  `<script>
      const formAssistClient = {
          client: '79376007',
          url: window.location.href
      }
      </script>
      <script type="module" src="http://localhost:3000/script.js"></script>`
        }}</pre>
      <br />
      <p>Our javascript does the following:</p>
      <ul>
        <li>uses html DOM to:
          <ul>
            <li>create a JSON schema representing the form</li>
            <li>create a JSON object representing the form values</li>
          </ul>
          Form must have an 'name' attribute and inputs must have 'name' attribute
        </li>
        <li>Adds an iframe and sets up basic auth to our service</li>
        <li>iframe makes calls to the 'field assist' endpoint of our AI Form service, passing the form schema, data and
          current
          field:<br />
          GET {{ `http://form-service/api/v2/<formName>/assist<fieldName>` }}</li>
      </ul>
    </div>
    <div class="content">
      <form name="water" action="server.aspx">

        <table>
          <tbody>
            <tr>
              <td>
                <span><label for="weather">What is typical weather for Victoria, BC?</label><br />
                <small>AI Form service uses this label as a prompt for querying client's RAG</small></span>
              </td>
              <td>
                <input type="text" name="weather">
                <br /><br />
              </td>
            </tr>
            <tr>
              <td>
                <span>Will you walk to work?<br />
                <small>AI Form service uses the input value as 'context' to reference when helping with other form fields.</small></span>
              </td>
              <td>
                <input type="radio" value="Yes" name="walk">&nbsp;Yes&nbsp;&nbsp;
                <input type="radio" value="No" name="walk">&nbsp;No
                <br /><br /><br />
              </td>
            </tr>
            <tr>
              <td>
                <span>Will you bring a rain coat<br />
                <small>AI Form service will suggest a value based on context </small></span>
              </td>
              <td>
                <input type="radio" value="Yes" name="coat">&nbsp;Yes&nbsp;&nbsp;
                <input type="radio" value="No" name="coat">&nbsp;No
                <br /><br /><br />
              </td>
            </tr>

            <tr>
              <td>
              </td>
              <td>
                <input type="submit" value="Submit" class="submit-btn" disabled />
              </td>
            </tr>
          </tbody>
        </table>


      </form>
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

</style>
