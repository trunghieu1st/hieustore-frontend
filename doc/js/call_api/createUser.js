import { apiPaths } from "./url.js";
// Lấy thông tin cá nhân từ API khi trang được tải
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
  console.error('Access token not found');
}

document.getElementById("saveUserButton").addEventListener("click", async function () {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;

    const userData = {
        fullName,
        email,
        username,
        password,
        phone
    };

    try {
        $.LoadingOverlay("show", {
            background: "rgba(255, 255, 255, 0.6)",
            imageAnimation: "3000ms rotate_right",
            image: "../images/loading.jpg",
            imageColor: "black",
            maxSize: 100,
        });
        const response = await fetch(apiPaths.createUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            $.LoadingOverlay("hide");
            swal({
                title: "",
                text: "Tạo người dùng thành công!",
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
            const errorData = await response.json();
            swal({
                title: "Thất bại!",
                text: "Tạo người dùng thất bại:" + errorData.message,
                icon: "error",
                button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
                timer: 3000, // Thời gian hiển thị là 3 giây
                closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
                closeOnEsc: false // Không cho phép đóng khi nhấn Esc
            });
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert('Lỗi khi gọi API, xem console để biết chi tiết.');
    } finally{
        $.LoadingOverlay("hide");
    }
});