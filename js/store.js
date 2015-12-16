var db;

function indexedDBOk() {
    return "indexedDB" in window;
}

document.addEventListener("DOMContentLoaded", function() {

  //No support? Go in the corner and pout.
  if(!indexedDBOk) return;

  var openRequest = indexedDB.open("idarticle_people",2);

  openRequest.onupgradeneeded = function(e) {
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains("people")) {
      var os = thisDB.createObjectStore("people", {autoIncrement:true});
      //I want to get by name later
      os.createIndex("name", "name", {unique:false});
      //I want email to be unique
      os.createIndex("email", "email", {unique:true});
    }
  }

  openRequest.onsuccess = function(e) {
    console.log("running onsuccess");

    db = e.target.result;

    //Listen for add clicks
    document.querySelector("#addButton").addEventListener("click", addPerson, false);
    //document.querySelector("#getPersonButton").addEventListener("click", getPerson, false);
    document.querySelector("#getButton").addEventListener("click", getPeople, false);
  }

  openRequest.onerror = function(e) {
      //Do something for the error
  }

},false);

function addPerson(e) {
  var name = document.querySelector("#name").value;
  var email = document.querySelector("#email").value;

  console.log("About to add "+name+"/"+email);

  var transaction = db.transaction(["people"],"readwrite");
  var store = transaction.objectStore("people");

  //Define a person
  var person = {
    name:name,
    email:email,
    created: Date.now()
  }

  //Perform the add
  var request = store.add(person);

  request.onerror = function(e) {
    console.log("Error",e.target.error.name);
    //some type of error handler
  }

  request.onsuccess = function(e) {
    console.log("Woot! Did it");
  }
}

function getPerson(e) {
  var key = document.querySelector("#key").value;
  if(key === "" || isNaN(key)) return;

  var transaction = db.transaction(["people"],"readonly");
  var store = transaction.objectStore("people");

  var request = store.get(Number(key));

  request.onsuccess = function(e) {

      var result = e.target.result;
      console.dir(result);
      if(result) {
          var s = "<h2>Key "+key+"</h2><p>";
          for(var field in result) {
              s+= field+"="+result[field]+"<br/>";
          }
          document.querySelector("#status").innerHTML = s;
      } else {
          document.querySelector("#status").innerHTML = "<h2>No match</h2>";
      }
  }
}

function getPeople(e) {
  var name = document.querySelector("#nameSearch").value;
  var endname = document.querySelector("#nameSearchEnd").value;
  if(name == "" && endname == "") return;
  var transaction = db.transaction(["people"],"readonly");
  var store = transaction.objectStore("people");
  var index = store.index("name");
  //Make the range depending on what type we are doing
  var range;
  if(name != "" && endname != "") {
    range = IDBKeyRange.bound(name, endname);
  } else if(name == "") {
    range = IDBKeyRange.upperBound(endname);
  } else {
    range = IDBKeyRange.lowerBound(name);
  }
  var s = "";
  index.openCursor(range).onsuccess = function(e) {
    var cursor = e.target.result;
    if(cursor) {
      s += "<h2>Key "+cursor.key+"</h2><p>";
      for(var field in cursor.value) {
        s+= field+"="+cursor.value[field]+"<br/>";
      }
      s+="</p>";
      cursor.continue();
    }
    document.querySelector("#status").innerHTML = s;
  }
}
