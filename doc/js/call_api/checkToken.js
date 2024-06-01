checkToken();
function checkToken() {
    var accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = './index.html';
    }
    else {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        // Lấy giá trị "exp" trong payload để kiểm tra thời gian hết hạn
        const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
            logout();
        }
    }
}
function logout() {
    swal({
        title: "Hết phiên đăng nhập",
        text: "Trở về trang đăng nhập?",
        icon: "warning",
        buttons: "Đồng ý",
        dangerMode: true,
    }).then(() => {
        localStorage.clear();
        window.location.href = './index.html';
    });
}