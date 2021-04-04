// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = [];
let now = new Date();
let number;


// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanRecentProducts = document.querySelector('#nbRecentProducts');
const selectBrand = document.querySelector('#brand-select');
const selectRecentProduct = document.querySelector('#recent-release');
const selectReasonablePrice = document.querySelector('#reasonable-price');
const selectSort = document.querySelector("#sort-select");


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
/*const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};
*/

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-theta.vercel.app/search?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};




/**
 * Render list of products
 * @param  {Array} products
 */
/*const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
      <div class="img_container">
      <a href="${product.link}" target="_blank">
          <img class="product-photo" src=${product.photo}></a>
      <div class="product-info">
        <span>-${product.brand}-</span>
        <span>${product.name}</span>
        <span>${product.released}</span>
        <span>${product.price}€</span>
        </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2> \u2661 Your eco-friendly products list \u2661 </h2>';
  sectionProducts.appendChild(fragment);
};*/

const renderProducts = products => {
  /*const fragment = document.createDocumentFragment();
  const div = document.createElement('div');*/
  const template = products
    .map(product => {
      return `
      <div class="product-card" id=${product._id}>
          <div class="product-image">
          <a href="${product.link}" target="_blank">
          <img class="product-photo" src=${product.photo}></a>
          </div>
          <div class="product-info">
            <span><b>${product.brand}</b></span>
            <a class="prodname" href="${product.link}" target="_blank">${product.name}</a>
            <p>${product.price}€</p>
          </div>
        </div>
     
    `;
    })
    .join('');

  /*div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2> \u2661 Your eco-friendly products list \u2661 </h2>';
  sectionProducts.appendChild(fragment);*/
  sectionProducts.innerHTML = template;
};














function getBrandsfromProducts (products) {
  const brands_double = products.map(product => product.brand);
  const brands = Array.from(new Set(brands_double));
  return brands;
  
}

function GetNumberOfProduct(products){
  var number = 0;
  for(let i = 0; i< products.length; i++)
  {
    number = number + 1;
  }
  return number;
}



/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render brands selector
 * @param  {Array} brands
 */
const renderBrands = brands => {
  const options = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`
  ).join('');

  selectBrand.innerHTML = options;
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;  
};

const renderNumberofProduct = products => {
  spanNbProducts.innerHTML = GetNumberOfProduct(products);
};

const renderNumberOfRecentproduct = products => {
  spanRecentProducts.innerHTML = GetNumberOfProduct(products);

};


const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderNumberofProduct(currentProducts);
  
  const brands = getBrandsfromProducts(currentProducts);
  renderBrands(brands);
  };
  


/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});




// Ici on filtre les currents products
// Par brand

selectBrand.addEventListener('change', event => {
  const filteredProducts = [];
  currentProducts.map(function(product) {
    if(product.brand === event.target.value)
    {
      filteredProducts.push(product);
    }
  }
  )
  renderProducts(filteredProducts);
});


// Par date

function dayDiff(d1, d2)
{
  d1 = d1.getTime() / 86400000;
  d2 = d2.getTime() / 86400000;
  return new Number(d2 - d1).toFixed(0);
}


selectRecentProduct.addEventListener('change', event =>{
  const recentProduct = [];
  currentProducts.map(function(product){
    var mydate = new Date(product.released);
    const diff = dayDiff(mydate,now);
    const diff_weeks = diff/7;
    if(diff_weeks <= '15')
      {
        recentProduct.push(product);
      }
    }  
  )
  renderProducts(recentProduct);
  renderNumberOfRecentproduct(recentProduct);
  });


// Par prix inferieur à 50e

selectReasonablePrice.addEventListener('change', event => {
  const reasonable_price = [];
  currentProducts.map(function(product){
    if(product.price <= 50)
     {
      reasonable_price.push(product);
     }
    }
    )
renderProducts(reasonable_price);
});




// Par prix cheapest and expensive

selectSort.addEventListener('change', event => {
  const sorting = [];
  if(event.target.value === "price-asc"){
  currentProducts.map(function(product){
      if(product.price <= 20)
      {
        sorting.push(product);
      }
    })
  }
  if(event.target.value === "price-desc"){
  currentProducts.map(function(product){
    if(product.price > 20)
    {
      sorting.push(product);
    }
  })
  }
  if(event.target.value === "date-asc"){
    currentProducts.map(function(product){
      var mydate = new Date(product.released);
      const diff = dayDiff(mydate,now);
      const diff_weeks = diff/7;
      if(diff_weeks <= '15')
        {
          sorting.push(product);
        }
      }  
    )
  }
  if(event.target.value === "date-desc"){
    currentProducts.map(function(product){
      var mydate = new Date(product.released);
      const diff = dayDiff(mydate,now);
      const diff_weeks = diff/7;
      if(diff_weeks > '15')
        {
          sorting.push(product);
        }
      }  
    )

  }
  renderProducts(sorting);
});

