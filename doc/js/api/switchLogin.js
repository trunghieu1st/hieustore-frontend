import { apiPaths } from "./url.js";
document.addEventListener('DOMContentLoaded', async function () {
    var accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        document.getElementById("li-logout").style.display = 'none';
    }
    else {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        // Lấy giá trị "exp" trong payload để kiểm tra thời gian hết hạn
        const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
            document.getElementById("li-logout").style.display = 'none';
        }
        else{
            document.getElementById("li-login").style.display = 'none';
            fetchUserData(accessToken);
        }
  
    }
});

async function fetchUserData(accessToken) {

    document.getElementById("li-login").style.display = 'none';
    try {
        const response = await fetch(apiPaths.myInfo, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('li-username').innerHTML += `<i>${data.data.username}</i>`;
            document.getElementById('li-logout').addEventListener('click', function () {
                localStorage.removeItem('accessToken');
                window.location.reload();
            });
        } else {
            // Xử lý trường hợp response không ok (ví dụ: hiển thị thông báo lỗi)
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }

}
