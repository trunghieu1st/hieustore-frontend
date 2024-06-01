checkToken();
function checkToken() {
    var accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        swal({
            title: "Bạn chưa đăng nhập",
            text: "Bạn có muốn đăng nhập không?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
            dangerMode: true,
        }).then((result) => {
            if (result) {
                localStorage.clear();
                window.location.href = './user_login.html';
            }
            else {
                localStorage.clear();
                window.location.href = './user_index.html';                
            }
        });
        document.getElementById('myaccount').href = './user_login.html';
        document.getElementById('number-card').style.display = 'none';
        document.getElementById('li-logout').style.display = 'none';
        document.getElementById('li-login').style.display = 'block';
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
}
function logout() {
    swal({
        title: "Hết phiên đăng nhập",
        text: "Bạn có muốn đăng nhập lại?",
        icon: "warning",
        buttons: ["Hủy bỏ", "Đồng ý"],
        dangerMode: true,
    }).then((result) => {
        if (result) {
            localStorage.clear();
            window.location.href = './user_login.html';
        }
        else {
            window.location.href = './user_index.html';
        }
    });
}

function login() {
    swal({
        title: "Bạn chưa đăng nhập!",
        text: "Bạn phải đăng nhập để thực hiện chức năng này?",
        icon: "warning",
        buttons: ["Hủy bỏ", "Đăng nhập"],
        dangerMode: true,
    }).then((result) => {
        if (result) {
            localStorage.clear();
            window.location.href = './user_login.html';
        }
        else {
            window.location.href = './user_index.html';
        }
    });
}