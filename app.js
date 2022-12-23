const shinyChance = 0.05;

var pokeSprite = "";
var pokeName = "";
var pokeDex = "";
var pokeNum = 0;
var shiny = false;


// ----------------------
// pokemon shit
// ----------------------


fetch("https://pokeapi.co/api/v2/pokemon-species/")
    .then((res) => res.json())
    .then((json) => random_pokemon(json))
    
    
function random_pokemon(json) {
    
    
    const max = json.count;
    const min = 0;
    
    //get random pokemon from list
    pokeNum = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(pokeNum);
    
    //get pokemon entry from api
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokeNum)
        .then((res) => res.json())
        .then((json => get_pokemon(json)))
}

function get_pokemon(json) {
    console.log(json);
    
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
    
    console.log(pokeNum);
    console.log(pokeName);
    console.log(pokeSprite);
    console.log(pokeDex);
    
    pokeEleImg.src = pokeSprite;
    pokeEleImg.style.background = "";
    pokeEleName.innerHTML = pokeName;
    pokeEleDex.innerHTML = pokeDex;
    pokeEleNum.innerHTML = pokeNum;
    shiny ? pokeEleStar.style.display = "block" : pokeEleStar.style.display = "none";
}


// ----------------------
// other shit
// ----------------------

window.onload = function() {
    const welcome = document.getElementById("welcome");
    var date =  new Date();
    var hours = date.getHours();
    var timeOfDay = hours <= 6 ? "night" : hours < 12 ? "morning" : hours <= 16 ? "afternoon" : hours <= 22 ? "evening" : "night";  
    welcome.innerHTML = "good " + timeOfDay;
}
