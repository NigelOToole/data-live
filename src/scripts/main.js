import { component, store, effect, get, set } from './data-live.js';

window.addEventListener('DOMContentLoaded', (event) => {
  
  // Demo data
  let dataArray = [
    {
      "id": 1,
      "firstname": "Bob",
      "lastname": "Belcher",
      "email": "bob@example.com",
      "phone": "(555) 555-1234",
      "address": {
        "street": "123 Ocean Avenue",
        "suite": "Apt. 1",
        "city": "Seymour's Bay",
        "zipcode": "12345-6789"
      },
      "interests": [
        { "name": "Cooking" },
        { "name": "Appliances" },
        { "name": "Foreign films" }
      ],
    },
    {
      "id": 2,
      "firstname": "Linda",
      "lastname": "Belcher",
      "email": "linda@example.com",
      "phone": "(555) 555-1234",
      "address": {
        "street": "123 Ocean Avenue",
        "suite": "Apt. 1",
        "city": "Seymour's Bay",
        "zipcode": "12345-6789"
      }
    },
    {
      "id": 3,
      "firstname": "Tina",
      "lastname": "Belcher",
      "email": "tina@example.com",
      "phone": "(555) 555-1234",
      "address": {
        "street": "123 Ocean Avenue",
        "suite": "Apt. 1",
        "city": "Seymour's Bay",
        "zipcode": "12345-6789"
      }
    }
  ]
  
  let dataObject = {
    "id": 1,
    "firstname": "Bob",
    "lastname": "Belcher",
    "email": "bob@example.com",
    "phone": "(555) 555-1234",
    "address": {
      "street": "123 Ocean Avenue",
      "suite": "Apt. 1",
      "city": "Seymour's Bay",
      "zipcode": "12345-6789"
    },
    "interests": [
      { "name": "Cooking" },
      { "name": "Appliances" },
      { "name": "Foreign films" }
    ]
  }


  // Demos

  // Text
  document.querySelector('[data-live="text"] + .demo-btn').addEventListener('click', () => {
    set('text', 'Update Text'); 
    // This is the same as the above if you dont want to import the set method
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

  document.querySelector('[data-live="seconds"] + .demo-btn').addEventListener('click', () => {
    set('seconds', 3600);
  })


  // Array
  let usersTemplate = (data) => {
    return `
    <ul>
        ${ data.map((item) => {
          return `<li>
            ${ item['firstname']} ${ item?.['address']?.['city'] ? ` - ${item?.['address']?.['city']}` : '' }<br>
            ${ item['interests'] ? item['interests'].map((item) => item.name).join(', ') : '' }
          </li>`;
        }).join('')}
    </ul>`;
  }

  let usersComponent = component(dataArray, 'users', usersTemplate);

  document.querySelector('.users + .demo-btn').addEventListener('click', () => {
    usersComponent[0]['firstname'] = `${usersComponent[0]['firstname']} updated`;
    usersComponent[0]['interests'][0]['name'] = 'Cooking burgers';
  }) 

  document.querySelector('.users + .demo-btn + .demo-btn').addEventListener('click', () => {
    usersComponent.push({"firstname": "Gene"});
    usersComponent.push({"firstname": "Louise"});
  })


  // Array item
  // There is an existing store so we just add the effect for this item
  let userZeroTemplate = (data) => {
    data = data[0];
    return `${ data?.['firstname']}`;
  }

  effect(usersComponent, 'users', userZeroTemplate, '.user-zero');


  // Object
  let userTemplate = (data) => {
    return `
      ${ data['firstname']} - ${data['address']['city'] }<br>
      ${ data['interests'] ? data['interests'].map((data) => data.name).join(', ') : '' }
    `;
  }

  let userComponent = component(dataObject, 'user', userTemplate);

  document.querySelector('.user + .demo-btn').addEventListener('click', () => {
    userComponent['firstname'] = 'Bob updated'
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
