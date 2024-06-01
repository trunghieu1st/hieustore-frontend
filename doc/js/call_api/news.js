const { DateTime } = luxon;
import { apiPaths } from "./url.js";
var accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    console.error('Access token not found');
}

document.addEventListener('DOMContentLoaded', async function () {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.getAllNews, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        const news = data.data.items;

        let table = document.getElementById('newsTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng
        let i = 0;
        news.forEach(n => {
            rowsHtml += `
                <tr>
                    <td id="${n.categoryId}">${++i}</td>
                    <td hidden>${n.id}</td>
                    <td style="text-align: justify;">${n.title}</td>                               
                    <td style="text-align: justify;">${n.summary}</td>   
                    <td style="text-align: justify;">${n.content}</td>      
                    <td>${n.status ? 'Bật' : 'Tắt'}</td>          
                    <td>${n.categoryName}</td>    
                    <td>${n.avatar ? `<img src="${n.avatar}" width="100">` : ''}</td>    
                    <td>
                        <button class="btn btn-primary btn-sm trash" type="button" title="Xóa" id="${n.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="show-emp" data-toggle="modal" data-target="#ModalUP">
                            <i class="fas fa-edit"></i>
                        </button>                                       
                    </td>
                </tr>
            `;
        });

        table.innerHTML = rowsHtml; // Thêm tất cả hàng vào bảng

        $('#sampleTable').DataTable();

        $.LoadingOverlay("hide");
    } else {
        console.error('Failed to fetch products');
    }


    const editButtons = document.querySelectorAll('.edit'); // Chọn tất cả các nút "Sửa"

    // Thêm sự kiện click cho từng nút "Sửa"
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async function () {
            // Lấy ra dữ liệu của dòng tương ứng
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').innerText.trim(); // ID               
            const title = row.querySelector('td:nth-child(3)').innerText.trim();
            const summary = row.querySelector('td:nth-child(4)').innerText.trim();
            const content = row.querySelector('td:nth-child(5)').innerText.trim(); // Họ và tên                
            const status = row.querySelector('td:nth-child(6)').innerText.trim();
            const categoryName = row.querySelector('td:nth-child(7)').innerText.trim();
            const imgSrc = row.querySelector('td:nth-child(8) img').getAttribute('src');
            const categoryId = row.querySelector('td:nth-child(1)');

            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('#ModalUP input[type="text"][name="newId"]').value = id;
            document.querySelector('#ModalUP textarea[name="content"]').value = content;
            document.querySelector('#ModalUP img[name="avatar"]').src = imgSrc;
            document.querySelector('#ModalUP textarea[name="title"]').value = title;
            document.querySelector('#ModalUP textarea[name="summary"]').value = summary;
            document.querySelector('#ModalUP select[name="status"]').value = (status == 'true') ? '1' : '0';
            const inputElement = document.querySelector('.categoryName');
            if (inputElement) {
                // Gán giá trị cho input
                inputElement.value = categoryName;                
                // Đặt thuộc tính id cho input
                inputElement.id = categoryId.id;
              }

        });
    });
    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function () {
            const newsId = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            swal({
                title: "Bạn có chắc không?",
                text: "Một khi bạn xóa, bạn sẽ không thể khôi phục lại thông tin này!",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteNews(newsId);
                    }
                });
        });
    });
});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


function toDate(dateString) {
    // Tách ngày, tháng và năm từ chuỗi đầu vào
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Giảm đi 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[2], 10);

    // Tạo đối tượng Date từ các phần tử đã tách
    const date = new Date(year, month, day);
    return date;
}

async function deleteNews(newsId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deleteNews + `${newsId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    });
    if (response.ok) {
        $.LoadingOverlay("hide");
        swal({
            title: "",
            text: "Xóa thành công",
            icon: "success",
            button: false, // Ẩn nút
            timer: 2000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        }).then(() => {
         
            // Callback này sẽ được gọi sau khi SweetAlert tự đóng
            window.location.reload();
        });
    } else {
        swal({
            title: "Thất bại!",
            text: "Xóa tin tức thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 2000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: true, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}
