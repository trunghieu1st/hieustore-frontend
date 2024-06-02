import { apiPaths } from "./url.js"
const accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    console.error('Access token not found');
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
    try {
        await fetchUserData();
        await fetchCartData();
        var number_card = document.getElementById('number-card').textContent;

       
        document.getElementById('order-payment').addEventListener('click', async function () {
            if (number_card > 0) {
                var addressMy= document.getElementById('address').value;
                if(!addressMy){
                    toastr.error("Vui lòng cập nhật thông tin cá nhân trước khi đặt hàng!");
                    return;
                }
                let amount = removeDot(document.getElementById('amount').textContent);
                let id = getCurrentTimeAsNumber();
                let payType = "payment_on_delivery";
                const pay_with_momo = document.getElementById('payment_with_momo');
                const pay_with_zalo = document.getElementById('payment_with_zalo');
                const pay_with_payos = document.getElementById('payment_with_payos');

                if (pay_with_momo && pay_with_momo.checked) {
                    payType = "payment_with_momo";
                }

                if (pay_with_zalo && pay_with_zalo.checked) {
                    payType = "payment_with_zalo";
                }

                if (pay_with_payos && pay_with_payos.checked) {
                    payType = "payment_with_payos";
                }

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

                try {
                    if (payType == "payment_on_delivery") {
                        const response1 = await fetch(apiPaths.createOrder, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                addressId: localStorage.getItem('addressId'),
                                orderProductRequestDtos,
                                note: document.getElementById('note').value || "Không có ghi chú",
                                shippingFee: 10000,
                                paymentStatus: false
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
                            toastr.success("Đặt hàng thành công!");
                            window.location.href = 'user_thanks.html';
                        }
                    }
                    // Momo thẳng tiến
                    else if (payType == "payment_with_momo") {
                        const response2 = await fetch(apiPaths.createMomo, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            },
                            body: JSON.stringify({
                                "orderInfo": "HieuStore" + JSON.stringify(orderProductRequestDtos),
                                "amount": amount,
                                "extraData": "",
                                "orderGroupId": ""
                            }),
                        });

                        if (response2.ok) {
                            const data2 = await response2.json();
                            window.location.href = data2.payUrl;
                        } else {
                            alert("Payment failed.");
                        }
                    }
                    else if (payType == "payment_with_zalo") {
                        try {
                            const response2 = await fetch('http://localhost:3000/zalo/payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + accessToken
                                },
                                body: JSON.stringify({
                                    "app_user": "user123",
                                    "amount": amount,
                                    "description": "Lazada - Payment for the order #123456",
                                    "bank_code": ""
                                }),
                            });

                            if (response2.ok) {
                                const data = await response2.json();
                                window.location.href = data.order_url;
                            } else {
                                alert("Payment failed.");
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            alert("Payment failed. Please try again later.");
                        }
                    }
                    else if (payType == "payment_with_payos") {
                        const response4 = await fetch('http://localhost:3000/create-payment-link', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            },
                            body: JSON.stringify({
                                amount: 10000,
                                description: "Thanh toan don hang",
                                orderCode: id
                            })
                        });
                        if (response4.ok) {
                            const data4 = await response4.json();
                            window.location.href = data4.checkoutUrl;
                        } else {
                            alert("Payment failed.");
                        }
                    } else {
                        return;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert("Có lỗi xảy ra khi gửi yêu cầu.");
                }
            }
            else {
                toastr.error("Vui lòng thêm một sản phẩm vào giỏ trước khi đặt hàng!");
            }
        });

    } catch (error) {
        console.error('Error:', error);
        // Xử lý lỗi ở đây
    }
});

async function fetchUserData() {
    const response = await fetch(apiPaths.myInfo, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        const dt = await response.json();
        document.getElementById('name').value = dt.data.fullName;
        document.getElementById('phone').value = dt.data.phone;
        document.getElementById('email').value = dt.data.email;

        const response2 = await fetch(apiPaths.getMyAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data2 = await response2.json();

        document.getElementById('address').value = data2.data[0].address;
        localStorage.setItem('addressId',data2.data[0].id);
    } else {
        console.error('Failed to fetch user data');
    }
}

async function fetchCartData() {
    const response = await fetch(apiPaths.getAllCart, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        const cards = data.data.items;
        let sumTotal = 0;
        const shipIdea = document.getElementById('itemCard');
        cards.forEach(card => {
            const productHTML = `
                <tr class="cart_item">
                    <td class="product-total">${card.productOptionDto.productName} (${card.productOptionDto.ram}G RAM ${card.productOptionDto.storageCapacity}G Memory ${card.productOptionDto.color})</td>
                    <td class="product-total">${card.quantity}</td>
                    <td class="product-total">${formatNumber(card.productOptionDto.price)} VNĐ</td>
                    <td class="product-total">${formatNumber(card.quantity * card.productOptionDto.price)} VNĐ</td>
                </tr>`;
            sumTotal += card.quantity * card.productOptionDto.price;
            shipIdea.insertAdjacentHTML('afterbegin', productHTML);
        });
        document.getElementById('sum-total').textContent = formatNumber(sumTotal);
        document.getElementById('amount').textContent = formatNumber(sumTotal + 10000);
        document.getElementById('ship-total').textContent = formatNumber(10000);
    } else {
        console.error('Failed to fetch cart data');
    }
}


function formatNumber(number) {
    return number.toLocaleString('vi-VN');
}

function getFormattedDate() {
    // Lấy thời gian hiện tại
    const now = new Date();

    // Lấy ngày hiện tại và thêm số 0 phía trước nếu cần
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = now.getFullYear();

    // Ghép các phần lại thành một chuỗi số
    return `${day}${month}${year}`;
}
function removeDot(numberString) {
    // Xóa tất cả các dấu chấm trong chuỗi số
    return numberString.replace(/\./g, '');
}

function getCurrentTimeAsNumber() {
    // Lấy thời gian hiện tại
    const currentTime = new Date();

    // Lấy giờ, phút và giây hiện tại
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    // Tạo số bao gồm giờ, phút và giây
    const combinedNumber = hours * 10000 + minutes * 100 + seconds;

    return combinedNumber;
}