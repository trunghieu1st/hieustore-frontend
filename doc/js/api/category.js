import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    console.error('Access token not found');
    document.getElementById('number-card').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async function () {
    const url = apiPaths.getAllCategories;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });


    if (response.ok) {
        const data = await response.json();
        const categories = data.data;
        const categoriesLi = document.getElementById('category-menu');

        categories.forEach(product => {
            var categoryHTML = `
                <li><a class="custom-input2" id = "${product.id}" onclick="category_show('${product.id}')">${product.name}</a></li>
             `;
            categoriesLi.insertAdjacentHTML('beforeend', categoryHTML);
        });

    }

});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function category_show(id) {
    var url2 = apiPaths.getAllProduct + '?categoryId=' + id;
    const response2 = await fetch(url2, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response2.ok) {
        const data = await response2.json();
        const products = data.data.items;
        const productCarousel = document.getElementById('shop-page');
        productCarousel.innerHTML = ''; // Clear existing content

        products.forEach(product => {
            var productHTML = `
                <div class="col-md-3 col-sm-6">
                    <div class="single-shop-product">
                        <div class="product-upper">
                            <img src="${product.avatar}" alt="">
                        </div>
                        <br/>
                        <div style="margin-left: 20px;">
                            <h4><a href="./user_singleproduct.html" class="product-info" id="${product.id}">${product.name}</a></h4>
                            <div class="product-carousel-price">
                                <ins>Số lượng còn: ${product.quantity}</ins> </br>
                                <ins>Màu sắc: ${product.color}</ins> </br>                             
                                <ins>RAM: ${product.ram}</ins> <ins>Bộ nhớ: ${product.storageCapacity}</ins> </br>
                                <ins>Giá: ${formatNumber(product.price)} VNĐ</ins>
                            </div>  
                            
                            <div class="product-option-shop" style="margin-left: 20px;">
                                <a id="${product.id}" class="add_to_cart_button" data-quantity="1" onclick="addToCart('${product.id}')"
                                data-product_sku="" data-product_id="70">Thêm vào giỏ hàng</a>
                            </div>   
                        </div>                                                
                    </div>
                </div>
            `;
            productCarousel.insertAdjacentHTML('beforeend', productHTML);
        });
    } else {
        console.error('Failed to fetch products');
    }
}