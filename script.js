
const cartContainer = document.querySelector('.cart-container');
const nikeList = document.querySelector('.nike-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;

eventListeners();

// all event listeners
function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
    // toggle navbar when toggle button is clicked
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    });

    // show/hide cart container
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    // add to cart
    nikeList.addEventListener('click', purchasenike);

    // delete from cart
    cartList.addEventListener('click', deletenike);
}

// update cart info
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.nikeCount;
    cartTotalValue.textContent = cartInfo.total;
}

// load nike items content form JSON file
function loadJSON(){
    fetch('stuff.json')
    .then(response => response.json())
    .then(data =>{
        let html = '';
        data.forEach(nike => {
            html += `
                <div class = "nike-item">
                    <div class = "nike-img">
                        <img src = "${nike.pic}" alt = "nike image">
                        <button type = "button" class = "add-to-cart-btn">
                            <i class = "fas fa-shopping-cart"></i>Add To Cart
                        </button>
                    </div>

                    <div class = "nike-content">
                        <h3 class = "nike-name">${nike.name}</h3>
                        <span class = "nike-category">${nike.category}</span>
                        <p class = "nike-price">R${nike.price}</p>
                    </div>
                </div>
            `;
        });
        nikeList.innerHTML = html;
    })
    .catch(error => {
        alert(`User live server or local server`);
        //URL scheme must be "http" or "https" for CORS request. You need to be serving your index.html locally or have your site hosted on a live server somewhere for the Fetch API to work properly.
    })
}


// purchase nike
function purchasenike(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let nike = e.target.parentElement.parentElement;
        getnikeInfo(nike);
    }
}

// get nike info after add to cart button click
function getnikeInfo(nike){
    let nikeInfo = {
        id: cartItemID,
        pic: nike.querySelector('.nike-img img').src,
        name: nike.querySelector('.nike-name').textContent,
        category: nike.querySelector('.nike-category').textContent,
        price: nike.querySelector('.nike-price').textContent
    }
    cartItemID++;
    addToCartList(nikeInfo);
    savenikeInStorage(nikeInfo);
}

// add the selected nike to the cart list
function addToCartList(nike){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${nike.id}`);
    cartItem.innerHTML = `
        <img src = "${nike.pic}" alt = "nike image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${nike.name}</h3>
            <span class = "cart-item-category">${nike.category}</span>
            <span class = "cart-item-price">${nike.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

// save the nike in the local storage
function savenikeInStorage(item){
    let nikes = getnikeFromStorage();
    nikes.push(item);
    localStorage.setItem('nikes', JSON.stringify(nikes));
    updateCartInfo();
}

// get all the nikes info if there is any in the local storage
function getnikeFromStorage(){
    return localStorage.getItem('nikes') ? JSON.parse(localStorage.getItem('nikes')) : [];
    // returns empty array if there isn't any nike info
}

// load carts nike
function loadCart(){
    let nikes = getnikeFromStorage();
    if(nikes.length < 1){
        cartItemID = 1; // if there is no any nike in the local storage
    } else {
        cartItemID = nikes[nikes.length - 1].id;
        cartItemID++;
        // else get the id of the last nike and increase it by 1
    }
    nikes.forEach(nike => addToCartList(nike));

    // calculate and update UI of cart info 
    updateCartInfo();
}

// calculate total price of the cart and other info
function findCartInfo(){
    let nikes = getnikeFromStorage();
    let total = nikes.reduce((acc, nike) => {
        let price = parseFloat(nike.price.substr(1)); // removing dollar sign
        return acc += price;
    }, 0); // adding all the prices

    return{
        total: total.toFixed(2),
        nikeCount: nikes.length
    }
}

// delete nike from cart list and local storage
function deletenike(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let nikes = getnikeFromStorage();
    let updatednikes = nikes.filter(nike => {
        return nike.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('nikes', JSON.stringify(updatednikes)); // updating the nike list after the deletion
    updateCartInfo();
}