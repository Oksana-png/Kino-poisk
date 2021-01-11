const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  if(searchText.trim().length === 0) { 
    // метод trim() - берет пробелы в конце+начале и оставляет все, что останется
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
    return;
  }
  movie.innerHTML = '<div class="spiner"></div>';

  fetch('https://api.themoviedb.org/3/search/multi?api_key=f4f708c54a65ab99a17444c0b7d92c17&language=ru&query=' + searchText)
    .then(function(value){
      if(value.status !== 200){
        return Promise.reject(new Error(value));
      }
      return value.json();
    })
    .then(function(output){
      let inner = '';
      if(output.results.length === 0){
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено :(</h2>';
      }
      output.results.forEach(function (item){
        let nameItem = item.name || item.title;
        let dataItem = item.release_date || item.first_air_date || 'отсутствует'; 
        const poster = item.poster_path ? (urlPoster + item.poster_path) : 'nofoto.jpg';
        let dataInfo = '';
        if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
          <img class="img_post" src="${poster}" alt="${nameItem}" ${dataInfo}>
          <h5>${nameItem}</h5>
          <div>Дата релиза: ${dataItem}</div>
        </div>`;
      });
      movie.innerHTML = inner;

      addEventMedia();
    })
    .catch(function(reason){
      movie.innerHTML = 'Упс, что-то пошло не так!';
      console.error(reason || + reason.status);
    });
}

searchForm.addEventListener('submit', apiSearch); // submit - это enter

function addEventMedia(){
  const media = movie.querySelectorAll('img[data-id]');
      media.forEach(function(elem){
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
      });
}

function showFullInfo(){
  // dataset - метод, который ищет атрибуты data ( data-type, data-id, data-...)
  let url = '';
  if(this.dataset.type === 'movie'){
    url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=f4f708c54a65ab99a17444c0b7d92c17&language=ru`;
  } else if (this.dataset.type === 'tv'){
    url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=f4f708c54a65ab99a17444c0b7d92c17&language=ru`;
  } else {
    movie.innerHTML = '<h2 class="col-12 text-center text-info">Произошла ошибка, повторите позже</h2>';
  }
  
  fetch(url)
    .then(function(value){
      if(value.status !== 200){
        return Promise.reject(new Error(value));
      }
      return value.json();
    })
    .then(function(output){
      let genr = [];
      for (let genre of output.genres){
        genr += genre.name + ' ';      
      }
      console.log(output);
      const poster = output.poster_path ? (urlPoster + output.poster_path) : 'nofoto.jpg';

      let mediaType = output.title ? 'movie' : 'tv';
      
      movie.innerHTML = `
        <h4 class="col-12 text-center text-info">${output.title || output.name}</h4>
        <div class="col-4">
          <img src="${poster}" alt="${output.name || output.title}">
          ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
          ${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ''}
          </div> 
        <div class="col-8">
          <p>Рейтинг: ${output.vote_average}</p>     
          <p>Статус: ${output.status}</p> 
          <p>Премьера: ${output.first_air_date || output.release_date}</p> 
          <p>Жанры: ${genr}</p>

          ${(output.last_episode_to_air) ? `<p>${(output.number_of_seasons)} сезонов ${(output.last_episode_to_air.episode_number)} серий вышло</p>` : ''}

          <p> <h6>Описание:</h6> ${output.overview}</p>
          <br>
          <div class="youtube"></div>
        </div>    
      `;
     
      getVideo(mediaType, output.id);

    })
    .catch(function(reason){
      movie.innerHTML = 'Упс, что-то пошло не так!';
      console.error(reason || + reason.status);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://api.themoviedb.org/3/trending/all/day?api_key=f4f708c54a65ab99a17444c0b7d92c17&language=ru')
    .then(function(value){
      if(value.status !== 200){
        return Promise.reject(new Error(value));
      }
      return value.json();
    })
    .then(function(output){
      let inner = '<h3 class="col-12 text-center text-info">Популярное за неделю!</h3>';
      if(output.results.length === 0){
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено :(</h2>';
      }
      output.results.forEach(function (item){
        let nameItem = item.name || item.title;
        let dataItem = item.release_date || item.first_air_date || 'отсутствует'; 

        let mediaType = item.title ? 'movie' : 'tv';
        const poster = item.poster_path ? (urlPoster + item.poster_path) : 'nofoto.jpg';
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
        
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
          <img class="img_post" src="${poster}" alt="${nameItem}" ${dataInfo}>
          <h5>${nameItem}</h5>
          <div>Дата релиза: ${dataItem}</div>
        </div>`;
      });
      movie.innerHTML = inner;

      addEventMedia();
    })
    .catch(function(reason){
      movie.innerHTML = 'Упс, что-то пошло не так!';
      console.error(reason || + reason.status);
    });
});

function getVideo(type, id){
  let youtube = movie.querySelector('.youtube');
  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=f4f708c54a65ab99a17444c0b7d92c17&language=ru`)
    .then((value) => {
      if(value.status !== 200){
        return Promise.reject(new Error(value));
      }
      return value.json();
    })
    .then((output) => {
      let videoFrame = '<h5 class="col-12 text-info">Трейлеры</h5>';

      if(output.results.length === 0){
        videoFrame = '<p>К сожалению, видео отсутствует</p>';
      }

      output.results.forEach((item) => {
        videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      });

      youtube.innerHTML = videoFrame;

    })
    .catch((reason) => {
      youtube.innerHTML = 'Видео не найдено';
      console.error(reason || + reason.status);
    });



  youtube.innerHTML = type;

}