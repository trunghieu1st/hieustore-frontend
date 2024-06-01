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
    const response = await fetch(apiPaths.getAllPaymentMethods, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        const payments = data.data.items;

        let table = document.getElementById('paymentMethodsTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng
        let i = 0;
        payments.forEach(payment => {
            rowsHtml += `
                <tr>
                    <td>${++i}</td>
                    <td hidden>${payment.id}</td>
                    <td>${payment.name}</td>
                    <td>${payment.description == null ? '' : payment.description}</td>
                    <td>${payment.code == null ? '' : payment.code}</td>         
                    <td>${payment.status ? 'Bật' : 'Tắt'}</td> 
                    <td>${payment.avatar == null ? '' : `<img src="${payment.avatar}" width="100">`}</td>       
                    <td>
                        <button class="btn btn-primary btn-sm trash" type="button" title="Xóa" id="${payment.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="${payment.id}" data-toggle="modal"
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
            const paymentId = this.id;
            const response3 = await fetch(apiPaths.editPaymentMethods + paymentId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            const data3 = await response3.json();
            const productsSingle = data3.data;

            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('input[type="text"][name="paymentId"]').value = productsSingle.id;
            document.querySelector('input[type="text"][name="name"]').value = productsSingle.name;
            document.querySelector('input[type="text"][name="code"]').value = productsSingle.code;
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

async function deleteProduct(paymentId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deletePaymentMethods + `${paymentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    });
    if (response.ok) {
        $.LoadingOverlay("hide");
        swal({
            title: "",
            text: "Xóa phương thức thanh toán thành công",
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
            text: "Xóa phương thức thanh toán thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
  
}
