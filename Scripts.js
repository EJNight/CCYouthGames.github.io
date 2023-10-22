const body = document.querySelector(".body");
sidebar = body.querySelector(".sidebar"),
sidebarbtn = body.querySelector(".sidebarbtn"),
container = body.querySelector(".container");
modeSwitch = body.querySelector(".mode-switch");
searchBar = body.querySelector(".searchBar");
searchRes = body.querySelector(".search-results");
filterBox = body.querySelector(".filter-box");
filterButton = body.querySelector(".filter-button");

plusBtn1 = body.querySelector(".plus1");
minusBtn1 = body.querySelector(".minus1");
plusBtn2 = body.querySelector(".plus2");
minusBtn2 = body.querySelector(".minus2");
numberInput1 = body.querySelector(".number1 span");
numberInput2 = body.querySelector(".number2 span");
playBtn = body.querySelector(".play-btn");
toolTab1 = body.querySelector("#tool-tab1");
toolTab2 = body.querySelector("#tool-tab2");
toolTab3 = body.querySelector("#tool-tab3");
toolTab4 = body.querySelector("#tool-tab4");

let Cards = [];

const cardTemplate = elementFromHtml(`
    <template cardTemplate>
            <div class="gameBox">
                <div class="gameBoxHeader">
                    <div class="bubble">
                        <span card-bubble>New!</span>
                    </div>
                    <img class="gamePic" card-pic>
                    <h1 class="gameName" card-name></h1>
                </div>
            <div class="gameBoxBody">
                <div class="rating-box">
                    <i class='bx bxs-star'></i>
                    <span class="rating">Rating</span><br>
                    <div class="ratings-box">
                        <div class="star-box" card-stars></div>
                        <span class="ratings" card-rating>Ratings</span><br>
                    </div>
                    
                 </div>
                 <div class="detailsBox">
                    <i class='bx bxs-spreadsheet'></i>
                    <span class="details">Details</span><br>
                        <ul card-list>
                        
                        </ul>
                    </div>
                 <span class="questionMark">? </span>
                 <span class="howToPlay">How To Play</span>
                    <div class="card-desc">

                    </div>   
             
                 </div>
            </div>
        </template>
`);


function SetUp(){
    if(document.getElementById("defaultOpen") != null){
        document.getElementById("defaultOpen").click();
    }
    
    if( localStorage.getItem("darkmode") == "true" || window.matchMedia('prefers-color-scheme: dark').matches){
        body.classList.toggle("darkMode", true);
    }
    else{
        body.classList.toggle("darkMode", false);
    }
}

sidebarbtn.addEventListener("click", () =>{
    sidebar.classList.toggle("open");
});

modeSwitch.addEventListener("click", () =>{
    body.classList.toggle("darkMode");
    let mode = body.classList.contains("darkMode");
    localStorage.setItem("darkmode", mode)
});
//toggles the filter drop down on clicking the button.
if(filterButton != null){
    filterButton.addEventListener("click", () =>{
        filterBox.classList.toggle("close");
    });
}

if(playBtn != null){
playBtn.addEventListener("click", () =>{
    playBtn.classList.toggle("playing");
});
}

if(minusBtn1 != null){
    minusBtn1.addEventListener("click", () =>{
        SubtractInt(1, numberInput1, 0);
    });
}
if(plusBtn1 != null){
    plusBtn1.addEventListener("click", () =>{
        AddInt(1, numberInput1, 99);
    });
}
if(minusBtn2 != null){
    minusBtn2.addEventListener("click", () =>{
        SubtractInt(1, numberInput2, 0);
    });
}
if(plusBtn2 != null){
    plusBtn2.addEventListener("click", () =>{
        AddInt(1, numberInput2, 99);
    });
}


if(searchBar != null){
//reads the searchbar and filters the games based off of the search. 
searchBar.addEventListener("input", e =>{
    const value = e.target.value.toLowerCase();
    let results = 0;
    //runs through all the Game Cards and hides the ones that do not apply to the search.
    Cards.forEach(card =>{
        const isVisable = card.name.toLowerCase().includes(value)
        card.element.classList.toggle("hide", !isVisable)
        if(isVisable){
            results++;
        }
    })
    searchRes.textContent = "Search Results " + results;
    if(e.target.value == ""){
        searchRes.textContent = ""
    }
    
})
}


