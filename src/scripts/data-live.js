// Data Live
const attributeSelector = 'live';
const storeAttributeSelector = 'live-store';


function bracketToDot (key) {
  return key.replace(/'/g, '').replace(/"/g, '').replaceAll('[', '.').replaceAll(']', '.').replaceAll('..', '.').replace(/\.$/g, '').replace(/^\./g, '');;
};

function getValueFromString (data, key) {
  return bracketToDot(key)
  .split('.')
  .reduce((accumulator, current) => {
    return accumulator && accumulator?.[current];
  }, data);
}


const getStore = (key, store) => (store === window) ? window[key] : store;

function get (key, store = window) {
  let currentStore = getStore(key, store);
  if (currentStore) return currentStore[key];
}

function set (key, value, store = window) {
  let currentStore = getStore(key, store);
  if (currentStore) currentStore[key] = value;
}

function emitUpdate (data, name) {
  const event = new CustomEvent(name, {
    bubbles: true, 
    cancelable: true,
    detail: data,
  });

  document.dispatchEvent(event);
}

function effect (data, name, template, selector) {
  document.addEventListener(name, (event) => {
    let output = template(event.detail);
    if (output === undefined) return;
    
    if (typeof selector === 'string') {
      let elements = document.querySelectorAll(selector);

      for (const item of elements) {
        item.innerHTML = output;
      }    
    }
    else {
      selector.innerHTML = output;
    }
 
  });

  emitUpdate(data, name);
}


function store (data = {}, name = 'store') {

  function handler (name, data) {
    return {
      get (obj, prop) {
        if (prop === '_isProxy') return true;
        if (['object', 'array'].includes(Object.prototype.toString.call(obj[prop]).slice(8, -1).toLowerCase()) && !obj[prop]._isProxy) {
          obj[prop] = new Proxy(obj[prop], handler(name, data));
        }
        return obj[prop];
      },        
      set (obj, prop, value) {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        emitUpdate(data, name);
        return true;
      },
      deleteProperty (obj, prop) {
        delete obj[prop];
        emitUpdate(data, name);
        return true;
      }
    };
  }

  return new Proxy(data, handler(name, data));
}


function component (data, name, template, selector = '') {
  if (!selector) selector = `.${name}`;

  let currentStore = store(data, name);
  effect(currentStore, name, template, selector);

  let elements = document.querySelectorAll(`[data-${storeAttributeSelector}=${name}]`);
  for (const item of elements) {
    let template = () => getValueFromString(currentStore, item.dataset[attributeSelector]);
    effect(currentStore, name, template, item);
  }

  return currentStore;
}


function init () {
  let elements = document.querySelectorAll(`[data-${attributeSelector}]:not([data-${storeAttributeSelector}])`);

  for (const item of elements) {
    const name = item.dataset[attributeSelector];

    if (!window[name]) {
      let data = { [name]: item.textContent };
      let template = (data) => data[name];
      let selector = `[data-${attributeSelector}=${name}]`;

      window[name] = component(data, name, template, selector);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
  
export { component, store, effect, get, set };
