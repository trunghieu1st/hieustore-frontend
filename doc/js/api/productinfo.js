import { apiPaths } from "./url.js"

// Lấy thông tin cá nhân từ API khi trang được tải
document.addEventListener('DOMContentLoaded', async function () {
    var productId = localStorage.getItem('productId');
    if (!productId) {
        swal({
            title: "Bạn chưa chọn sản phẩm!",
            text: "Hãy nhấn vào tên sản phẩm để xem chi tiết!",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
            dangerMode: true,
        }).then((result) => {
            if (result) {
                window.location.href = './user_shop.html';
            }
            else {
                window.location.href = './user_index.html';
            }
        });
    }

    const carts = document.getElementById('addToCart');
    carts.addEventListener('click', function () {
        addToCart(localStorage.getItem('productId'));
    });
    // Sử dụng productId trong URL của yêu cầu fetch
    const response = await fetch(apiPaths.getProductOptionById + `${productId}`, {
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
        const count = document.getElementById('maxCount');
        const productData = await response.json();
        // Xử lý dữ liệu sản phẩm được trả về
        const product = productData.data;

        const response2 = await fetch(apiPaths.getProdcutById + `${product.productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (response2.ok) {
            const producyInfo = await response2.json();
            const data = producyInfo.data;
            count.setAttribute('max', product.quantity)
            // Tiếp tục xử lý dữ liệu như bạn muốn
            const year = product.createdDate;
            const productNames = document.querySelectorAll('#product-name');
            productNames.forEach(element => {
                element.innerHTML = '<strong>' + product.productName + '</strong>';
            });
            const productImages = document.querySelectorAll('#product-image');
            productImages.forEach(element => {
                element.src = product.image;
            });
            const productPrices = document.querySelectorAll('#product-price');
            productPrices.forEach(element => {
                element.innerHTML = '<strong>' + 'Giá: ' + '<strike>' + formatNumber(product.price + product.price * 10 / 100) + '</strike> ' +
                    formatNumber(product.price) + ' VNĐ' + '</strong>';
            });
            document.getElementById('product-description').innerHTML =
                `<div>                  
                    <p><strong>Ram:</strong> ${product.ram} GB</p> 
                    <p><strong>Bộ nhớ trong:</strong> ${product.storageCapacity} GB</p> 
                    <p><strong>Màu sắc:</strong> ${product.color}</p> 
                    <p><strong>Số lượng còn lại:</strong> ${product.quantity}</p> 
                    <div><p><strong>Camera trước:</strong> ${data.frontCamera}</p>
                    <div><p><strong>Camera sau:</strong> ${data.rearCamera}</p>                     
                    <div><p><strong>Hệ điều hành:</strong> ${data.operationSystem}</p>
                    <div><p><strong>Chip:</strong> ${data.cpu}</p>                                                     
                </div>
                <div><button id = "${product.id}" class="add_to_cart_button productDetails">Xem chi tiết</button></div>
                `;

            document.querySelectorAll('.productDetails').forEach(button => {
                button.addEventListener('click', function () {
                    const modalBody = document.getElementById('modal-body');
                    modalBody.innerHTML =
                            `<table class="table table-striped">
                                <tbody>
                                    <tr><th colspan="2" style="text-align: center;">Thông số chung</th></tr>
                                    <tr><th>Tên sản phẩm</th><td>${product.productName}</td></tr>
                                    <tr><th>Ram</th><td>${product.ram} GB</td></tr>
                                    <tr><th>Bộ nhớ trong</th><td>${product.storageCapacity} GB</td></tr>
                                    <tr><th>Màu sắc</th><td>${product.color}</td></tr>
                                    <tr><th>Số lượng còn lại</th><td>${product.quantity}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Màn hình</th></tr>
                                    <tr><th>Công nghệ màn hình</th><td>${data.screenTechnology}</td></tr>
                                    <tr><th>Độ phân giải</th><td>${data.screenResolution}</td></tr>
                                    <tr><th>Đồ dày</th><td>${data.widescreen}</td></tr>
                                    <tr><th>Tần số quét</th><td>${data.scanFrequency}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Camera</th></tr>
                                    <tr><th>Camera sau</th><td>${data.rearCamera}</td></tr>
                                    <tr><th>Camera trước</th><td>${data.frontCamera}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Hệ điều hành, CHIP, CPU</th></tr>
                                    <tr><th>Hệ điều hành</th><td>${data.operationSystem}</td></tr>
                                    <tr><th>CPU</th><td>${data.cpu}</td></tr>
                                    <tr><th>Tốc độ CPU</th><td>${data.cpuSpeed}</td></tr>
                                    <tr><th>Chip đồ họa</th><td>${data.graphicChip}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Mạng, kết nối</th></tr>
                                    <tr><th>Mạng</th><td>${data.mobileNetwork}</td></tr>
                                    <tr><th>Sim</th><td>${data.sim}</td></tr>
                                    <tr><th>Wifi</th><td>${data.wifi}</td></tr>
                                    <tr><th>GPS</th><td>${data.gps}</td></tr>
                                    <tr><th>Bluetooth</th><td>${data.bluetooth}</td></tr>
                                    <tr><th>Tai nghe</th><td>${data.headphoneJack}</td></tr>
                                    <tr><th>Cổng sạc</th><td>${data.chargingPort}</td></tr>
                                    <tr><th>Cổng kết nối</th><td>${data.connectionPort}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Pin</th></tr>
                                    <tr><th>Dung lượng pin</th><td>${data.batteryCapacity}</td></tr>
                                    <tr><th>Loại pin</th><td>${data.batteryType}</td></tr>
                                    <tr><th>Hỗ trợ sạc</th><td>${data.chargingSupport}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Chất liệu, kích thước, cân nặng</th></tr>
                                    <tr><th>Chất liệu</th><td>${data.material}</td></tr>
                                    <tr><th>Cân nặng</th><td>${data.weight}</td></tr>
                                    <tr><th>Chiều rộng</th><td>${data.size}</td></tr>
                                    <tr><th colspan="2" style="text-align: center;">Thông số khác</th></tr>
                                    <tr><th>Ngày ra mắt</th><td>${data.launchDate}</td></tr>
                                    <tr><th>Nhà cung cấp</th><td>${data.supplier}</td></tr>
                                    <tr><th>Mô tả thêm</th><td>${data.description}</td></tr>
                                </tbody>
                            </table>`;
                    $('#productModal').modal('show');
                });
            });
            const response3 = await fetch(apiPaths.getAllProductOptionByProductId + `${product.productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            if (response3.ok) {
                const similarProducts = await response3.json();
                const data3 = similarProducts.data;
                const similarProduct = document.getElementById('similarProduct');
                if (data3.length > 0) {
                    data3.forEach(product => {
                        if (product != productId) {
                            var innerHtml = `
                            <div>                  
                                <div class="thubmnail-recent">
                                    <img src="${product.image}" class="recent-thumb" alt="">
                                    <h4><a class ="productInfor" href="#" id="${product.id}">${product.productName} ${product.color} (${product.ram}G RAM,${product.storageCapacity}G bộ nhớ)  </a></h4>
                                    <div class="product-sidebar-price">     
                                        <ins id="product-price"><strike>${formatNumber(product.price + product.price * 10 / 100)}</strike> ${formatNumber(product.price)} VNĐ</ins>
                                                           
                                    </div>
                                </div>     
                            </div>`
                            similarProduct.insertAdjacentHTML('afterend', innerHtml);
                        }
                    });
                }
            }
        }
        else {
            console.error('Failed to fetch product information');
        }

    } else {
        console.error('Failed to fetch product information');
    }
    const productInfors = document.querySelectorAll('.productInfor');
    productInfors.forEach(pr => {
        pr.addEventListener('click', function () {
            localStorage.setItem('productId', this.id);
            location.reload();
        })
    })



});

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

async function addToCart(productOptionId) {
    const quantity = document.querySelector('.input-text.qty.text').value;
    const maxCount = document.getElementById('maxCount');
    try {
        const response = await fetch(apiPaths.createCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                productOptionId: productOptionId,
                quantity: quantity
            })
        });
        if (response.ok && maxCount.value >= 1 && maxCount.max >= quantity) {
            console.log('Product added to cart successfully');
            toastr.success("Thêm sản phẩm vào giỏ thành công!");
        } else {
            toastr.error("Số lượng nhập vượt qua hàng tồn kho!");
            maxCount.value = 1;
            console.error('Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}