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
    const response = await fetch(apiPaths.getAllOrder, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        const orders = data.data.items;

        let table = document.getElementById('orderTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng
        let i = 0;
        orders.forEach(order => {
            var status = getStatusBadge(order.statusName);
            rowsHtml += `
                <tr>
                    <td>${++i}</td>
                    <td hidden>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>${order.phone}</td>
                    <td>${order.address}</td>
                    <td>${order.note == null ? '' : order.note}</td>
                    <td>${formatNumber(order.shippingFee)}</td>
                    <td>${formatNumber(order.originalPrice)}</td>
                    <td>${order.nulmoneyDiscountCodeIdl == null ? 'Không' : formatNumber(order.moneyDiscountCodeId)}</td>
                    <td>${formatNumber(order.totalPrice)}</td>
                    <td>${order.paymentStatus == true ? '<span class="badge bg-success">Đã thanh toán</span>' :
                    '<span class="badge bg-dark">Thanh toán trực tiếp</span>'}</td>
                    <td>${status}</td>
                    <td>${order.lastModifiedDate == null ? '' : order.lastModifiedDate}</td>
                    <td>
                        <button class="btn btn-primary btn-sm trash" type="button" title="Xóa"
                            id = ${order.id}><i class="fas fa-trash-alt"></i>  </button>  
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="${order.id}" data-toggle="modal"
                            data-target="#ModalUP"><i class="fas fa-edit"></i>    </button>  
                        <button class="btn btn-primary btn-sm detail" type="button" title="Chi tiết" id="${order.id}"> 
                            <a href="orderDetail.html"> <i class="fas fa-info-circle"> </a></i>    </button>      
                    </td>
                    <td hidden>${order.statusId}</td>
                </tr>
            `;
        });

        table.innerHTML += rowsHtml; // Thêm tất cả hàng vào bảng
        $('#sampleTable').DataTable();

    } else {
        console.error('Failed to fetch products');
    }

    $.LoadingOverlay("hide");
    
    const editButtons = document.querySelectorAll('.edit'); // Chọn tất cả các nút "Sửa"
    // Thêm sự kiện click cho từng nút "Sửa"
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', function () {

            // Lấy ra dữ liệu của dòng tương ứng
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').innerText.trim(); // ID       

            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('#ModalUP input[type="text"][name="orderId"]').value = id;
            document.querySelector('#ModalUP select[name="status"]').value = row.querySelector('td:nth-child(15)').innerText.trim(); // ID    ;
            localStorage.setItem('orderId', this.id);
        });
    });

    document.querySelectorAll('.detail').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            localStorage.setItem('orderId', orderId);
        });
    });

    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            swal({
                title: "Bạn có chắc không?",
                text: "Một khi bạn xóa, bạn sẽ không thể khôi phục lại thông tin này!",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteProductOption(orderId);
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


async function deleteProductOption(orderId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deleteOrder + `${orderId}`, {
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
            text: "Xóa đơn hàng thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}

function getStatusBadge(statusName) {
    switch (statusName) {
        case 'Cancelled':
            return '<span class="badge bg-danger">Đã hủy hàng</span>';
        case 'Pending':
            return '<span class="badge bg-info">Chờ xác nhận</span>';
        case 'Delivering':
            return '<span class="badge bg-secondary">Đang giao hàng</span>';
        case 'Waiting':
            return '<span class="badge bg-warning">Chuẩn bị hàng</span>';
        case 'Delivered':
            return '<span class="badge bg-success">Đã giao hàng</span>';
        default:
            return '<span class="badge bg-primary">Chờ xác nhận</span>';
    }
}