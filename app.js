const shinyChance = 0.05;

var pokeSprite = "";
var pokeName = "";
var pokeDex = "";
var pokeNum = 0;
var shiny = false;

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
    
    set_pokemon();
}

function set_pokemon() {
    const pokeEleImg = document.getElementById("pokemon-sprite");
    const pokeEleName = document.getElementById("pokemon-name");
    const pokeEleDex = document.getElementById("pokemon-dex");
    const pokeEleNum = document.getElementById("pokemon-num");
    
    console.log(pokeNum);
    console.log(pokeName);
    console.log(pokeSprite);
    console.log(pokeDex);
    
    pokeEleImg.src = pokeSprite;
    pokeEleName.innerHTML = pokeName;
    pokeEleDex.innerHTML = pokeDex;
    pokeEleNum.innerHTML = pokeNum;
    
}
