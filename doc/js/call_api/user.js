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
    const url = apiPaths.getAllUser;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (response.ok) {
        const data = await response.json();
        const users = data.data.items;
        let table = document.getElementById('userTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng
        let i = 0;
        users.forEach(user => {
            rowsHtml += `
                <tr>
                    <td><inputid = ${user.id}>${++i}</td>
                    <td hidden>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.fullName == null ? '' : user.fullName}</td>
                    <td>${user.gender == null ? '' : (user.gender == 'true' ? 'Nam' : 'Nữ')}</td>
                    <td>${user.birthday == null ? '' : DateTime.fromISO(user.birthday).toFormat('dd/MM/yyyy')}</td>
                    <td>${user.phone == null ? '' : user.phone}</td>
                    <td>${user.email == null ? '' : user.email}</td>
                    <td>${user.avatar == null ? '' : `<img src="${user.avatar}" width="100">`}</td>
                    <td>${user.roleName == "ROLE_ADMIN" ? 'ADMIN' : (user.roleName == "ROLE_USER" ? 'USER' : 'SUPPORT')}</td>
                    <td>
                        <button class="btn btn-primary btn-sm trash" type="button" title="Xóa"
                                            id ="${user.id}"><i class="fas fa-trash-alt"></i> 
                        </button>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="show-emp" data-toggle="modal"
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
    const editButtons = document.querySelectorAll('.edit'); // Chọn tất cả các nút "Sửa"
    // Thêm sự kiện click cho từng nút "Sửa"
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', function () {
            // Lấy ra dữ liệu của dòng tương ứng
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').innerText.trim(); // ID
            const username = row.querySelector('td:nth-child(3)').innerText.trim(); // Username
            const fullName = row.querySelector('td:nth-child(4)').innerText.trim(); // Họ và tên
            const gender = row.querySelector('td:nth-child(5)').innerText.trim(); // Giới tính
            const birthday = row.querySelector('td:nth-child(6)').innerText.trim(); // Ngày sinh
            const phone = row.querySelector('td:nth-child(7)').innerText.trim(); // Số điện thoại
            const email = row.querySelector('td:nth-child(8)').innerText.trim(); // Email
            const roleName = row.querySelector('td:nth-child(10)').innerText.trim(); // Role
            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('#ModalUP input[type="text"][name="id"]').value = id;
            document.querySelector('#ModalUP input[type="text"][name="username"]').value = username;
            document.querySelector('#ModalUP input[type="text"][name="fullName"]').value = fullName;
            document.querySelector('#ModalUP select[name="gender"]').value = gender == '' ? '' : (gender == 'Nam' ? 1 : 0);
            document.querySelector('#ModalUP input[type="date"][name="birthday"]').value = DateTime.fromFormat(birthday, 'dd/MM/yyyy').toFormat('yyyy-MM-dd');;
            document.querySelector('#ModalUP input[type="text"][name="phone"]').value = phone;
            document.querySelector('#ModalUP input[type="email"][name="email"]').value = email;
            document.querySelector('#ModalUP select[name="roleName"]').value = roleName == "ADMIN" ? 1 : (roleName == 'USER' ? 2 : 3);
        });
    });

    document.getElementById('btSave').addEventListener('click', async function () {
        // Hiển thị cảnh báo sử dụng SweetAlert
        swal({
            title: "Xác nhận",
            text: "Bạn có muốn lưu thông tin người dùng không?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Lưu"],
            dangerMode: false,
        })
            .then(async (willSave) => {
                // Nếu người dùng nhấn nút "Lưu"
                if (willSave) {
                    // Lấy dữ liệu từ các trường nhập trong modal popup
                    const id = document.querySelector('#id').value;
                    const username = document.querySelector('#username').value;
                    const fullName = document.querySelector('#fullName').value;
                    const gender = document.querySelector('#exampleSelect1').value;
                    const birthday = document.querySelector('#birthday').value;
                    const phone = document.querySelector('#phone').value;
                    const email = document.querySelector('#email').value;
                    const roleName = document.querySelector('#roleName').value;
                    // Tạo đối tượng user từ dữ liệu thu thập được
                    const user = {
                        id: id,
                        username: username,
                        fullName: fullName,
                        gender: gender,
                        birthday: birthday,
                        phone: phone,
                        email: email,
                        roleName: roleName
                    };
                    try {
                        $.LoadingOverlay("show", {
                            background: "rgba(255, 255, 255, 0.6)",
                            imageAnimation: "3000ms rotate_right",
                            image: "../images/loading.jpg",
                            imageColor: "black",
                            maxSize: 100,
                        });
                        // Gọi API để cập nhật thông tin người dùng
                        const response = await fetch(apiPaths.editUser, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken // accessToken là biến chứa token xác thực
                            },
                            body: JSON.stringify(user)
                        });
                        if (response.ok) {
                            // Nếu cập nhật thành công, làm điều gì đó, ví dụ: thông báo hoặc làm mới danh sách người dùng
                            alert('Cập nhật thông tin người dùng thành công');
                            // Đoạn code để làm mới danh sách người dùng hoặc thực hiện các thao tác khác sau khi cập nhật thành công
                        } else {
                            // Nếu gặp lỗi khi gọi API
                            swal("Không thể thay đổi thông tin người dùng", {
                                icon: "info",
                                buttons: false,
                                timer: 1500,
                            });
                        }
                    } catch (error) {
                        // Nếu xảy ra lỗi trong quá trình gọi API
                        console.error('Error:', error);
                        alert('Có lỗi xảy ra, vui lòng thử lại sau');
                    } finally {
                        $.LoadingOverlay("hide");
                    }
                } else {
                    // Người dùng nhấn nút "Hủy" => không làm gì cả
                    swal("Bạn đã hủy thao tác", {
                        icon: "info",
                        buttons: false,
                        timer: 1500,
                    });
                }
            });
    });
    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function () {
            const userID = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            swal({
                title: "Bạn có chắc không?",
                text: "Một khi bạn xóa, bạn sẽ không thể khôi phục người dùng này!",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteUser(userID);
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

async function deleteUser(userID) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deleteUser + `${userID}`, {
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
            timer: 2000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        }).then(() => {

            // Callback này sẽ được gọi sau khi SweetAlert tự đóng
            window.location.reload();
        });
    } else {
        $.LoadingOverlay("hide");
        swal({
            title: "Thất bại!",
            text: "Xóa người dùng thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 2000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}

