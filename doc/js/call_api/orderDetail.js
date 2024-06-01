import { apiPaths } from "./url.js";

const { DateTime } = luxon;
// Lấy thông tin cá nhân từ API khi trang được tải
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    console.error('Access token not found');
}
document.addEventListener('DOMContentLoaded', async function () {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "1000ms rotate_right",
        image: "../images/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const orderId = localStorage.getItem('orderId');
    console.log(orderId);

    const link = apiPaths.getAllOrderDetailById + `${orderId}`;
    const response2 = await fetch(link, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response2.ok) {
        $.LoadingOverlay("hide");
        const data2 = await response2.json();
        const order_details = data2.data;
        let table = document.getElementById('orderDetailBody');
        // Tạo HTML cho mỗi nhóm hàng với rowspan
        let rowsHtml = '';
        let i = 0;
        let sum = 0;
        order_details.forEach(od => {
            rowsHtml += `
                <tr>                                
                    <td><id="${od.id}">${++i}</td>
                    <td hidden>${od.orderId}</td>
                    <td>${od.productOptionDto.productName}</td>
                    <td>${od.productOptionDto.ram}</td>
                    <td>${od.productOptionDto.storageCapacity}</td>
                    <td>${od.productOptionDto.color}</td>                               
                    <td>${formatNumber(od.productOptionDto.price)}</td>
                    <td>${od.quantity}</td>
                    <td>${formatNumber(od.quantity * od.price)}</td>
                    <td>${od.productOptionDto.image == null ? '' : `<img src="${od.productOptionDto.image}" width="100">`}</td>                          
                </tr>
            `;
            sum += od.quantity * od.productOptionDto.price;
        });
        table.innerHTML += rowsHtml; // Thêm tất cả hàng vào bảng
        document.querySelector('#orderId').value = orderId;
        document.querySelector('#sumPrice').value = formatNumber(sum) + ' VNĐ';
      
    } else {
        console.error('Failed to fetch products');
    }

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
