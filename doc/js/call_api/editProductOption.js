const { DateTime } = luxon;
import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    console.error('Access token not found');
}
document.addEventListener('DOMContentLoaded', async function (e) {
    e.preventDefault();
    const ram = document.getElementById('ram');
    const storageCapacity = document.getElementById('storageCapacity');
    const color = document.getElementById('color');
    const price = document.getElementById('price');
    const quantity = document.getElementById('quantity');
    const status = document.getElementById('status'); 
    const image = document.getElementById('image');
    const avatarFileInput = document.getElementById('avatarFileInput');

    avatarFileInput.addEventListener('change', function () {
        const file = avatarFileInput.files[0]; // Lấy file đầu tiên từ danh sách các files đã chọn
        const filePath = URL.createObjectURL(file); // Tạo đường dẫn tạm thời cho tệp
        image.src = filePath;
        console.log(filePath);
    });

    document.getElementById('btSave').addEventListener('click', async function () {
        const formData = new FormData();
        formData.append('ram', ram.value);
        formData.append('storageCapacity', storageCapacity.value);
        formData.append('color', color.value);
        formData.append('price', price.value);
        formData.append('quantity', quantity.value);
        formData.append('status', status.value);
        const file = avatarFileInput.files[0];

        if (file) {
            formData.append('avatar', file);
        }

        updateProduct(formData);
    });

});
async function updateProduct(formData) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.editProductOption + `${document.querySelector('#productOptionId').value}`, {
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

