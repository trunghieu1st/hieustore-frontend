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
    const response = await fetch(apiPaths.getAllSlides, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        const slides = data.data.items;

        let table = document.getElementById('slideTable');
        let rowsHtml = ''; // Chuỗi để giữ HTML của tất cả các hàng
        let i = 0;
        slides.forEach(slide => {
            rowsHtml += `
                <tr>
                    <td><id = ${slide.id}>${++i}</td>
                    <td hidden>${slide.id}</td>            
                    <td>${slide.productName}</td>        
                    <td>${slide.position}</td>
                    <td style="text-align: justify;">${slide.description}</td>         
                    <td>${slide.status == true ? 'Bật' : 'Tắt'}</td>                            
                    <td>${slide.avatar == null ? '' : `<img src="${slide.avatar}" width="100">`}</td>
                    <td hidden>${slide.productId}</td>   
                    <td>
                        <button class="btn btn-primary btn-sm trash" type="button" title="Xóa"
                            id = ${slide.id}><i class="fas fa-trash-alt"></i> 
                        </button>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="show-emp" data-toggle="modal"
                            data-target="#ModalUP"><i class="fas fa-edit"></i>
                        </button>                                       
                    </td>
                </tr>
            `;
        });

        table.innerHTML += rowsHtml; // Thêm tất cả hàng vào bảng

        $('#sampleTable').DataTable();
        $.LoadingOverlay("hide");
    } else {
        console.error('Failed to fetch products');
    }


    const editButtons = document.querySelectorAll('.edit'); // Chọn tất cả các nút "Sửa"

    // Thêm sự kiện click cho từng nút "Sửa"
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', function () {
            // Lấy ra dữ liệu của dòng tương ứng
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').innerText.trim(); // ID   
            const productName = row.querySelector('td:nth-child(3)').innerText.trim();
            const position = row.querySelector('td:nth-child(4)').innerText.trim();
            const description = row.querySelector('td:nth-child(5)').innerText.trim(); // Họ và tên     
            const status = row.querySelector('td:nth-child(6)').innerText.trim();
            const imgSrc = row.querySelector('td:nth-child(7) img').getAttribute('src');
            const productId = row.querySelector('td:nth-child(8)').innerText.trim(); // ID   

            // Đổ dữ liệu vào các trường nhập trong modal popup
            document.querySelector('#ModalUP input[type="text"][name="slideId"]').value = id;
            document.querySelector('#ModalUP input[name="position"]').value = position;
            document.querySelector('#ModalUP textarea[name="description"]').value = description;
            document.querySelector('#ModalUP img[name="avatar"]').src = imgSrc;
            document.querySelector('#ModalUP select[name="status"]').value == (status == "Bật") ? 1 : 0;
            document.querySelector('#ModalUP input[name="productName"]').value = productName;
            document.querySelector('#ModalUP input[name="productId"]').setAttribute('id', productId);

        });
    });
    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function () {
            const slideId = this.getAttribute('id'); // Lấy ID người dùng từ thuộc tính id của nút
            swal({
                title: "Bạn có chắc không?",
                text: "Một khi bạn xóa, bạn sẽ không thể khôi phục lại thông tin này!",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteSlide(slideId);
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

async function deleteSlide(slideId) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.deleteSlides + `${slideId}`, {
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
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        }).then(() => {
            // Callback này sẽ được gọi sau khi SweetAlert tự đóng
            window.location.reload();
        });
    } else {
        swal({
            title: "Thất bại!",
            text: "Xóa slide thất bại.",
            icon: "error",
            button: true, // Hiện nút để người dùng có thể đóng thông báo thủ công
            timer: 3000, // Thời gian hiển thị là 3 giây
            closeOnClickOutside: false, // Không cho phép đóng khi click bên ngoài
            closeOnEsc: false // Không cho phép đóng khi nhấn Esc
        });
    }
}
