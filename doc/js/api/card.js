import { apiPaths } from "./url.js"
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    console.error('Access token not found');
    document.getElementById('number-card').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', async function () {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "2000ms rotate_right",
        image: "./img/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const url = apiPaths.getAllCart;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    if (response.ok) {
        const data = await response.json();
        const products = data.data.items;
        const productCarousel = document.getElementById('product-cart');

        products.forEach(product => {
            var productHTML = `
                <tr class="cart_item">
                    <td class="product-remove">
                    <input type="button" value="x" title="Remove this item" class="remove_product" id="${product.id}">
                    </td>
                    <td class="product-thumbnail">
                        <a href="user_singleproduct.html"><img width="145" height="145"
                                alt="poster_1_up" class="shop_thumbnail"
                                src="${product.productOptionDto.image}"></a>
                    </td>
                    <td class="product-name">
                        <a href="user_singleproduct.html">${product.productOptionDto.productName}</a>
                    </td>
                    <td class="product-price">
                        <span class="amount">${formatNumber(product.productOptionDto.price)} VNĐ</span>
                    </td>
                    <td class="product-quantity">
                        <div class="quantity buttons_added">
                         
                            <input type="number" size="4" class="input-text qty text"
                                title="Qty" value="${product.quantity}" min="0" step="1">                           
                        </div>
                    </td>
                    <td class="product-subtotal">
                        <span class="amount">${formatNumber(product.quantity * product.productOptionDto.price)} VNĐ<span>
                    </td>
                </tr>`;
            productCarousel.insertAdjacentHTML('afterbegin', productHTML);
        });
    } else {
        console.error('Failed to fetch products');
    }

    const cartItems = document.querySelectorAll('.remove_product');
    cartItems.forEach(cart => {
        cart.addEventListener('click', async function () {
            let cartId = this.id;
            confirmRemove(cartId);
        });
    })
    //Recent Product
    var productId = localStorage.getItem('productId');
    const response2 = await fetch(apiPaths.getProductOptionById + `${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response2.ok) {

        const recentProduct = await response2.json();
        document.getElementById('product-name').textContent = recentProduct.data.productName + ' ' + recentProduct.data.color;
        document.getElementById('product-avatar').src = recentProduct.data.image;
        document.getElementById('product-ram').textContent = 'RAM: ' +recentProduct.data.ram + 'G';
        document.getElementById('product-storage').textContent = 'Bộ nhớ: '+recentProduct.data.storageCapacity + 'G';
        document.getElementById('product-price').textContent = formatNumber(recentProduct.data.price + recentProduct.data.price * 10 / 100);
        document.getElementById('product-newPrice').textContent = formatNumber(recentProduct.data.price) + ' VNĐ';
    }

    $.LoadingOverlay("hide");
});

async function removeProductAndReloadPage(id) {
    try {
        const response = await fetch(apiPaths.deleteCardById + `${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
        });
        if (response.ok) {
            location.reload();
        } else {
            console.error('Failed to remove product from cart');
        }
    } catch (error) {
        console.error('Error removing product from cart:', error);
    }
}
function confirmRemove(id) {
    if (confirm("Bạn chắc chắn muốn xóa chứ?")) {
        removeProductAndReloadPage(id);
    }
}