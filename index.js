const popularMovie = document.querySelector(".popularMovie");
const wrapper2CardMovie = document.querySelector(".wrapper2");
const searchMoviesButton = document.querySelector(".input");

let arrWatchList = JSON.parse(localStorage.getItem("storageMovie")) || [];

const arrMovie = [];

// Получаем фильмы-----------------------------------------------------------------------------------------------------------------------------------
async function getInformationPopularMovies() {
  for (let page = 1; page <= 2; page++) {
    const random = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=b86c6fc632e95e0d8eb007e4292804c0&language=en-US&page=${page}`
    );
    const randomMovie = await random.json();
    const arrResults = randomMovie.results;

    arrResults.forEach((item) => arrMovie.push(item));
  }

  const genre = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=b86c6fc632e95e0d8eb007e4292804c0&language=en-US"
  );
  const genres = await genre.json();

  arrMovie.map((objectMovies) => {
    const arrGenresMovie = [];

    genres.genres.forEach((genre) => {
      objectMovies.genre_ids.forEach((id) => {
        if (genre.id == id) {
          arrGenresMovie.push(genre.name);
        }
      });
    });

    objectMovies.genres = arrGenresMovie.join(" ");
  });

  renderMovie(arrMovie);
}
// Рендер карточки с фильмом---------------------------------------------------------------------------------------------------------
async function renderOneCardMovie(oneCardMovie) {
  const idMovie = oneCardMovie.id;
  const titleMovie = oneCardMovie.querySelector(".nameMovie").textContent;
  const imgCardMovie = oneCardMovie.querySelector("img").src;
  const genreCardMovie = oneCardMovie.querySelector(".genreMovie").textContent;
  const overviewMovie = oneCardMovie.getAttribute("text");
  const recomendations = await fetch(
    `https://api.themoviedb.org/3/movie/${idMovie}/recommendations?api_key=b86c6fc632e95e0d8eb007e4292804c0&language=en-US&page=1`
  );
  const recomendation = await recomendations.json();
  const recomendationsMovie = recomendation.results
    .map((item) => item.title)
    .join(", ");
  const buttonPopularMovie = {
    class: "addToList",
    text: "Add to watch list",
  };

  arrWatchList.forEach((item) => {
    if (item.id == idMovie) {
      buttonPopularMovie.class = "deleteFromList";
      buttonPopularMovie.text = "Delete from watch list";
    }
    return buttonPopularMovie;
  });

  const divMovie = `<div class="infoFilm movie" id="${idMovie}">
  <header class="infoFilm_header">
      <h2 class = "infoFilm_nameMovie nameMovie">${titleMovie}</h2>
      <a href="">(main page)</a>
      
  </header>
  <div class="general">
  <aside>
      <img src="${imgCardMovie}" alt="">
  </aside>
  <content>
      <div class="overview">
          <h2>Overview:</h2>
          <p>${overviewMovie}</p>
      </div>
      <div class="genre">
          <h2>Genres:</h2>
          <p>${genreCardMovie}</p>
      </div>
      <div class="recomendations">
          <h2>Recomendations:</h2>
          <p>${recomendationsMovie}</p>
      </div>
      <button class="infoFilm_button ${buttonPopularMovie.class}">${buttonPopularMovie.text}</button>
  </content>
  </div>
  
</div>
`;

  wrapper2CardMovie.innerHTML = divMovie;
  wrapper2CardMovie.classList.add("open");
  document.body.style.overflow = "hidden";

  const buttonCardMovie = wrapper2CardMovie.querySelector(
    `.${buttonPopularMovie.class}`
  );

  if (buttonPopularMovie.class == "deleteFromList") {
    buttonCardMovie.addEventListener("click", deleteToWatchList);
  } else {
    buttonCardMovie.addEventListener("click", addToWatchList);
  }
}
// Получение информации о фильме----------------------------------------------------------------------------------------------------
function informAboutMovie(event) {
  const cardMovie = event.currentTarget.closest(".movie");

  renderOneCardMovie(cardMovie);
  event.preventDefault();
}
// Добавляем информацию в Local storage-------------------------------------------------------------------------
function addInfoToLocalStorage(allWatchList) {
  localStorage.setItem("storageMovie", JSON.stringify(allWatchList));
}

