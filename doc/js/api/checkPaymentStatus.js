import { apiPaths } from "./url.js"
var accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    document.getElementById('myaccount').href = './user_login.html';
    document.getElementById('number-card').style.display = 'none';
}

toastr.options = {
    progressBar: false,
    newestOnTop: true,           // Hiển thị thông báo mới nhất ở trên cùng
    preventDuplicates: false,
    onclick: null,
    positionClass: 'toast-top-center',
    toastClass: 'toastr-custom-width',
    showEasing: 'swing',         // Hiệu ứng hiển thị
    hideEasing: 'linear',        // Hiệu ứng ẩn
    showMethod: 'fadeIn',        // Phương thức hiển thị
    hideMethod: 'fadeOut',        // Phương thức ẩn      
    timeOut: '3000',             // Thời gian tự động ẩn thông báo (milliseconds)           
    extendedTimeOut: 0,
};

document.addEventListener('DOMContentLoaded', async function () {
    // Lấy URL hiện tại
    var currentURL = window.location.href;
    const response = await fetch(apiPaths.getAllCart, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch cart data');
        return;
    }
    const data = await response.json();
    const cards = data.data.items;
    const orderProductRequestDtos = cards.map(card => ({
        productOptionId: card.productOptionDto.id,
        quantity: card.quantity
    }));

    var urlParams = new URLSearchParams(new URL(currentURL).search);

    if (currentURL == 'http://127.0.0.1:5500/hieustore_user/user_cart.html') {
        console.log("Đúng đường dẫn");
    } else {
        if (currentURL.includes('MOMO')) {
            // Phân tích URL để lấy các tham số
            var orderId = urlParams.get('orderId');
            console.log("Gọi API kiểm tra thanh toán của Momo...");
            // Gọi API kiểm tra thanh toán của Momo
            fetch(apiPaths.checkStatusMomo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "orderId": orderId })
            })
                .then(response => response.json())
                .then(async data => {
                    if (data.resultCode == 0) {
                        console.log(data); // Xử lý dữ liệu trả về từ API ở đây
                        var notes = document.getElementById('note').value || "Không có ghi chú";
                        const response1 = await fetch(apiPaths.createOrder, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                addressId: localStorage.getItem('addressId'),
                                orderProductRequestDtos,
                                note: notes + ' (Momo orderId: ' + data.orderId + ')',
                                shippingFee: 10000,
                                paymentStatus: true
                            })
                        });
                        if (response1.ok) {
                            cards.forEach(async card => {
                                const response = await fetch(apiPaths.deleteCardById + `${card.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': 'Bearer ' + accessToken
                                    },
                                });
                            })
                            toastr.success("Thanh toán qua MOMO thành công!");
                            window.location.href = 'user_thanks.html';
                        }
                    }
                    else {
                        toastr.error("Thanh toán qua MOMO thất bại!");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);

                });
        } else {
            if (currentURL.includes('appid') && currentURL.includes('apptransid')) {
                var app_id = urlParams.get('appid');
                var app_trans_id = urlParams.get('apptransid');
                // alert(app_id + app_trans_id);
                fetch('http://localhost:3000/zalo/check-status-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    },
                    body: JSON.stringify({
                        "app_id": app_id,
                        "app_trans_id": app_trans_id
                    })
                })
                    .then(response => response.json())
                    .then(async data => {
                        if (data.return_code == 3) {
                            toastr.error("Thanh toán qua ZaloPay thất bại!");
                        }
                        else {
                            if (data.return_code == 2) {
                                toastr.error("Thanh toán Zalopay hết hạn! VUi lòng tạo giao dịch mới!");
                            }
                            else {
                                if (data.return_code == 1) {
                                    var notes = document.getElementById('note').value || "Không có ghi chú";
                                    console.log(data); // Xử lý dữ liệu trả về từ API ở đây
                                    const response1 = await fetch(apiPaths.createOrder, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`
                                        },
                                        body: JSON.stringify({
                                            addressId: localStorage.getItem('addressId'),
                                            orderProductRequestDtos,
                                            note: notes + ' (Zalo zp_trans_id: ' + data.zp_trans_id + ')',
                                            shippingFee: 10000,
                                            paymentStatus: true
                                        })
                                    });
                                    if (response1.ok) {
                                        cards.forEach(async card => {
                                            const response2 = await fetch(apiPaths.deleteCardById + `${card.id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Authorization': 'Bearer ' + accessToken
                                                },
                                            });
                                        })
                                        toastr.success("Thanh toán qua ZaloPay thành công!");
                                        window.location.href = 'user_thanks.html';
                                    }
                                }
                                else {
                                    toastr.error("Thanh toán qua ZaloPay thất bại!");
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
            else {
                if (currentURL.includes('cancel') && currentURL.includes('status')) {
                    var cancel = urlParams.get('cancel');
                    var status = urlParams.get('status');
                    var orderCode = urlParams.get('orderCode');
                    // alert(app_id + app_trans_id);
                    if (cancel == 'false' && status == 'PAID') {
                        var notes = document.getElementById('note').value || "Không có ghi chú";
                        const response1 = await fetch(apiPaths.createOrder, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                addressId: localStorage.getItem('addressId'),
                                orderProductRequestDtos,
                                note: notes + ' (PayOS orderCode: ' + orderCode + ')',
                                shippingFee: 10000,
                                paymentStatus: true
                            })
                        });
                        if (response1.ok) {
                            cards.forEach(async card => {
                                const response2 = await fetch(apiPaths.deleteCardById + `${card.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': 'Bearer ' + accessToken
                                    },
                                });
                            })
                            toastr.success("Thanh toán qua PayOS thành công!");
                            window.location.href = 'user_thanks.html';
                        }
                    }
                    else {
                        if (cancel == 'true' || status == 'CANCELLED ') {
                            toastr.error("Đã hủy thanh toán qua PayOS!");
                        }
                        else {
                            toastr.error("Thanh toán qua PayOS thất bại!");
                        }
                    }
                }
            }
        }

    }

})
// http://127.0.0.1:5500/hieustore_user/user_thanks.html?code=00&id=3bc38dece0dd403fa1b801e756c2477f&
//cancel=false&status=PAID&orderCode=111027
