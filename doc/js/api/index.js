import { apiPaths } from "./url.js"
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    console.error('Access token not found');
}
toastr.options = {
    progressBar: false,
    newestOnTop: true,           // Hiển thị thông báo mới nhất ở trên cùng
    preventDuplicates: false,
    onclick: null,
    positionClass: 'toast-top-center',
    toastClass: 'toastr-custom-width',
    showEasing: 'swing',         // Hiệu ứng hiển thị
    hideEasing: 'linear',        // Hiệu ứng ẩn
    showMethod: 'fadeIn',        // Phương thức hiển thị
    hideMethod: 'fadeOut',        // Phương thức ẩn      
    timeOut: '3000',             // Thời gian tự động ẩn thông báo (milliseconds)           
    extendedTimeOut: 0,
};
// Lấy thông tin sản phẩm từ API khi trang được tải
document.addEventListener('DOMContentLoaded', async function () {
    getAllSlide();
    getLastestProduct();
});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function getAllSlide() {
    // Sử dụng url của yêu cầu fetch
    const response = await fetch(apiPaths.getAllSlides, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const productList = document.getElementById('bxslider-home4');
        const data = await response.json();
        const products = data.data.items; // Giả sử dữ liệu trả về là một mảng các sản phẩm từ API

        // Tạo các phần tử HTML tương ứng cho mỗi sản phẩm và thêm vào trong danh sách
        products.forEach(product => {
            var productHTML = `
            <li>
                <img style="width:100%; height:400px;" src="${product.avatar}" alt="Slide">
                <div class="caption-group">
                    <h4 class="caption subtitle"></h4>
                    <a class="caption button-radius" href="user_shop.html"><span class="icon"></span>Shop now</a>
                </div>
            </li>
        `;
            productList.insertAdjacentHTML('beforeend', productHTML);
        });

        // Khởi tạo slider
        $(document).ready(function () {
            $('#bxslider-home4').bxSlider({
                auto: true, // Tự động chuyển slide
                //autoControls: true, // Hiển thị nút chuyển slide
            });
        });
    } else {
        console.error('Failed to fetch product information');
    }
}

async function getLastestProduct() {
    const url = apiPaths.getAllProductOption;
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
        const products = data.data;
        const productCarousel = document.getElementById('latest-product');
        const topselfProduct = document.getElementById('topself-product');
        products.forEach(product => {
            if (product.status == true && product.quantity > 1) {
                var productHTML = `
                <div class="single-product">                                    
                    <div class="product-f-image">
                        <img src="${product.image}" width =265px height=100px alt="">
                        <div class="product-hover">
                            <a id="${product.id}" class="add-to-cart-link">
                                <i class="fa fa-shopping-cart"></i>Thêm vào giỏ hàng
                            </a>
                            <a href="user_singleproduct.html" id="${product.id}" onclick="seeDetails('${product.id}')"  class="view-details-link">
                                <i class="fa fa-link"></i>Xem chi tiết
                            </a>
                        </div>
                    </div>
                    <h2>
                        <a href="user_singleproduct.html">${product.productName} </a>
                    </h2>
                    <div class="product-carousel-price">
                        <ins>RAM: ${product.ram}GB</ins> <ins>Bộ nhớ trong: ${product.storageCapacity}GB</ins> </br>
                        <ins>Màu sắc: ${product.color}</ins> </br>
                        <ins>Giá: <strike>${formatNumber(product.price + product.price * 10 / 100)}</strike>  ${formatNumber(product.price)} VNĐ</ins> 
                    </div>
                </div>
                 `;
                productCarousel.insertAdjacentHTML('beforeend', productHTML);
            }
        });
        products.forEach(product => {
            if (product.status == true && product.quantity > 23) {
                var productHTML = `
                <div class="single-product">                                    
                    <div class="product-f-image">
                        <img src="${product.image}" width =265px height=100px alt="">
                        <div class="product-hover">
                            <a id="${product.id}" class="add-to-cart-link">
                                <i class="fa fa-shopping-cart"></i>Thêm vào giỏ hàng
                            </a>
                            <a href="user_singleproduct.html" id="${product.id}" onclick="seeDetails('${product.id}')"  class="view-details-link">
                                <i class="fa fa-link"></i>Xem chi tiết
                            </a>
                        </div>
                    </div>
                    <h2>
                        <a href="user_singleproduct.html">${product.productName} </a>
                    </h2>
                    <div class="product-carousel-price">
                        <ins>RAM: ${product.ram}GB</ins> <ins>Bộ nhớ trong: ${product.storageCapacity}GB</ins> </br>
                        <ins>Màu sắc: ${product.color}</ins> </br>
                        <ins>Giá: ${formatNumber(product.price)} VNĐ</ins> 
                    </div>
                </div>
                 `;
                topselfProduct.insertAdjacentHTML('beforeend', productHTML);
            }

        });
        const carts = document.querySelectorAll('.add-to-cart-link');
        // Lặp qua từng phần tử và thêm trình lắng nghe sự kiện click
        carts.forEach(cart => {
            cart.addEventListener('click', async function () {      
                let productId = this.id;
                addToCart(productId);
            });
        });
    } else {
        console.error('Failed to fetch products');
    }
}

async function addToCart(productId) {  
    checkToken();
    const quantity = 1; // Số lượng mặc định là 1
    try {
        const response = await fetch(apiPaths.createCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                productOptionId: productId,
                quantity: quantity
            })
        });
        if (response.ok) {
            console.log('Product added to cart successfully');
            toastr.success("Thêm sản phẩm vào giỏ thành công!");
        } else {
            console.error('Failed to add product to cart');
            toastr.error("Thêm sản phẩm vào giỏ thất bại!");
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

function checkToken() {
    var accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        swal({
            title: "Bạn chưa đăng nhập",
            text: "Bạn có muốn đăng nhập không?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
            dangerMode: true,
        }).then((result) => {
            if (result) {
                localStorage.clear();
                window.location.href = './user_login.html';
            }
            else {
                window.location.href = './user_index.html';
            }
        });
        document.getElementById('myaccount').href = './user_login.html';
        document.getElementById('number-card').style.display = 'none';
        logout();
    }
    else {
        document.getElementById('myaccount').href = './user_information.html';
        // Giải mã token JWT và lấy thông tin payload (dữ liệu) trong token
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        // Lấy giá trị "exp" trong payload để kiểm tra thời gian hết hạn
        const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
            logout();
        }
    }
}
function logout() {
    swal({
        title: "Hết phiên đăng nhập",
        text: "Bạn có muốn đăng nhập lại?",
        icon: "warning",
        buttons: ["Hủy bỏ", "Đồng ý"],
        dangerMode: true,
    }).then((result) => {
        if (result) {
            localStorage.clear();
            window.location.href = './user_login.html';
        }
        else {
            window.location.href = './user_index.html';
        }
    });
}