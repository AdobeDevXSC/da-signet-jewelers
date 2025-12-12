import DA_SDK from 'https://da.live/nx/utils/sdk.js';
//import { LitElement, html, nothing } from 'da-lit';
//import { loadPageTags, loadGenTags, savePageTags } from './utils.js';

// Super Lite components
import 'https://da.live/nx/public/sl/components.js';

// Application styles
//import loadStyle from '../../scripts/utils/styles.js';
//const styles = await loadStyle(import.meta.url);

// class DMTemplates extends LitElement {
//   static properties = {
//     path: { attribute: false },
//     token: { attribute: false },
//     actions: { attribute: false },
//   };
//   constructor() {
//     super();
//     this.path = '';
//     this.token = '';
//     this.actions = {};
//   }
//   render() {
//     return html`
//       <div id="dm-templates">
//         <ul class="da-group-list">
//         </ul>
//       </div>
//     `;
//   }
// }

//customElements.define('dm-templates', DMTemplates);

(async function init() {
  console.log('init');
  fetch('/extras/dm-templates.json').then(response => response.json()).then(({ data }) => {
    console.log(data);
    data.forEach(({name, dmUrl}) => {
      const li = document.createElement('li');
      li.classList.add('da-group-item');
      const button = document.createElement('button');
      button.classList.add('da-group-button');
      const thumbnail = document.createElement('img');
      thumbnail.src = dmUrl;
      thumbnail.alt = name;
      button.appendChild(thumbnail);
      const title = document.createElement('span');
      title.classList.add('da-group-title-text');
      title.textContent = name;
      button.appendChild(title);
      li.appendChild(button);
      document.querySelector('.da-group-list').appendChild(li);
    });
  }).catch(error => {
    console.error(error);
  });
}());