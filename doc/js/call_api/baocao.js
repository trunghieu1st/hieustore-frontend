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
    const res01 = await fetch(apiPaths.getAllUser, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (res01.ok) {
        const data01 = await res01.json();
        const users = data01.data.items;
        document.getElementById('countUser').innerText = users.length + ' khách hàng';
        const userTable = document.getElementById('userTable');
        let rowsHtml = '';
        for (let i = 0; i <= 4; i++) {
            rowsHtml += `
            <tr>
                <td>${users[i].id}</td>
                <td>${users[i].fullName == null ? 'Chưa cập nhật' : users[i].fullName}</td>
                <td>${users[i].birthday == null ? 'Chưa cập nhật' : users[i].birthday}</td>
                <td>${users[i].gender == null ? 'Chưa cập nhật' : users[i].gender}</td>
                <td>${users[i].phone}</td>
                <td>${users[i].email}</td>
             </tr>
        `;
        }
        userTable.innerHTML += rowsHtml;
        $.LoadingOverlay("hide");
    } else {
        console.error('Failed to fetch products');
    }


    //////////////////////////////////Tổng sản phẩm
    const res02 = await fetch(apiPaths.getAllProductOption, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (res02.ok) {
        const data02 = await res02.json();
        const products = data02.data;
        let sumProduct = 0;
        // Đếm xem có hết hàng không
        let outOfStock = 0;
        products.forEach(pro => {
            sumProduct += pro.quantity;
            if (pro.quantity == 0) {
                outOfStock++;
            }
        });
        document.getElementById('countProduct').innerText = sumProduct + ' sản phẩm';

        //////////////////////////////////Hết hàng
        document.getElementById('outOfStock').innerText = outOfStock + ' sản phẩm';

    } else {
        console.error('Failed to fetch products');
    }

    //////////////////////////////////Tổng đơn hàng
    const res03 = await fetch(apiPaths.getAllOrder, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (res03.ok) {
        const data03 = await res03.json();
        const orders = data03.data.items;
        document.getElementById('countOder').innerText = orders.length + ' đơn hàng';

        let sumPrice = 0; //Tổng thu nhập
        let cancelled = 0; //Đơn hủy
        const orderTable = document.getElementById('sumOrder');
        let rowsHtml = '';
        orders.forEach(pro => {
            sumPrice += pro.totalPrice;
            if (pro.statusName == 'Cancelled') {
                cancelled++;
            }

            rowsHtml += `
                <tr>
                    <td>${pro.id}</td>
                    <td>${pro.customerName}</td>
                    <td>${pro.address}</td>
                    <td>${formatNumber(pro.totalPrice)} đ</td>
                 </tr>
            `;
        });
        rowsHtml += `<tr>
                    <th colspan="3">Tổng cộng:</th>
                    <td> ${formatNumber(sumPrice)} đ</td>
                </tr>`;
        orderTable.innerHTML += rowsHtml;
        document.getElementById('sumPrice').innerText = formatNumber(sumPrice) + ' đ';

        //Đơn bị hủy
        document.getElementById('cancelled').innerText = cancelled + ' đơn hàng';

    } else {
        console.error('Failed to fetch products');
    }

});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Giảm đi 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return date;
}

