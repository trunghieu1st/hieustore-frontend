const { DateTime } = luxon;
import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    console.error('Access token not found');
}

document.addEventListener('DOMContentLoaded', async function () {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response2 = await fetch(apiPaths.getAllProduct, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    let option = document.getElementById('allProductName');
    if (response2.ok) {
        const dt = await response2.json();
        const its = dt.data.items;

        its.forEach(it => {
            option.innerHTML += `<option value = "${it.id}">${it.name}</option>`;
        })
    }

    loadOption('all');
    let selectElement = document.getElementById('allProductName');
    selectElement.addEventListener('change', function () {
        let productId = this.value;
        loadOption(productId);
    });

    $.LoadingOverlay("hide");
});

async function loadOption(productId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    var link = productId == 'all' ? "allProduct" : `all/${productId}`;
    const response = await fetch(apiPaths.getProductOptionById + link, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        const products = data.data;
        let table = document.getElementById('optionTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng   
        let i = 0;
        products.forEach(product => {
            rowsHtml += `
                <tr>
                    <td><id = "${product.id}">${++i}</td>
                    <td hidden>${product.id}</td>                   
                    <td>${product.productName == null ? '' : product.productName}</td>       
                    <td>${product.color == null ? '' : product.color}</td>
                    <td>${product.ram}</td>
                    <td>${product.storageCapacity == null ? '' : product.storageCapacity}</td>         
                    <td>${product.price == null ? '' : formatNumber(product.price)}</td>          
                    <td>${product.quantity == null ? '' : product.quantity}</td>                     
                    <td>${product.status == true ? 'Bật' : 'Tắt'}</td>                  
                    <td>${product.image == null ? '' : `<img src="${product.image}" width="100">`}</td>
                    <td>
                            <button class="btn btn-primary btn-sm trash" type="button" title="Xóa"
                                id = ${product.id}><i class="fas fa-trash-alt"></i> 
                            <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="${product.id}" data-toggle="modal"
                                data-target="#ModalUP"><i class="fas fa-edit"></i>
                        </button>                                       
                    </td>
                </tr>
            `;
        });

        table.innerHTML = rowsHtml; // Thêm tất cả hàng vào bảng
        $('#sampleTable').DataTable();
        $.LoadingOverlay("hide"); 
    } else {
        console.error('Failed to fetch products');
    }

    const editButtons = document.querySelectorAll('.edit');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async function () {
            const producOptionId = this.id;
            const response3 = await fetch(apiPaths.getProductOptionById + producOptionId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            const data3 = await response3.json();
            const productsSingle = data3.data;

            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('input[type="text"][name="productOptionId"]').value = productsSingle.id;
            document.querySelector('input[type="text"][name="ram"]').value = productsSingle.ram;
            document.querySelector('input[type="text"][name="storageCapacity"]').value = productsSingle.storageCapacity;
            document.querySelector('input[type="text"][name="color"]').value = productsSingle.color;
            document.querySelector('input[type="text"][name="price"]').value = productsSingle.price;
            document.querySelector('input[type="text"][name="quantity"]').value = productsSingle.quantity;
            document.querySelector('select[name="status"]').value = (productsSingle.status = true) ? '1' : '0';
            document.querySelector('img[name="image"]').src = productsSingle.image;
        });
    });

    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function () {
            const productOptionId = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            swal({
                title: "Bạn có chắc không?",
                text: "Một khi bạn xóa, bạn sẽ không thể khôi phục lại thông tin này!",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteProductOption(productOptionId);
                    }
                });
        });
    });
};

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


function toDate(dateString) {
    // Tách ngày, tháng và năm từ chuỗi đầu vào
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Giảm đi 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[2], 10);

    // Tạo đối tượng Date từ các phần tử đã tách
    const date = new Date(year, month, day);
    return date;
}

async function deleteProductOption(productOptionId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deleteProductOptionById + `${productOptionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    });
    if (response.ok) {
        $.LoadingOverlay("hide");
        swal({
            title: "",
            text: "Xóa thành công",
            icon: "success",
            button: false, // Ẩn nút
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        }).then(() => {
          
            // Callback này sẽ được gọi sau khi SweetAlert tự đóng
            window.location.reload();
        });
    } else {
        swal({
            title: "Thất bại!",
            text: "Xóa lựa chọn sản phẩm thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}