function elementFromHtml(html){
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

function GetRating(parent, rating){
    
    let index = 0;

    for(let i = 0; i < Math.floor(rating); i++){
        index++;
        const fstar = elementFromHtml(" <i class='bx bxs-star'></i>");
        parent.appendChild(fstar)
    }

    if(rating > index){
        index++;
        const hstar = elementFromHtml(" <i class='bx bxs-star-half'></i>");
        parent.appendChild(hstar)
    }
    
    for(let i = 0; i < 5 - index; i++){
        const star = elementFromHtml(" <i class='bx bx-star'></i>");
        parent.appendChild(star)
    }
    
}

function GetDesc(data, container){
    
        if (data[0].header != null || data[0].Text != null || data[0].List != null){
            data.forEach(item =>{
                if(item.Header != null){
                let header = document.createElement('span')
                header.appendChild(document.createTextNode(item.Header))
                header.classList = "card-desc-header"
                container.appendChild(header)
                }

                if (item.List != null){
                    let ul = document.createElement('ul');
                    ul.classList = "card-desc-ul";

                    item.List.forEach(li =>{
                        let litem = document.createElement('li');
                        litem.textContent = li.Text;
                        litem.classList = "card-desc-li";
                        ul.appendChild(litem);
                    })
                    container.appendChild(ul);
                }

                if (item.Text != null){
                    let p = document.createElement('p')
                    p.appendChild(document.createTextNode(item.Text))
                    p.classList = "card-desc-text"
                    container.appendChild(p)
                }

                
            })
        }
        else if (data[0] != "[object Object]"){

            let p = document.createElement('p')
                p.appendChild(document.createTextNode(data))
                p.classList = "card-desc-text"
                container.appendChild(p)
        }
        else{
            let p = document.createElement('p')
                p.appendChild(document.createTextNode("[ ! ] Improperly setup JSON [ ! ]"))
                p.classList = "card-desc-text"
                container.appendChild(p)
        }
}


//adds the Game Cards to the list.
function addGames(){

    fetch('./gameInfo.json') //fetches the JSON file that stores the info for the games.
    .then(res => res.json())
    .then(data =>{
        Cards = data.map(game => {
            return addGame(game, container);
        })
    })
}

function addGameByInt(gameInt, container){
    
    fetch('./gameInfo.json') //fetches the JSON file that stores the info for the games.
    .then(res => res.json())
    .then(data =>{
        
        addGame(data[gameInt], container)
    })
}

function addGame(index, container){


            const card = cardTemplate.content.cloneNode(true).children[0]
            //gets all the info for the game.
            const gameName = card.querySelector("[card-name]")
            const gameBubbleText = card.querySelector("[card-bubble]")
            const gameBubble = card.querySelector(".bubble")
            const gameDetails = card.querySelector("[card-list]")
            const gameStars = card.querySelector("[card-stars]")
            const gamePic = card.querySelector("[card-pic]")
            const gameRating = card.querySelector("[card-rating]")
            const gameDescBox = card.querySelector(".card-desc")

            gameName.textContent = index.Name
            if (index.Bubble == null || index.Bubble == ""){
                gameBubble.remove();
            }
            else{
                gameBubbleText.textContent = index.Bubble
            }
            gamePic.src = index.GamePic
            GetDesc(index.Description, gameDescBox)
            gameRating.textContent = index.NumRatings + " Ratings"
            GetRating(gameStars, index.Rating)
            createList(gameDetails, index.Details)
            container.append(card)

            return {name: index.Name, filters: index.Filters, element: card}
}

function createList(list, data)
{
    data.forEach(item =>{
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(item))
        li.classList = "detailsLI"
        list.appendChild(li)
    })
}

function randomGame(container, removeOld){
    if(container.firstElementChild != null){
        container.removeChild(container.firstElementChild)
    }
    

    fetch('./gameInfo.json') //fetches the JSON file that stores the info for the games.
    .then(res => res.json())
    .then(games =>{
        const count = Object.entries(games).length;
        console.log(count);
        const random = Math.floor(Math.random() * count);
        addGame(games[random], container)
    })
}

function FindCommonColor(image){
    console.log(image.getImageData())

}

function OpenTab(evt, name){
    // Declare all variables
    var i, tabcontent, tabs;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tab-content-box");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tabs" and remove the class "active"
    tabs = document.getElementsByClassName("tool-tab");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", false);
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "flex";
    evt.currentTarget.classList.toggle("active", true);
}

function ActivateFilter(evt, value){

    if (filterBox.classList.contains("close")){

    
        var i, tabs;

        tabs = document.getElementsByClassName("filter-drop-down-item");

        for (i = 0; i < tabs.length; i++) {
            tabs[i].classList.toggle("active", false);
        }

        evt.currentTarget.classList.toggle("active", true);
        let results = 0
        if(value != "All"){

            
            Cards.forEach(card =>{
                if(card.filters != null){
                    card.element.classList.toggle("hide", true);
                    card.filters.forEach(filter =>{
                        const isVisable = filter.toLowerCase() == value.toLowerCase();
                        
                        if(isVisable){
                            card.element.classList.toggle("hide", false);
                            results++;
                        }
                        
                    })
                    
                }
                else{
                    card.element.classList.toggle("hide", true);
                }
                
            })
            searchRes.textContent = "Search Results " + results;
        }
        else{
            Cards.forEach(card =>{
                card.element.classList.toggle("hide", false);
            })
            searchRes.textContent = "";
        }
    }
}

//Music Stopper Code

function PlayAudio()
{
    let min = Number(body.querySelector(".number1 span").textContent)
    let max = Number(body.querySelector(".number2 span").textContent)
    const random = Math.floor(Math.random() * (max * 1000 - min * 1000 + 1) + min * 1000);
    audio = document.getElementById("myAudio");
    
    audio.play();
    
    setTimeout( function (){

        audio.pause();
        playBtn.classList.toggle("playing", false);
    },random)
    
}

function AddInt(amount, element, maxValue){
    let num = Number(element.textContent)
    if(num < maxValue){
        num += amount
    }
    element.textContent = num
    
}
function SubtractInt(amount, element, minValue){
    let num = Number(element.textContent)
    if(num > minValue){
        num -= amount
    }
    element.textContent = num
    
}

