import { apiPaths } from "./url.js";
document.addEventListener('DOMContentLoaded', async function () {

    async function login(username, password) {
        const url = apiPaths.login;
        const data = {
            account: username,
            password: password
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error; // Đẩy lỗi để bắt ở phía trên
        }
    }

    document.getElementById('submit').addEventListener("click", function () {
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
                const isAdmin = response.data.authorities.some(auth => auth.authority === 'ROLE_ADMIN');
                {
                    if (isAdmin) {
                        localStorage.setItem('accessToken', response.data.accessToken);
                        localStorage.setItem('username', username);
                        window.location = "user.html";
                    }
                    else {
                        localStorage.setItem('accessToken', response.data.accessToken);
                        localStorage.setItem('username', username);
                        window.location = "user_index.html";
                    }
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
                text: "Sai tài khoản/mật khẩu hoặc lỗi kết nối đến máy chủ ",
                icon: "error",
                close: true,
                button: "Thử lại",
            });
        });
        return false; // Để ngăn chặn hành động submit mặc định của form
    })


});

