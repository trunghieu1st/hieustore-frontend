var accessToken = localStorage.getItem('accessToken');
import { apiPaths } from "./url.js";
if (!accessToken) {
  console.error('Access token not found');
}

document.addEventListener('DOMContentLoaded', async function () {

  document.getElementById("btSave2").addEventListener("click", async function () {
    const name = document.getElementById("name").value;
    const avatar = document.getElementById("avatarFileInput").files[0]; // Lấy file đầu tiên
    const description = document.getElementById("description").value;

    const formData = new FormData();
    formData.append('name', name);
    if (avatar) {
      formData.append('avatar', avatar);
    }
    formData.append('description', description);

    try {
      $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
      });
      const response = await fetch(apiPaths.createCategory, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        body: formData // Gửi formData; không cần thiết định rõ Content-Type vì FormData tự động làm việc đó
      });

      if (response.ok) {
        $.LoadingOverlay("hide");
        swal({
          title: "",
          text: "Thêm danh mục thành công!",
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
          title: "Thêm thất bại!",
          text: "Thêm danh mục thất bại.",
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