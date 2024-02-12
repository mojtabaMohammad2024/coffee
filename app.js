const productsContainer = document.querySelector(".products-container");
const specialMenuLinks = document.querySelector(".special-menu-links");
const loading = document.querySelector(".loading");
const URL = "./api/products.json";
let uniqueLabels = [];

const fetchProducts = async () => {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        setupUniqueLabals(data);
        displayProducts(data);
        displayTopGradeProducts(getTopGradeProducts(data));
    } catch (error) {
        console.log(error);
    }
}

function setupUniqueLabals(products){

    products.map(product => {

        const {labal} = product;
        uniqueLabels.push(labal);
    })

    uniqueLabels.unshift("all");
    uniqueLabels = [...new Set(uniqueLabels)];

    specialMenuLinks.innerHTML = uniqueLabels.map(labal => {
        return  `<li class="${labal == "all" ? "active" : ""}">
                    <a href="#">${labal}</a>
                </li>`;
    }).join("");
}

function displayProducts (products){

    loading.classList.add("hide");

    productsContainer.innerHTML = products.map(product => {

        const {image, title, price} = product;
        const {new : newPrice, old : oldPrice} = price;

        return  `<article>
                    <div class="product-image">
                        <img src="${image}" alt="${title}"/>
                    </div>
                    <h2 class="title-desc-primary">${title}</h2>
                    <h4 class="product-price">
                        price - <span class="new-product-price">$${newPrice}</span>
                        <span>/</span>
                        <span class="old-product-price">$${oldPrice}</span>
                    </h4>
                    <nav>
                        <ul class="product-links">
                            <li>
                                <a href="#">
                                    <i class="fa-solid fa-basket-shopping"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa-regular fa-heart"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa-solid fa-eye"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </article>`;

    }).join("");

    const links = [...specialMenuLinks.querySelectorAll("a")];
    
    links.forEach(link => {
        link.addEventListener("click", (e)=>{
            productsContainer.innerHTML = "";
            loading.classList.remove("hide");
            e.preventDefault();
            // console.log(link.textContent);
            removeActiveClass();
            link.parentElement.classList.add("active");
            filterProducts(link.textContent);
        });
    })
}

function removeActiveClass(){
    const listItems = [...document.querySelectorAll(".special-menu-links li")];
    listItems.forEach(listItem => listItem.classList.remove("active"));
}

async function filterProducts(labal){
    const response = await fetch(URL);
    const products = await response.json();
    let newProducts;
    if(labal == "all"){
        newProducts = [...products];
    }else{
        newProducts = products.filter(product => {
            return product.labal == labal;
        })
    }
    // console.log(newProducts);
    displayProducts(newProducts);
}

//------------

const topGradeContainer = document.querySelector(".top-grade-container");

function getTopGradeProducts(products){

    const topGradeProducts = products.filter(product => {
        return product.topGrade == true;
    })
    return topGradeProducts;
}


function displayTopGradeProducts(topGradeProducts){

    topGradeContainer.innerHTML = topGradeProducts.map((topGradeProduct, index) => {
        const {image, title, description} = topGradeProduct;
        return  `<article>
                    <div>
                        <img src="${image}" alt="${title}"/>
                        <span class="grade-number">
                            ${index + 1} 
                        </span>
                    </div>
                    <h2 class="title-desc-primary">${title}</h2>
                    <p>${description}</p>
                </article>`;
    }).join("");
}

window.addEventListener("DOMContentLoaded", fetchProducts);
