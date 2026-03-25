document.addEventListener("DOMContentLoaded", ()=>{

    // url of my dataset
    const datasetURL = "products.json"; //"https://makerslab.em-lyon.com/dww/data/products.json";
    
    // a function to fetch the dataset
    const loadData = async (doStuffs) => {
        try {
            const response = await fetch(datasetURL);
            if(!response.ok){
                throw new Error('Network response not ok :' + response.statusText);
            }
            const data = await response.json();
            doStuffs(data);

        } catch (error) {
            console.error("Problem occured while getting your data" + error)
        }
    }

    // target where to display the cards
    const cardsContainer = document.querySelector("#cards-container");
    const recommandationContainer = document.querySelector("#cards-recommandations-container");


    // when the dataset is loaded, it become available as an object, in the data variable.
    loadData((data)=>{

        // store length of elements
        let products_length = 0;

        // loop through the brands
        data.brands.forEach((brand, brandIndex) => {
            // then loop through the model
            data.items[brand].forEach((model, modelIndex) => {
                // console.log(model);

                // generate all the cards
                generateACard(cardsContainer, brand, model, modelIndex);

                // generate the recommandation cards
                if(brand === "converse"){
                    generateACard(recommandationContainer, brand, model, modelIndex);
                }

            });

            // update products length for each brands 
            products_length += data.items[brand].length;
        });

        // update the "how many shoes are displayed info"
        updateResultsLengthDisplay(products_length);

        // display the icons
        lucide.createIcons();
    });

    // functions
    const generateACard = (whereToPutTheCard, brand, model, modelIndex) => {
        let sizes = "";

        model.availability.forEach((size, indexofSize) => {
            console.log(indexofSize, size)
            if(size.quantity > 0){
                sizes += `
                    <li class="size-available flex align-center center">${size.size}</li>
                `;
            }else{
                sizes += `
                    <li class="size-unavailable flex align-center center">${size.size}</li>
                `;
            }
            
        });

        // push the card for the current model
        whereToPutTheCard.innerHTML += `
            <!-- the card preview -->
            <button id="${brand}${modelIndex}" class="card flex column" popovertarget="card-popover-${brand}${modelIndex}" popovertargetaction="show">
                <img src="${model.image}" alt="image of ${model.name}">
                <div class="favorite-container full-width flex row justify-end">
                    <i data-lucide="heart" class="icon-large"></i>
                </div>
                <h3>${capitalizeFirstLetter(model.name)}</h3>
                <h5>${model.brand.toLowerCase()}</h5>
                <h5>${model.gender.toLowerCase()}</h5>
                <h3 class="accent bolder align-right">${model.price}€</h3>               
            </button> 

            <!-- the card popup -->
            <div id="card-popover-${brand}${modelIndex}" popover>
                <div id="cols-wrapper-${brand}${modelIndex}" class="flex row">
                    <div class="col left-col">
                        <h3>${capitalizeFirstLetter(model.name)}</h3>
                        <h5>${model.brand.toLowerCase()}</h5>
                        <h5>${model.gender.toLowerCase()}</h5>
                        <img src="${model.image}" alt="image of ${model.name}">
                        <div class="full-width flex row justify-end">
                            <i data-lucide="heart" class="icon-large"></i>
                        </div>
                    </div>
                    <div class="col right-col">                                
                        <div class="full-width flex row justify-end">
                            <button popovertarget="card-popover-${brand}${modelIndex}" popovertargetaction="hide" class="hide-button-style">
                                <i data-lucide="x" class="icon-large"></i>
                            </button>                                    
                        </div>
                        <h3>Description</h3>
                        <p>${model.description}</p>
                        <h3>Select size</h3>
                        <ul class="shoes-sizes flex row wrap gap-medium">${sizes}</ul>
                        <h3 class="accent bolder align-right">${model.price}€</h3> 
                        <button class="primary">Add to cart</button>
                    </div>    
                </div>                
            </div>
        `;
    }


    const capitalizeFirstLetter = (str) => {
        let w = str.trim().toLowerCase();      
        return w.charAt(0).toUpperCase() + w.slice(1);
    }

    const updateResultsLengthDisplay = (length) => {
        const target = document.querySelector("#results-lenght");
        target.innerHTML = length;
    }
    
    
});