const { DateTime } = luxon;
import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    console.error('Access token not found');
}
document.addEventListener('DOMContentLoaded', async function (e) {
    e.preventDefault();
    const id = document.querySelector('#slideId');
    const description = document.querySelector('#description');
    const position = document.querySelector('#position');
    const status = document.querySelector('#status');    
    const avatar = document.getElementById('avatar');
    const productId = document.querySelector('#productId');
    const avatarFileInput = document.getElementById('avatarFileInput');
    avatarFileInput.addEventListener('change', function () {
        const file = avatarFileInput.files[0]; // Lấy file đầu tiên từ danh sách các files đã chọn
        const filePath = URL.createObjectURL(file); // Tạo đường dẫn tạm thời cho tệp
        avatar.src = filePath;
        console.log(filePath);
    });
    document.getElementById('btSave').addEventListener('click', async function () {
        const inputTdescription = description.value;
        const inputPosition = position.value;
        const inputStatus = status.value;
        const inputDescription = description.value;
        const inputProductId = productId.id;
        const file = avatarFileInput.files[0];
        const formData = new FormData();
        formData.append('position', inputPosition);
        formData.append('status', inputStatus);
        formData.append('description', inputDescription);
        formData.append('productId', inputProductId);
        formData.append('position', inputTdescription);
        if (file) {
            formData.append('avatar', file);
        }
        updateSlide(formData);
    });

});
async function updateSlide(formData) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.editSlide + `${document.querySelector('#slideId').value}`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        body: formData
    });
    if (response.ok) {
        $.LoadingOverlay("hide");
        swal({
            title: "",
            text: "Cập nhật thành công",
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
        swal({
            title: "Thất bại!Kiểm tra lại dữ liệu nhập",
            text: "Cập nhật thất bại, vui lòng thử lại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}

