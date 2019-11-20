importScripts('/src/js/idb.js')
importScripts('/src/js/dbConn.js')

var CACHE_STATIC_NAME = 'static-files-v65'
var CACHE_DYNAMIC_NAME = 'dynamic-static-files-v65'
var STATIC_FILES_ARRAY = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/css/simple-sidebar.css',
  '/src/css/custom.css',
  '/src/images/favicon.ico',
  '/src/js/jquery.min.js',
  '/src/js/bootstrap.min.js',
  '/src/js/main.js',
  '/src/js/custom.js',
  '/src/images/banner.jpg',
  '/src/js/idb.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
]

// Listen for install event, set callback
self.addEventListener('install', function(event) {
  // Perform some task
  console.log('[Service worker]: installing service worker', event)
  
  // 2. SW + Caching
  // pre cache app shell 
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Caching app shell...')
        // cache.add('/')
        // cache.add('/index.html')
        // cache.add('/src/js/main.js')
        cache.addAll(STATIC_FILES_ARRAY)
      })
      .then(function() {
        self.skipWaiting();
      })
  )
  
});

self.addEventListener('activate', function(event) {
  // Perform some task
  console.log('[Service worker]: activating service worker', event)
  // 4. SW + Caching
  // clean old caches 
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service worker]: removing all caches...', key)
            return caches.delete(key)
          }
        }))
      })
  )
  return self.clients.claim()
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if(response) {
//           return response
//         } else {
//           // 3. SW + Caching
//           // cache whats coming back from request 
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   // comment if you want to try "save later example"
//                   cache.put(event.request.url, res.clone())
//                   return res;
//                 })
//                 .catch(function(err) {
//                   console.log('ada error ?')
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/offline.html')
//                 })
//             })
//         }
//       })
//   )
// });

// Strategy : cache then network & dynamic caching 

self.addEventListener('fetch', event => {
  var url = 'https://vue-pwa-tutor.firebaseio.com/tasks.json'

  // sebelum indexedDB to try catch and network stategy
  // if(event.request.url.indexOf(url) > -1) {
  //   event.respondWith(
  //     caches.open(CACHE_DYNAMIC_NAME)
  //       .then(function(cache) {
  //         return fetch(event.request)
  //           .then(function(res) {
  //             cache.put(event.request, res.clone())
  //             return res
  //           })
  //       })
  //   )
  // end of : sebelum indexedDB to try catch and network stategy

  // setelah ada indexedDB, apabila ada fetch ke url ini, response nya mau di store di indexedDB. (belum dipanggil tp sesudahnya)
  if(event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request)
        .then(function(res) {
          var clonedRes = res.clone()
          clearStore('tasks')
            .then(function() {
              return clonedRes.json()
            })
            .then(function(data) {
              for(key in data) {
                writeToStore('tasks', data[key])
              }
            })
          
          return res;
        })
    )
    // end of : setelah ada indexedDB,

  // } else if(new RegExp('\\b' + STATIC_FILES_ARRAY.join('\\b|\\b') + '\\b').test(event.request.url)) {
  //   event.respondWith(
  //     caches.match(event.request)
  //     .then(function(response) {
  //       if(response) {
  //         return response
  //       }
  //     })
  //   )
  } else {
    // use our old strategies (cache with network strategy)
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if(response) {
            return response
          } else {
            // 3. SW + Caching
            // cache whats coming back from request 
            return fetch(event.request)
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    // comment if you want to try "save later example"
                    cache.put(event.request.url, res.clone())
                    return res;
                  })
                  .catch(function(err) {
                    console.log('ada error ?')
                  })
              })
              .catch(function(err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function(cache) {
                    return cache.match('/offline.html')
                  })
              })
          }
        })
    )
  }
  
})