const { DateTime } = luxon;
import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    console.error('Access token not found');
}

document.addEventListener('DOMContentLoaded', async function () {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "2000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.getAllProduct, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        const products = data.data.items;

        let table = document.getElementById('productTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng
        let i = 0;
        products.forEach(product => {
            rowsHtml += `
                <tr>
                    <td><id = ${product.id}>${++i}</td>
                    <td hidden>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.screenTechnology == null ? '' : product.screenTechnology}</td>
                    <td>${product.screenResolution == null ? '' : product.screenResolution}</td>         
                    <td>${product.widescreen == null ? '' : product.widescreen}</td>         
                    <td>${product.productOptionSimpleDtos.length == null ? '' : product.productOptionSimpleDtos.length}</td>  
                    <td>${product.avatar == null ? '' : `<img src="${product.avatar}" width="100">`}</td>       
                    <td>
                        <button class="btn btn-primary btn-sm trash" type="button" title="Xóa" id="${product.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="${product.id}" data-toggle="modal"
                            data-target="#ModalUP"><i class="fas fa-edit"></i>
                        </button>                                       
                    </td>
                </tr>
            `;
        });

        table.innerHTML += rowsHtml; // Thêm tất cả hàng vào bảng
        $('#sampleTable').DataTable();
    } else {
        console.error('Failed to fetch products');
    }
    $.LoadingOverlay("hide");
    const editButtons = document.querySelectorAll('.edit');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async function () {
            const response2 = await fetch(apiPaths.getAllCategory, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            let option = document.getElementById('categoryId');
            if (response2.ok) {
                const dt = await response2.json();
                const its = dt.data;
                its.forEach(it => {
                    option.innerHTML += `<option value = "${it.id}">${it.name}</option>`;
                })
            }
            const producId = this.id;
            const response3 = await fetch(apiPaths.getProductbyId + producId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            const data3 = await response3.json();
            const productsSingle = data3.data;

            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('input[type="text"][name="producId"]').value = productsSingle.id;
            document.querySelector('input[type="text"][name="screenTechnology"]').value = productsSingle.screenTechnology;
            document.querySelector('input[type="text"][name="screenResolution"]').value = productsSingle.screenResolution;
            document.querySelector('input[type="text"][name="name"]').value = productsSingle.name;
            document.querySelector('input[type="text"][name="widescreen"]').value = productsSingle.widescreen;
            document.querySelector('input[type="text"][name="scanFrequency"]').value = productsSingle.scanFrequency;
            document.querySelector('input[type="text"][name="rearCamera"]').value = productsSingle.rearCamera;
            document.querySelector('input[type="text"][name="frontCamera"]').value = productsSingle.frontCamera;
            document.querySelector('input[type="text"][name="operationSystem"]').value = productsSingle.operationSystem;
            document.querySelector('input[type="text"][name="cpu"]').value = productsSingle.cpu;
            document.querySelector('input[type="text"][name="cpuSpeed"]').value = productsSingle.cpuSpeed;
            document.querySelector('input[type="text"][name="graphicChip"]').value = productsSingle.graphicChip;
            document.querySelector('input[type="text"][name="mobileNetwork"]').value = productsSingle.mobileNetwork;
            document.querySelector('input[type="text"][name="sim"]').value = productsSingle.sim;
            document.querySelector('input[type="text"][name="wifi"]').value = productsSingle.wifi;
            document.querySelector('input[type="text"][name="gps"]').value = productsSingle.gps;
            document.querySelector('input[type="text"][name="bluetooth"]').value = productsSingle.bluetooth;
            document.querySelector('input[type="text"][name="headphoneJack"]').value = productsSingle.headphoneJack;
            document.querySelector('input[type="text"][name="chargingPort"]').value = productsSingle.chargingPort;
            document.querySelector('input[type="text"][name="batteryCapacity"]').value = productsSingle.batteryCapacity;
            document.querySelector('input[type="text"][name="batteryType"]').value = productsSingle.batteryType;
            document.querySelector('input[type="text"][name="chargingSupport"]').value = productsSingle.chargingSupport;
            document.querySelector('input[type="text"][name="material"]').value = productsSingle.material;
            document.querySelector('input[type="text"][name="weight"]').value = productsSingle.weight;
            document.querySelector('input[type="text"][name="size"]').value = productsSingle.size;
            document.querySelector('input[type="text"][name="launchDate"]').value = productsSingle.launchDate;
            document.querySelector('input[type="text"][name="supplier"]').value = productsSingle.supplier;
            document.getElementById('description').value = productsSingle.description;
            document.querySelector('img[name="avatar"]').src = productsSingle.avatar;
        });
    });

    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            swal({
                title: "Bạn có chắc không?",
                text: "Một khi bạn xóa, bạn sẽ không thể khôi phục lại thông tin này!",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteProduct(productId);
                    }
                });
        });
    });
});

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

async function deleteProduct(productId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deleteProductbyId + `${productId}`, {
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
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        }).then(() => {
        
            // Callback này sẽ được gọi sau khi SweetAlert tự đóng
            window.location.reload();
        });
    } else {
        swal({
            title: "Thất bại!",
            text: "Xóa sản phẩm thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}
