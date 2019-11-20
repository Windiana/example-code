$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

$("#add-btn").click(function(e) {
  e.preventDefault();
  $("#addModal").modal("show");
});

var contentWrapper = document.querySelector('#content-wrapper');

function createContent(data) {
  var contentRow = document.createElement('div');
  contentRow.className = 'row';

  // image
  var contentLeft = document.createElement('div');
  contentLeft.className = 'col-6 mb-3';

  var pict = document.createElement('img');
  pict.style = 'max-width: 100%;';
  // pict.src = '/src/images/nature.jpg'
  pict.src = data.image

  // description
  var contentRight = document.createElement('div');
  contentRight.className = 'col-6';

  var description = document.createElement('p');
  // description.textContent = 'My First Description';
  // description.style.color = "purple";
  description.textContent = data.title;
  description.style.color = data.color;

  // 5. SW + caching by user event, just nice to know
  // var saveBtn = document.createElement('button');
  // saveBtn.textContent = 'Read later'
  // saveBtn.addEventListener('click', onSaveBtnClick)
  // description.appendChild(saveBtn)

  contentLeft.appendChild(pict);
  contentRight.appendChild(description);

  contentRow.appendChild(contentLeft);
  contentRow.appendChild(contentRight);

  contentWrapper.appendChild(contentRow);
}
// createContent()

function clearContent() {
  while(contentWrapper.hasChildNodes()) {
    contentWrapper.removeChild(contentWrapper.lastChild)
  }
}

// comment because this is just nice to know
// function onSaveBtnClick() {
//   if('caches' in window) {
//     caches.open('user-clicked-v5')
//       .then(function(cache) {
//         cache.add('https://httpbin.org/get')
//         cache.add('/src/images/nature.jpg')
//       })
//   }
// }

// 1. SW + Caching 
// kita akan gunakan fetch API, request ke API manapun, untuk membuktikan kalo si content hanya akan muncul ketika ada internet connection


function updateUI(data) {
  clearContent()
  for(var i=0; i<data.length; i++) {
    createContent(data[i])
  }
}

var url = 'https://vue-pwa-tutor.firebaseio.com/tasks.json'
var isNetworkFaster = false

// fetch('https://swapi.co/api/people/1', {
//  mode: 'no-cors'
// })
fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {
    isNetworkFaster = true
    console.log('From web data...', data)

    var arrData = []
    for(key in data) {
      arrData.push(data[key])
    }
    updateUI(arrData)
  })

// strategy cache then network, commented because of indexedDB
// if('caches' in window) {
//   caches.match(url)
//     .then(function(response) {
//       if(response) {
//         return response.json()
//       }
//     })
//     .then(function(data) {
//       console.log('From cache data...', data)
//       if(!isNetworkFaster) {
//         var arrData = []
//         for(key in data) {
//           arrData.push(data[key])
//         }
//         updateUI(arrData)
//       }
//     })
// }


// indexedDB 
if('indexedDB' in window) {
  readStore('tasks')
    .then(function(data) {
      if(!isNetworkFaster) {
        console.log('From cache...', data)
        updateUI(data)
      }
    })
}



fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {
    console.log("---------------",data)
  })
