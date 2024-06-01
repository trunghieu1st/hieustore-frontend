import { apiPaths } from "./url.js";
document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('submit').addEventListener('click', function () {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password-field").value;
        // Đầu tiên kiểm tra xem các trường có trống không
        if (!username || !password) {
            swal({
                title: "",
                text: "Vui lòng nhập đủ thông tin đăng nhập!",
                icon: "error",
                close: true,
                button: "Thử lại",
            });
            return false;
        }

        login(username, password).then(response => {
            if (response.status === "SUCCESS" && response.data && response.data.accessToken) {
                // Kiểm tra quyền admin
                const isAdmin = response.data.authorities.some(auth => auth.authority === 'ROLE_ADMIN');
                if (!isAdmin) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('username', username);
                    window.location = "./user_index.html";
                }
                else{
                    localStorage.setItem('accessToken', response.data.accessToken);
                    window.location = "./user.html";
                }
                // Lưu accessToken và chuyển hướng người dùng
                
            } else {
                swal({
                    title: "",
                    text: "Sai thông tin đăng nhập hãy kiểm tra lại...",
                    icon: "error",
                    close: true,
                    button: "Thử lại",
                });
            }
        }).catch(error => {
            console.error('Error:', error);
            swal({
                title: "",
                text: "Sai thông tin đăng nhập hãy kiểm tra lại...",
                icon: "error",
                close: true,
                button: "Thử lại",
            });
        });

        return false; // Để ngăn chặn hành động submit mặc định của form
    })

});
async function login(username, password) {
    const url = apiPaths.login;
    const data = {
        account: username,
        password: password
    };

    try {
        $.LoadingOverlay("show", {
            background: "rgba(255, 255, 255, 0.6)",
            imageAnimation: "3000ms rotate_right",
            image: "./img/loading.jpg",
            imageColor: "black",
            maxSize: 100,
        });
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            $.LoadingOverlay("hide");
            throw new Error('Lỗi kết nối đến mày chủ');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; // Đẩy lỗi để bắt ở phía trên
    } finally{
        $.LoadingOverlay("hide");
    }
}