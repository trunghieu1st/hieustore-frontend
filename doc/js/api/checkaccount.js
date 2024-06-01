import { apiPaths } from "./url.js"
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    document.getElementById('myaccount').href = './user_login.html';
    document.getElementById('number-card').style.display = 'none';
    document.getElementById('number-card').style.display = 'none';
}
else {
    document.getElementById('myaccount').href = './user_information.html';
    // Giải mã token JWT và lấy thông tin payload (dữ liệu) trong token
    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    // Lấy giá trị "exp" trong payload để kiểm tra thời gian hết hạn
    const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
    const currentTime = Date.now();
    if (currentTime >= expirationTime) {
        logout();
    }
}
function logout() {
    localStorage.clear();
    //var link = $('#btnlogout').attr('href');
    window.location.href = './user_login.html';
}