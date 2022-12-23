const shinyChance = 0.05;

var pokeSprite = "";
var pokeName = "";
var pokeDex = "";
var pokeNum = 0;
var shiny = false;
var caught = false;
var max = 0;


// ----------------------
// pokemon shit
// ----------------------


fetch("https://pokeapi.co/api/v2/pokemon-species/")
    .then((res) => res.json())
    .then((json) => random_pokemon(json))
    
    
function random_pokemon(json) {
    
    
    max = json.count;
    const min = 0;
    
    //get random pokemon from list
    pokeNum = Math.floor(Math.random() * (max - min + 1) + min);
    
    //get pokemon entry from api
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokeNum)
        .then((res) => res.json())
        .then((json => get_pokemon(json)))
}

function get_pokemon(json) {
    // console.log(json);
    
    //get name
    pokeName = json.name;
    
    //get sprite & shiny check
    pokeSprite = json.sprites.front_default;
    
    if(Math.random() < shinyChance) {
        pokeSprite = json.sprites.front_shiny;
        shiny = true;
    }
    
    fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokeNum)
    .then((res) => res.json())
    .then((json => get_pokedex(json)))
}

function get_pokedex(json) {
    //get flavor text
    var entry = json.flavor_text_entries;
    
    //go backwards through games and languages until finding an english entry
    for (var i = entry.length-1; i >= 0; i--) {
        if (entry[i].language.name == "en") {
            pokeDex = entry[i].flavor_text;
            break;
        }
    }
    //TODO maybe skip legends arceus pokedex entrys maybe ??? maybe ????
    set_pokemon();
}

function set_pokemon() {
    const pokeEleImg = document.getElementById("pokemon-sprite");
    const pokeEleName = document.getElementById("pokemon-name");
    const pokeEleDex = document.getElementById("pokemon-dex");
    const pokeEleNum = document.getElementById("pokemon-num");
    const pokeEleStar = document.getElementById("pokemon-star");
    const pokeEleCaught = document.getElementById("pokemon-caught");
    const pokeElePercent = document.getElementById("pokemon-percent");
    
    // console.log(pokeNum);
    // console.log(pokeName);
    // console.log(pokeSprite);
    // console.log(pokeDex);
    
    pokeEleImg.src = pokeSprite;
    pokeEleImg.style.background = "";
    pokeEleName.innerHTML = pokeName;
    pokeEleDex.innerHTML = pokeDex;
    pokeEleNum.innerHTML = pokeNum;
    shiny ? pokeEleStar.style.display = "block" : pokeEleStar.style.display = "none";
    
    if(window.localStorage.getItem(pokeNum.toString()) == null) {
        //pokemon hasn't been seen before, catch it!
        window.localStorage.setItem(pokeNum.toString(), "true");
    }
    else {
        //pokemon has been seen before, show "caught" icon
        pokeEleCaught.style.display = "block";
    }
    
    pokeElePercent.innerHTML = Math.round(((window.localStorage.length / max) * 100) * 10) / 10 + "%";
    
}


// ----------------------
// other shit
// ----------------------

window.onload = function() {
    setWelcomeMessage();
    createBookmarks();
}

function setWelcomeMessage() {
    const welcome = document.getElementById("welcome");
    var date =  new Date();
    var hours = date.getHours();
    var timeOfDay = hours <= 6 ? "night" : hours < 12 ? "morning" : hours <= 16 ? "afternoon" : hours <= 22 ? "evening" : "night";  
    welcome.innerHTML = "good " + timeOfDay;
}


// ----------------------
// bookmarks
// ----------------------


function createBookmarks() {    
    const container = document.getElementById("bookmarks");
    while (container.firstChild) {
        //if there are already buttons, remove them
        container.removeChild(container.firstChild);
    }
    
    //get saved bookmarks from local storage
    var bookmarks = window.localStorage.getItem("bookmarks");
    if(bookmarks == null) bookmarks = []
    else bookmarks = JSON.parse(bookmarks);
    
    //fill buttons with bookmark info
    var usedButtons = 0;
    for(var i = 0; i < bookmarks.length; i++) {
        generateButton(bookmarks[i].url, bookmarks[i].name);
        usedButtons++;
        
        if(usedButtons >= 6) return;
    }
    
    //hide shortcut button if there's already max # of bookmarks
    // if(usedButtons >= 6) {
    //     return;
    // }
    
    //if there's less than 6 buttons, show a "add new bookmark" button
    const addButton = document.createElement("div")
    addButton.onclick = function() { showPopup() }
    addButton.id = "add-shortcut";
    addButton.className = "shortcut";
    addButton.innerHTML = "+";
    container.appendChild(addButton);
}

function generateButton(url, name) {
    const container = document.getElementById("bookmarks");
    const button = document.createElement("div");
    container.appendChild(button);
    
    //outer button stuff
    button.onclick = function() { openBookmark(url); }
    button.innerHTML = name;
    
    button.className = "shortcut";
    button.style.display = "inline";
    
    const delButton = document.createElement("button");
    delButton.innerHTML = "X";
    delButton.onclick = function(e) { e.stopPropagation(); removeBookmark(button) }
    button.appendChild(delButton);
}

function removeBookmark(bookmark) {
    //get bookmarks from local storage
    var bookmarks = window.localStorage.getItem("bookmarks");
    if(bookmarks == null) return; 
    bookmarks = JSON.parse(bookmarks);
    
    var index = Array.from(bookmark.parentElement.children).indexOf(bookmark);
    bookmarks.splice(index, 1);
    
    //add bookmarks back to local storage
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    
    //regenerate buttons
    createBookmarks();
}

function addBookmark(event) {
    //if nothing was submitted, hide the popup
    if(event.bname.value == "" || event.burl.value == "") {
        document.getElementById("popup").style.display = "none";
        return false;
    }
    
    //get bookmarks from local storage
    var bookmarks = window.localStorage.getItem("bookmarks");
    if(bookmarks == null) bookmarks = []
    
    else bookmarks = JSON.parse(bookmarks);
    
    //add bookmark to local storage
    bookmarks.push({name: event.bname.value, url: event.burl.value});
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    
    //hide popup and update bookmark buttons
    document.getElementById("popup").style.display = "none";
    createBookmarks();
    return false;
}

function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function openBookmark(url) {
    if(!url.includes("www.")) url = "www." + url;
    if(!url.includes("https://")) url = "https://" + url;
    window.open(url, "_self");
}