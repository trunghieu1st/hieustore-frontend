import { apiPaths } from "./url.js"
const { DateTime } = luxon;
document.addEventListener('DOMContentLoaded', async function () {
    var accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.error('Access token not found');
        document.getElementById('number-card').style.display = 'none';
        return; // Exit if no access token is available
    }

    try {
        const orderList = document.getElementById('myorder');
        const data1 = await allOrder(accessToken); // Wait for the promise to resolve
        if (!data1 || !data1.data) {
            console.error('No orders found');
            return;
        }

        const orders = data1.data.items;
        if (orders.length > 0) {
            const orderList = document.getElementById('myorder');
            orders.forEach(async order => {
                const data2 = await allOrderDetails(accessToken, order.id);
                const orderDetails = data2.data;
                orderList.innerHTML += ` <div>
                <div class="tile-body">
                    <div class="form-group col-md-6">
                        <label style=" margin-right: 80px;color: orange">Mã đơn hàng: ${order.id}</label>                                       
                        <label>Tổng tiền hàng: ${formatNumber(order.originalPrice)} VNĐ</label>
                    </div>
                    <div class="form-group col-md-6">
                        <label style=" margin-right: 20px;">Ngày đặt hàng: ${order.createdDate}</label>                                       
                        <label >Trạng thái giao hàng: ${(order.statusName == 'Cancelled') ? 'Đã hủy' :
                            ((order.statusName == 'Pending') ? 'Chờ xác nhận' :
                            ((order.statusName == 'Delivering') ? 'Đang giao hàng' :
                            ((order.statusName == 'Watting') ? 'Đang chuẩn bị hàng' : 'Đang chuẩn bị hàng')))}
                        </label>
                    </div>                   
                        <table class="table table-hover table-bordered" id="orderDetailBody">     
                             <thead>                   
                                <tr>                                  
                                    <th width="300px">Tên sản phẩm</th>    
                                    <th width="100px">Đơn giá</th>                         
                                    <th width="100px">Thành tiền</th>
                                    <th width="80px">Ảnh minh họa</th>
                                </tr>
                            </thead>    
                        </table>`;

                orderDetails.forEach(od => {
                    let i = 0;
                    orderList.innerHTML += `
                        <table class="table table-hover table-bordered" id="orderDetailBody" style="text-align: center;">
                   
                                <tr>                               
                                    <th style="font-weight: normal !important;" width="300px"><a  style="color: black;" id="${od.productOptionDto.id}"
                                         onclick="saveId('${od.productOptionDto.id}');" 
                                         href="./user_singleproduct.html">${od.productOptionDto.productName}                                                 
                                         </a> (${od.productOptionDto.ram}G RAM, ${od.productOptionDto.storageCapacity}G Bộ nhớ
                                            Màu ${od.productOptionDto.color}) X${od.quantity}</th>                                   
                                    <th style="font-weight: normal !important;" width="100px">${formatNumber(od.price)} VNĐ</th>             
                                    <th style="font-weight: normal !important;" width="100px">${formatNumber(od.quantity * od.price)} VNĐ</th>                              
                                    <th style="font-weight: normal !important;" width="80px"> <img src="${od.productOptionDto.image}" width="80px" style="align:center;margin-left : 20px" ></th>
                                </tr>
                        
                        </table>
                    </div>
                </div> `;
                });
                orderList.innerHTML += `<hr style="border-color: orange; height: 4px;">`;
            });
          
        }
    } catch (error) {
        console.error('Failed to fetch orders:', error);
    }
});

async function allOrder(accessToken) {
    const url = apiPaths.myOder;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
}

async function allOrderDetails(accessToken, orderId) {
    const url = `${apiPaths.myOderDetail}/${orderId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (!response.ok) throw new Error('Failed to fetch order details');
    return response.json();
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

