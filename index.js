const popularMovie = document.querySelector(".popularMovie");
const wrapper2CardMovie = document.querySelector('.wrapper2');


// let arrWatchList = [];
let arrWatchList = JSON.parse(localStorage.getItem("storageMovie")) || [];




const arrMovie = [];


// Получаем фильмы-----------------------------------------------------------------------------------------------------------------------------------
async function getInformationPopularMovies(){
  
  for(let page = 1; page<=2; page++){

    const random = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=b86c6fc632e95e0d8eb007e4292804c0&language=en-US&page=${page}`);
         const randomMovie = await random.json();
         const arrResults = randomMovie.results;
        
          arrResults.forEach((item)=> arrMovie.push(item))
       
         
         
        

  }
  
  const genre = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=b86c6fc632e95e0d8eb007e4292804c0&language=en-US")
  const genres = await genre.json();
   
  // console.log(arrMovie )
  arrMovie.forEach((objectMovies)=>{
const arrGenresMovie = [];
console.log(genres.genres)
genres.genres.forEach((genre)=>{
  objectMovies.genre_ids.forEach((id)=>{
    if(genre.id == id){
      arrGenresMovie.push(genre.name)
     
    }
  })
  
})


    renderMovie(objectMovies,arrGenresMovie)
  }

    );
 
     
       
        
}
// Рендер карточки с фильмом---------------------------------------------------------------------------------------------------------
async function renderOneCardMovie(oneCardMovie){


  const idMovie = oneCardMovie.id;
 const titleMovie = oneCardMovie.querySelector('.nameMovie').textContent;
 const imgCardMovie = oneCardMovie.querySelector('img').src;
 const genreCardMovie = oneCardMovie.querySelector(".genreMovie").textContent;
 const overviewMovie = oneCardMovie.getAttribute('text');
 const recomendations = await fetch(`https://api.themoviedb.org/3/movie/${idMovie}/recommendations?api_key=b86c6fc632e95e0d8eb007e4292804c0&language=en-US&page=1`)
 const recomendation = await recomendations.json();
 const recomendationsMovie = recomendation.results.map((item)=>item.title).join(", ")

  const divMovie = `<div class="infoFilm" id="${idMovie}">
  <header class="infoFilm_header">
      <h2 class = "infoFilm_nameMovie">${titleMovie}</h2>
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
      <button class="infoFilm_button">Add to watch list</button>
  </content>
  </div>
  
</div>
`;

wrapper2CardMovie.innerHTML = divMovie;
wrapper2CardMovie.classList.add('open');

}
// Получение информации о фильме----------------------------------------------------------------------------------------------------
function informAboutMovie(event){
  
  const cardMovie = event.currentTarget.closest(".movie");
  
  
  renderOneCardMovie(cardMovie);
  event.preventDefault()

  

}
// Добавляем информацию в Local storage-------------------------------------------------------------------------
function addInfoToLocalStorage(allWatchList){
 
  localStorage.setItem("storageMovie", JSON.stringify(allWatchList));
 
}



// Удаление фильма из Watch List---------------------------------------------------------------------------------
function deleteToWatchList(event){
  event.preventDefault()
  
  const watchMovie =  event.currentTarget.closest(".movie");
  const watchMovieId = watchMovie.id;
  arrWatchList = arrWatchList.filter((item)=>item.id !== watchMovieId);
  
  
  
  addInfoToLocalStorage(arrWatchList)
  

const changeDeleteButton = event.currentTarget;
changeDeleteButton.removeEventListener('click', deleteToWatchList);
changeDeleteButton.classList.remove('deleteFromList');
changeDeleteButton.classList.add('addToList');
changeDeleteButton.textContent = 'Add to watch list';
changeDeleteButton.addEventListener('click', addToWatchList);

}
// Добавление фильма в Watch List---------------------------------------------
function addToWatchList(event){
  const watchMovie =  event.currentTarget.closest(".movie");
  const watchMovieId = watchMovie.id;
  const watchMovieTitle = watchMovie.querySelector('.nameMovie').textContent;
  const wishMovie = {
    id:watchMovieId,
    title:watchMovieTitle
  };

  arrWatchList.push(wishMovie);

 
  addInfoToLocalStorage(arrWatchList);

 

  const changeAddButton = event.currentTarget;
  changeAddButton.removeEventListener('click', addToWatchList);
  changeAddButton.classList.remove('addToList');
  changeAddButton.classList.add('deleteFromList');
  changeAddButton.textContent = 'Delete from watchlist';
  changeAddButton.addEventListener('click', deleteToWatchList);



  



}

// Рендер списка популярных фильмов-------------------------------------------
function renderMovie(objectMovie, genresMovie ){
  
 
  let buttonPopularMovie = '<button class = "addToList">Add to watch list</button>';
 
  
  
  
  arrWatchList.forEach((item)=>{
if(item.id == objectMovie.id){
  buttonPopularMovie = '<button class = "deleteFromList">Delete from watch list</button>'
}
return buttonPopularMovie;
  });
   
    
      
      
  

  popularMovie.insertAdjacentHTML(
    "afterbegin",
    `<div class="popularMovie">
    <div class="movie" id="${objectMovie.id}" text = "${objectMovie.overview}">
        <div class="imgMovie">
             <img src="https://image.tmdb.org/t/p/w200/${objectMovie.poster_path}" alt="">
        </div>
        <div class="infoMovie">
        
        <a class = "hName" href="" ><h2 class ="nameMovie">${objectMovie.title}</h2></a>
           
            <div class="genreMovie">
                <p><span>Genre: </span>${genresMovie.join(', ')}</p>
            </div>
            <div class="buttonAdd">
            ${buttonPopularMovie}
            </div>
        </div>
    </div>
</div>`



  )
  
  const buttonNameMovie = document.querySelectorAll(".nameMovie");
   buttonNameMovie.forEach((button)=>{
    button.addEventListener('click', informAboutMovie)
   
})
const buttonAddToList = document.querySelectorAll(".addToList");
   buttonAddToList.forEach((button)=>{
    button.addEventListener('click', addToWatchList)
   })
   
   const buttonDeleteFromList = document.querySelectorAll(".deleteFromList");
   
   if(buttonDeleteFromList){
    buttonDeleteFromList.forEach((button)=>{
      button.addEventListener('click', deleteToWatchList )
     })
   }
   
  
}



getInformationPopularMovies();
// buttonNameMovie.addEventListener('click', )




