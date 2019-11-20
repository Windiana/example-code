var dbPromise = idb.open('tasks-store', 1, function(db) {
  console.log('open idb')
  if (!db.objectStoreNames.contains('tasks')) {
    db.createObjectStore('tasks', {keyPath: 'id'});
  }
});

function test() {
  console.log('asdsadsadasdad')
}

function writeToStore(storeName, data) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(storeName, 'readwrite')
      var store = tx.objectStore(storeName)
      store.put(data)
      return tx.complete
    })
}

function readStore(storeName) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(storeName, 'readonly')
      var store = tx.objectStore(storeName)
      return store.getAll()
    })
}

function clearStore(storeName) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(storeName, 'readwrite')
      var store = tx.objectStore(storeName)
      store.clear()
      return tx.complete
    })
}