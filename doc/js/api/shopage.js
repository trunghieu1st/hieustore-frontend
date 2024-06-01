import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    console.error('Access token not found');
    document.getElementById('number-card').style.display = 'none';
}
else{
    document.getElementById('number-card').style.display = 'block';
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
document.addEventListener('DOMContentLoaded', async function () {
    getListCategory();

    loadCategory('all');

    let selectElement = document.getElementById('list-category');
    selectElement.addEventListener('change', function () {
        let categoryId = this.value;
        document.getElementById('search-input').value = '';
        loadCategory(categoryId);
    });
});

async function loadCategory(categoryId) {
    if (categoryId == 'all') {
        const response = await fetch(apiPaths.getAllProductOption, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });
        if (response.ok) {
            const data = await response.json();
            let products = data.data;

            renderProducts(products);

            document.getElementById('search-input').addEventListener('input', function () {
                const filteredProducts = filterAndSortProducts(products);
                renderProducts(filteredProducts);
            });

            document.getElementById('sort-select').addEventListener('change', function () {
                const filteredProducts = filterAndSortProducts(products);
                renderProducts(filteredProducts);
            });

            document.querySelectorAll('.btn-filter-item').forEach(button => {
                button.addEventListener('click', function () {
                    this.classList.toggle('active');
                    const filteredProducts = filterAndSortProducts(products);
                    renderProducts(filteredProducts);
                });
            });

            document.querySelector('.submit').addEventListener('click', function () {
                const filteredProducts = filterAndSortProducts(products);
                renderProducts(filteredProducts);
            });
        } else {
            console.error('Failed to fetch products');
        }
    }
    else {
        const response = await fetch(apiPaths.getAllProductOptionByCategory + `${categoryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (response.ok) {
            const data = await response.json();
            let products = data.data;

            renderProducts(products);

            document.getElementById('search-input').addEventListener('input', function () {
                const filteredProducts = filterAndSortProducts(products);
                renderProducts(filteredProducts);
            });

            document.getElementById('sort-select').addEventListener('change', function () {
                const filteredProducts = filterAndSortProducts(products);
                renderProducts(filteredProducts);
            });

            document.querySelectorAll('.btn-filter-item').forEach(button => {
                button.addEventListener('click', function () {
                    this.classList.toggle('active');
                    const filteredProducts = filterAndSortProducts(products);
                    renderProducts(filteredProducts);
                });
            });

            document.querySelector('.submit').addEventListener('click', function () {
                const filteredProducts = filterAndSortProducts(products);
                renderProducts(filteredProducts);
            });


        } else {
            console.error('Failed to fetch products');
        }
    }

    var productLinks = document.querySelectorAll('.product-info');
    productLinks.forEach(prolink => {
        prolink.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.setItem('productId', this.id);
            window.location.href = './user_singleproduct.html'; // Chuyển hướng đến trang mới

        });
    });

    const filterButtons = document.getElementById('showFitter');
    filterButtons.addEventListener('click', function () {
        const showFitter = document.getElementById('filterAll');
        const isActive = filterButtons.classList.contains('active');
        if (isActive) {
            showFitter.classList.remove('active');
        } else {
            showFitter.classList.add('active');
        }
    });

    const hideFitter = document.getElementById('hideFitter');
    hideFitter.addEventListener('click', function () {
        const showFitter = document.getElementById('filterAll');
        showFitter.classList.remove('active');

    });

    const fitterItem = document.querySelectorAll('.button__filter-child');
    fitterItem.forEach(ft => {
        ft.addEventListener('click', function () {
            const isActive = ft.classList.contains('active');
            if (isActive) {
                ft.classList.remove('active');
            } else {
                ft.classList.add('active');
            }
        });
    });
}

function renderProducts(products, page = 1, productsPerPage = 8) {
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    const productCarousel = document.getElementById('shop-page');
    productCarousel.innerHTML = ''; // Clear previous products  
    if (paginatedProducts.length > 0) {
        paginatedProducts.forEach(product => {
            if (product.status == true && product.quantity > 0) {
                var productHTML = `
                <div class="col-md-3 col-sm-6">
                    <div class="single-shop-product">
                        <div class="product-upper">
                            <img src="${product.image}" alt="">
                        </div>
                        <br/>
                        <div >
                            <h4 style="text-align: center;height: 27px;width: 200px; margin-left: 23px">
                                <a  class="product-info" id="${product.id}">${product.productName}</a>
                            </h4>
                            <div class="product-carousel-price" style = "margin-left: 60px">                         
                                <ins>Màu sắc: ${product.color}</ins> </br>                             
                                <ins>RAM: ${product.ram}</ins> 
                                <ins>Bộ nhớ: ${product.storageCapacity}</ins> </br>
                                <ins>Giá: ${formatNumber(product.price)} VNĐ</ins>  </br>  
                                <ins>Số lượng còn: ${product.quantity}</ins> 
                            </div>                          
                            <div class="product-option-shop" style="display: flex;
                                justify-content: center; align-items: center;margin-top: 10px;   ">
                                <a id="${product.id}" class="add_to_cart_button" data-quantity="1"
                                data-product_sku="" data-product_id="70">Thêm vào giỏ hàng</a>
                            </div>   
                        </div>
                    </div>
                </div>`;
                productCarousel.insertAdjacentHTML('beforeend', productHTML);
            }
        });
        document.getElementById('noProduct').style.display = 'none';
    } else {
        document.getElementById('noProduct').style.display = 'flex';
        document.getElementById('customText').textContent = "Không có sản phẩm nào được tìm thấy";
    }
    setupPagination(products, page, productsPerPage);

    var productLinks = document.querySelectorAll('.product-info');
    productLinks.forEach(prolink => {
        prolink.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.setItem('productId', this.id);
            window.location.href = './user_singleproduct.html'; // Chuyển hướng đến trang mới

        });
    });

    const carts = document.querySelectorAll('a.add_to_cart_button');
    // Lặp qua từng phần tử và thêm trình lắng nghe sự kiện click
    carts.forEach(cart => {
        cart.addEventListener('click', async function () {
            let productId = this.id;
            addToCart(productId);
        });
    });
}

function setupPagination(products, currentPage, productsPerPage) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    const totalPages = Math.ceil(products.length / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener('click', function (event) {
            event.preventDefault();
            renderProducts(products, i, productsPerPage);
        });
        paginationContainer.appendChild(pageItem);
    }
}

function filterAndSortProducts(products) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;

    // Lấy danh sách các nút bộ lọc được chọn
    const activeStorageFilters = Array.from(document.querySelectorAll('.filter-wrapper #memory .button__filter-child.active')).map(button => button.textContent.trim());
    const activeRamFilters = Array.from(document.querySelectorAll('.filter-wrapper #ram .button__filter-child.active')).map(button => button.textContent.trim());
    const activePriceFilters = Array.from(document.querySelectorAll('.filter-wrapper #price .button__filter-child.active')).map(button => button.textContent.trim());

    let filteredProducts = products.filter(product =>
        // Kiểm tra từ khóa tìm kiếm
        product.productName.toLowerCase().includes(searchTerm) &&
        // Kiểm tra bộ lọc về bộ nhớ trong
        (activeStorageFilters.length === 0 || activeStorageFilters.includes(product.storageCapacity)) &&
        // Kiểm tra bộ lọc về dung lượng RAM
        (activeRamFilters.length === 0 || activeRamFilters.includes(product.ram)) &&
        // Kiểm tra bộ lọc về giá cả
        (activePriceFilters.length === 0 || activePriceFilters.includes(product.priceRange))
    );

    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.productName.localeCompare(b.productName));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.productName.localeCompare(a.productName));
            break;
    }

    return filteredProducts;
}


///Function
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function getListCategory() {
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
        const categoriesSelect = document.getElementById('list-category');
        categories.forEach(category => {
            categoriesSelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });

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
            numberCart();

        } else {
            console.error('Failed to add product to cart');
            toastr.error("Thêm sản phẩm vào giỏ thất bại!");
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

async function numberCart() {    
    const response = await fetch(apiPaths.getAllCart, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (response.ok) {
        const data = await response.json();
        var number_card = document.getElementById('number-card');
        number_card.textContent = data.data.items.length;
    } else {
        console.error('Failed to fetch product information');
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