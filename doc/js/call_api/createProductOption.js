import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
  console.error('Access token not found');
}
document.addEventListener('DOMContentLoaded', async function () {
  const response2 = await fetch(apiPaths.getAllProduct, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  });
  let option = document.getElementById('productId');
  if (response2.ok) {
    const dt = await response2.json();
    const its = dt.data.items;
    its.forEach(it => {
      option.innerHTML += `<option value = "${it.id}">${it.name}</option>`;
    })
  }

  const ram = document.getElementById('ram');
  const storageCapacity = document.getElementById('storageCapacity');
  const color = document.getElementById('color');
  const price = document.getElementById('price');
  const quantity = document.getElementById('quantity');
  const status = document.getElementById('status');
  const avatar = document.getElementById('avatar');
  const avatarFileInput = document.getElementById('avatarInput');
  const productId = document.getElementById('productId');

  avatarFileInput.addEventListener('change', function () {
    const file = avatarFileInput.files[0]; // Lấy file đầu tiên từ danh sách các files đã chọn
    const filePath = URL.createObjectURL(file); // Tạo đường dẫn tạm thời cho tệp
    avatar.setAttribute('src', filePath);
    console.log(filePath);
  });

  document.getElementById('saveProductButton').addEventListener('click', async function () {
    const formData = new FormData();
    formData.append('ram', ram.value);
    formData.append('storageCapacity', storageCapacity.value);
    formData.append('color', color.value);
    formData.append('price', price.value);
    formData.append('quantity', quantity.value);
    formData.append('status', status.value);
    formData.append('productId', productId.value);
    const file = avatarFileInput.files[0];
    if (file) {
      formData.append('image', file);
    }

    try {
      $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
      });
      const response = await fetch(apiPaths.createProductOption, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
        body: formData,
      })
      if (response.ok) {
        $.LoadingOverlay("hide");
        swal({
          title: "",
          text: "Tạo sản phẩm thành công!",
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
          text: "Tạo sản phẩm thất bại:" + errorData.message,
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
    } finally {
      $.LoadingOverlay("hide");
    }
  });
});