// Удаление фильма из Watch List---------------------------------------------------------------------------------
function deleteToWatchList(event) {
  event.preventDefault();

  const watchMovie = event.currentTarget.closest(".movie");
  const watchMovieId = watchMovie.id;
  arrWatchList = arrWatchList.filter((item) => item.id !== watchMovieId);

  addInfoToLocalStorage(arrWatchList);

  const changeDeleteButton = event.currentTarget;
  changeDeleteButton.removeEventListener("click", deleteToWatchList);
  changeDeleteButton.classList.remove("deleteFromList");
  changeDeleteButton.classList.add("addToList");
  changeDeleteButton.textContent = "Add to watch list";
  changeDeleteButton.addEventListener("click", addToWatchList);
}
// Добавление фильма в Watch List---------------------------------------------
function addToWatchList(event) {
  const watchMovie = event.currentTarget.closest(".movie");

  const watchMovieId = watchMovie.id;

  const watchMovieTitle = watchMovie.querySelector(".nameMovie").textContent;
  const wishMovie = {
    id: watchMovieId,
    title: watchMovieTitle,
  };

  arrWatchList.push(wishMovie);

  addInfoToLocalStorage(arrWatchList);

  const changeAddButton = event.currentTarget;
  changeAddButton.removeEventListener("click", addToWatchList);
  changeAddButton.classList.remove("addToList");
  changeAddButton.classList.add("deleteFromList");
  changeAddButton.textContent = "Delete from watchlist";
  changeAddButton.addEventListener("click", deleteToWatchList);
}

// Рендер списка популярных фильмов-------------------------------------------
function renderMovie(generalArrMovie) {
  const divArrMovies = [];
  generalArrMovie.forEach((movie) => {
    const buttonPopularMovie = {
      class: "addToList",
      text: "Add to watch list",
    };

    arrWatchList.forEach((item) => {
      if (item.id == movie.id) {
        buttonPopularMovie.class = "deleteFromList";
        buttonPopularMovie.text = "Delete from watch list";
      }
      return buttonPopularMovie;
    });

    divArrMovies.push(
      `<div class="popularMovieOne">
      <div class="movie" id="${movie.id}" text = "${movie.overview}">
          <div class="imgMovie">
               <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="">
          </div>
          <div class="infoMovie">
          
          <a class = "hName" href="" ><h2 class ="nameMovie">${movie.title}</h2></a>
             
              <div class="genreMovie">
                  <p><span>Genre: </span>${movie.genres}</p>
              </div>
              <div class="buttonAdd">
              <button class="${buttonPopularMovie.class}"> ${buttonPopularMovie.text}</button> 
              </div>
          </div>
      </div>
  </div>`
    );
  });
  popularMovie.innerHTML = divArrMovies.join("");
  const buttonNameMovie = document.querySelectorAll(".nameMovie");
  buttonNameMovie.forEach((button) => {
    button.addEventListener("click", informAboutMovie);
  });
  const buttonAddToList = document.querySelectorAll(".addToList");
  buttonAddToList.forEach((button) => {
    button.addEventListener("click", addToWatchList);
  });

  const buttonDeleteFromList = document.querySelectorAll(".deleteFromList");

  if (buttonDeleteFromList) {
    buttonDeleteFromList.forEach((button) => {
      button.addEventListener("click", deleteToWatchList);
    });
  }
}
// Поиск фильмов-----------------------------------------------------------------------
function searchMovies(event) {
  event.preventDefault();

  const result = arrMovie.filter((item) =>
    item.title.toLowerCase().includes(event.target.value.toLowerCase())
  );

  renderMovie(result);
}

getInformationPopularMovies();
searchMoviesButton.addEventListener("input", searchMovies);
