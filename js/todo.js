var todo = document.forms['todo'];
var input = todo.description;
var todoListEl = document.getElementById('todo');
var todoList = [];
var id = 0;

function onFormSubmit(event) {
  event.preventDefault();

  if(input.value === '') {
    return false;
  } else {
    var todo = {};

    todo.id = ++id;
    todo.name = input.value;
    todoList.push(todo);
    db.add(todo);

    input.value = '';

    updateView();
  }
}

function onDeletButtonClick(event) {
  var id = parseInt(event.target.dataset.id);

  todoList.forEach(function(element, index, array) {
    if(element.id === id) {
      todoList.splice(index, 1);
    }
  });

  updateView();
}

function updateView() {
  var fragment = document.createDocumentFragment();

  todoList.forEach(function(element, index, array) {
    var li = document.createElement('li');
    var button = document.createElement('button');

    button.textContent = 'x';
    button.dataset.id = element.id;

    li.textContent = element.name;
    li.appendChild(button);

    fragment.appendChild(li);
  });

  todoListEl.innerHTML = '';
  todoListEl.appendChild(fragment);
}

var datastore = null;
var db = {
  open: function() {
    console.log('DB opened');
    var request = window.indexedDB.open('todos', 1);

    request.onerror = function(event) {
      console.warn('error');
    };

    request.onsucess = function(event) {
      datastore = event.target.result;
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;

      var objectStore = db.createObjectStore("todo", { keyPath: "id" });

      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("description", "description", { unique: false });
    };
  },

  add: function(todo) {
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');

    var request = objStore.put(todo);

    request.onsuccess = function(e) {
      console.log('added');
    };

    request.onerror = db.onerror;

  }
};

var app = {
  init: function() {
    console.log('App initialize!');
    db.open();
  }
};

function onWindowLoad(event) {
  console.log('Window load');
  window.removeEventListener("load", onWindowLoad, false);
  app.init();
}

todoListEl.addEventListener('click', onDeletButtonClick, false);
todo.addEventListener('submit', onFormSubmit, false);
window.addEventListener('load', onWindowLoad, false);
