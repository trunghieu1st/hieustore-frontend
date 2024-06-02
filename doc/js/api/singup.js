import { apiPaths } from "./url.js"
document.getElementById("btSingup").addEventListener("click", async function () {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password-field").value;
    const phone = document.getElementById("phone").value;
    const userData = {
        fullName,
        email,
        username,
        password,
        phone
    };

    try {
        const response = await fetch(apiPaths.createUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            swal({
                title: "",
                text: "Người dùng được tạo thanh công",
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
                text: "Tạo người dùng thất bại." + errorData.message,
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
    }
});