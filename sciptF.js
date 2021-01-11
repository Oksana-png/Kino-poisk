const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');



function apiSearch(event) {
  event.preventDefault();

  const searchText = document.querySelector('.form-control').value,
  server = 'https://api.themoviedb.org/3/search/multi?api_key=f4f708c54a65ab99a17444c0b7d92c17&language=ru&query=' + searchText;
  movie.innerHTML = 'Загрузка...';
  requestApi(server)
    .then(function(result){
      const output = JSON.parse(result);
      let inner = '';

      output.results.forEach(function (item){
        let nameItem = item.name || item.title;
        let dataItem = item.release_date || item.first_air_date;
        
        inner += `<div class="col-12 col-md-4 col-xl-3 border border-info ml-2 mb-2">${nameItem}<div>Дата релиза: ${dataItem}</div></div>`;
   });

   movie.innerHTML = inner;
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что-то пошло не так!';
      console.log('error: ', reason.status);
    });
}
searchForm.addEventListener('submit', apiSearch) // submit - это enter

// ПРОМИС - обещание, асинхронная 
// можно брать в любой код
function requestApi(url){           // resolve - при успешном выполнении, reject - если ошибка
  return new Promise (function (resolve, reject){
    const request = new XMLHttpRequest();
    request.open('GET', url); // 3 парамент по умолчанию - true (асинхронная)
    request.addEventListener('load', () => {
      if(request.status !== 200){
        reject({status: request.status})
        return;
      }
      resolve(request.response);
    });
    request.addEventListener('error', () => {
      reject({status: request.status})
    });
    request.send();
  });
}