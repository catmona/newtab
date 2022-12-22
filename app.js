


fetch("./pokesprite/data/pokemon.json")
    .then((res) => res.json())
    .then((json) => update_pokemon(json));
    
function update_pokemon(json) {
    const pokeImg = document.getElementById("pokemon-sprite");
    
    var pokemon = find_pokemon(json);
    var sprite = find_sprite(pokemon);
    
    pokeImg.src = sprite;
}
    
function find_pokemon(json) {
    console.log(json);
    
    const min = 1; //dex starts at "001"
    
    //get max number of pokemon
    var max = Object.keys(json).length;
    console.log("max: " + max);
    
    //get a random id number for a pokemon
    var dexNum = Math.floor(Math.random() * (max - min + 1) + min);
    dexNum = dexNum.toString();
    console.log("dexNum: " + dexNum);
    
    //convert to a valid key
    var dexStr = ("000" + dexNum).substring(dexNum.length);
    console.log("dexStr: " + dexStr); 
    
    var pokeEntry = json[dexStr];
    console.log(pokeEntry);
    
    return pokeEntry;
}

function find_sprite(pokemon) {
    var sprite = "";
    const name = pokemon.slug.eng;
    
    var prev = pokemon["gen-8"].forms["$"].is_prev_gen_icon;
    console.log("uses gen7 sprite: " + prev);
    
    if(prev) { //uses gen 7 sprite
        sprite = "./pokesprite/pokemon-gen7x/regular/" + name + ".png";
    }
    
    //doesnt use gen 7 sprite
    sprite = "./pokesprite/pokemon-gen8/regular/" + name + ".png";
    
    console.log("sprite path:" + sprite);
    return(sprite);
}



