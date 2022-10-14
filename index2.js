let arrWatchList = JSON.parse(localStorage.getItem("storageMovie")) || [];
const listOfMovie = document.querySelector('.wrapperMovie')

function addToWatchList(event){
    event.preventDefault()
    const buttonDelete = event.currentTarget;
    buttonDelete.textContent = 'Delete from watchlist';
    buttonDelete.removeEventListener('click', addToWatchList);
    buttonDelete.addEventListener('click', deleteToWatchList);
    const wishMovie = {
        id:buttonDelete.id,
        title:buttonDelete.textContent
      };
    
      arrWatchList.push(wishMovie);
    
     
      addInfoToLocalStorage(arrWatchList);


}
// Добавляем информацию в Local storage-------------------------------------------------------------------------
function addInfoToLocalStorage(allWatchList){
 
    localStorage.setItem("storageMovie", JSON.stringify(allWatchList));
   
  }
// // Удаление фильма из Watch List---------------------------------------------------------------------------------
function deleteToWatchList(event){
    event.preventDefault()
    const buttonAdd = event.currentTarget;
    buttonAdd.textContent = 'Add to watchlist';
    buttonAdd.removeEventListener('click', deleteToWatchList);
    buttonAdd.addEventListener('click', addToWatchList);

    
    // const watchMovie =  event.currentTarget.closest(".wrapperMovie");
    // const watchMovieId = watchMovie.id;
    arrWatchList = arrWatchList.filter((item)=>item.id !== buttonAdd.id);
    console.log(arrWatchList)
    addInfoToLocalStorage(arrWatchList)
    
}
   
arrWatchList.forEach((item) => {
   
    listOfMovie.insertAdjacentHTML(
        "afterbegin",
        `<div class="nameWatchMovie">${item.title}</div>
        <div class="divButton">
            <button id = "${item.id}" class="buttonDelete">Delete from watchlist</button>
        </div>`
    )
    })
    const buttonsOfWatchList = document.querySelectorAll('.buttonDelete');
    buttonsOfWatchList.forEach((button)=>{
        button.addEventListener('click', deleteToWatchList)
    })

