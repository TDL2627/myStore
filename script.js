
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
    nikeList.addEventListener('click', purchaseNike);

    // delete from cart
    cartList.addEventListener('click', deleteNike);
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
                        <img class="nike-pic" src = "${nike.pic}" alt = "nike image">
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
        alert(`There are currently no items`);

    })
}


// purchase nike
function purchaseNike(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let nike = e.target.parentElement.parentElement;
        getNikeInfo(nike);
    }
}

// get nike info after add to cart button click
function getNikeInfo(nike){
    let nikeInfo = {
        id: cartItemID,
        pic: nike.querySelector('.nike-img img').src,
        name: nike.querySelector('.nike-name').textContent,
        category: nike.querySelector('.nike-category').textContent,
        price: nike.querySelector('.nike-price').textContent
    }
    cartItemID++;
    addToCartList(nikeInfo);
    saveNikeInStorage(nikeInfo);
}

// add the selected nike to the cart list
function addToCartList(nike){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${nike.id}`);
    cartItem.innerHTML = `
        <img class="nike-pic" src = "${nike.pic}" alt = "nike image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${nike.name}</h3>
            <span class = "cart-item-category">${nike.category}</span>
            <span class = "cart-item-price">${nike.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
          delete
        </button>
    `;
    cartList.appendChild(cartItem);
}

// save the nike in the local storage
function saveNikeInStorage(item){
    let nikes = getNikeFromStorage();
    nikes.push(item);
    localStorage.setItem('nikes', JSON.stringify(nikes));
    updateCartInfo();
}

// get all the nikes info if there is any in the local storage
function getNikeFromStorage(){
    return localStorage.getItem('nikes') ? JSON.parse(localStorage.getItem('nikes')) : [];
    // returns empty array if there isn't any nike info
}

// load carts nike
function loadCart(){
    let nikes = getNikeFromStorage();
    if(nikes.length < 1){
        cartItemID = 1;

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
    let nikes = getNikeFromStorage();
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
function deleteNike(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let nikes = getNikeFromStorage();
    let updatednikes = nikes.filter(nike => {
        return nike.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('nikes', JSON.stringify(updatednikes)); // updating the nike list after the deletion
    updateCartInfo();
}
// search
// Search: nike Search
// searchbar = () => {
//     var searchednike = document.getElementById('search').value.trim();
//     nike.then(allshoes => {
//       if (!searchednike) {
//         throw new Error('Nothing was entered in the search bar');
//       }
//       // Filter all the shoes in the array with value typed into the input field
//       let shoesFound = allshoes.filter(nikes => nikes.name.toLowerCase().includes(searchednike.toLowerCase()));
//       if(shoesFound.length === 0) {
//         throw new Error('No shoes were found');
//       }
//       var data = '';
//       for (i = 0; i < shoesFound.length; i++) {
    
//         data += '<h1>' + shoesFound[i].name + '</h1>';
//         data += '<h1>' + shoesFound[i].category + '</h1>';
      
//         data += '</tr>';
//       }
    
//       return nikeList.innerHTML = data;
//     }).catch(err => alert(err.message));
//   };

// //   sort by
// // Sort: Sort shoes alphabetically
// sortShoes = () => {
//     nike.then(allshoes => {
//       // Sorting alphabetically in decending order
//       allshoes.sort((a, b) => {
//         let fa = a.name.toLowerCase(),
//         fb = b.name.toLowerCase();
//         if (fa < fb) {
//           return 1;
//         }
//         if (fa > fb) {
//             return -1;
//         }
//         return 0;
//       });
//       loadJSON();
//     }).catch(err => alert(err.message));
//   }