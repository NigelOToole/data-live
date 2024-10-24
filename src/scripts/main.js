import { component, store, effect, get, set } from './data-live.js';

window.addEventListener('DOMContentLoaded', (event) => {
  
  // Demo data
  let dataArray = [
    {
      "id": 1,
      "firstname": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "phone": "(555) 555-1234",
      "address": {
        "street": "123 Main Street",
        "suite": "Apt. 4",
        "city": "Anytown",
        "zipcode": "12345-6789",
        "geo": {
          "lat": "42.1234",
          "lng": "-71.2345"
        }
      },
      "interests": [
        { "name": "Interest 1" },
        { "name": "Interest 2" },
        { "name": "Interest 3" }
      ],
    },
    {
      "id": 2,
      "firstname": "Jane",
      "lastname": "Smith",
      "email": "janesmith@example.com",
      "phone": "(555) 555-5678",
      "address": {
        "street": "456 Oak Street",
        "suite": "Suite 200",
        "city": "Anytown",
        "zipcode": "12345-6789",
        "geo": {
          "lat": "42.3456",
          "lng": "-71.6789"
        }
      }
    },
    {
      "id": 3,
      "firstname": "Bob",
      "lastname": "Johnson",
      "email": "bobjohnson@example.com",
      "phone": "(555) 555-9012",
      "address": {
        "street": "789 Elm Street",
        "suite": "Apt. 100",
        "city": "Anytown",
        "zipcode": "12345-6789",
        "geo": {
          "lat": "42.5678",
          "lng": "-71.1234"
        }
      }
    }
  ]
  
  let dataObject = {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "phone": "(555) 555-1234",
    "address": {
      "street": "123 Main Street",
      "suite": "Apt. 4",
      "city": "Anytown",
      "zipcode": "12345-6789",
      "geo": {
        "lat": "42.1234",
        "lng": "-71.2345"
      }
    },
    "interests": [
      { "name": "Interest 1" },
      { "name": "Interest 2" },
      { "name": "Interest 3" }
    ]
  }


  // Demos

  // Text
  document.querySelector('[data-live="text"] + .demo-btn').addEventListener('click', () => {
    set('text', 'Update Text'); 
    // This is the same as the above if you dont want to import set method
    // window['text']['text'] = 'Update Text';
  })


  // Input
  let input = document.querySelector('.input-text');

  function updateInputText() {
    set('input-text', input.value);
  }

  updateInputText();

  input.addEventListener('keyup', (event) => {
    updateInputText()
  });


  // Number
  function updateNumber () {
    set('seconds', get('seconds') -1);
    if (get('seconds') <= 0) clearInterval(updateNumberInterval);
  }

  let updateNumberInterval = setInterval(updateNumber, 1000);


  // Array
  let usersTemplate = (data) => {
    return `
    <ul>
        ${ data.map((item) => {
          return `<li>
            ${ item['firstname']} - ${item['address']['city'] }<br>
            ${ item['interests'] ? item['interests'].map((item) => item.name).join(', ') : '' }
          </li>`;
        }).join('')}
    </ul>`;
  }

  let usersStore = component(dataArray, 'users', usersTemplate);

  document.querySelector('.users + .demo-btn').addEventListener('click', () => {
    usersStore[0]['firstname'] = `${usersStore[0]['firstname']} updated`;
    usersStore[0]['address']['city'] = 'New Town'
    usersStore[0]['interests'][0]['name'] = 'New interest 1'
  })



  // Array item
  // There is an existing store so we just add the effect for this item
  let userZeroTemplate = (data) => {
    data = data[0];
    return `${ data['firstname']}`;
  }

  effect(usersStore, 'users', userZeroTemplate, '.user-zero');



  // Object
  let userTemplate = (data) => {
    return `
      ${ data['firstname']} - ${data['address']['city'] }<br>
      ${ data['interests'] ? data['interests'].map((data) => data.name).join(', ') : '' }
    `;
  }

  let userStore = component(dataObject, 'user', userTemplate);

  document.querySelector('.user + .demo-btn').addEventListener('click', () => {
    userStore['firstname'] = 'John updated'
    userStore['address']['city'] = 'New Town'
    userStore['interests'][0]['name'] = 'New interest 1'
  });




  // Site scripts

  // Observe header height
  const observeHeader = function() {
    let element = document.querySelector('.header');
    let height = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        let heightNew = entry.contentBoxSize[0].blockSize;

        if (height !== heightNew) {
          height = entry.contentBoxSize[0].blockSize;
  
          document.documentElement.style.setProperty(`--header-height`, `${height}px`);            
        } 
      }
  
    });
  
    resizeObserver.observe(element);
  }

  observeHeader();


  // Encoded text
  const encodeElements = document.querySelectorAll('.encode');
  for (const item of encodeElements) {
    let decode = atob(item.dataset['encode']);

    if (item.dataset['encodeAttribute']) {
      item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
    }
  }

});
