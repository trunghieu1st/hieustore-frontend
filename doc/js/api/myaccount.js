import { apiPaths } from "./url.js"
var accessToken = localStorage.getItem('accessToken');
if (!accessToken || accessToken == null) {
    console.error('Access token not found');
    document.getElementById('number-card').style.display = 'none';
}

const { DateTime } = luxon;
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

    const username = document.getElementById('username');
    const fullName = document.getElementById('fullName');
    const gender = document.getElementById('gender');
    const birthday = document.getElementById('birthday');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const avatar = document.getElementById('avatar');
    const avatarFileInput = document.getElementById('avatarFileInput');

    const response = await fetch(apiPaths.myInfo, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const response2 = await fetch(apiPaths.getMyAddressById, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        username.value = data.data.username;
        fullName.value = data.data.fullName == null ? '' : data.data.fullName;
        data.data.gender == null ? gender.value = '' : (data.data.gender == 'false' ? gender.value = '0' : gender.value = '1');
        birthday.value = data.data.birthday == null ? '' : DateTime.fromISO(data.data.birthday).toFormat('yyyy-MM-dd')
        phone.value = data.data.phone;
        email.value = data.data.email;
        avatar.src = data.data.avatar != null ? data.data.avatar : 'img/img_login.png';
    }
    if (response2.ok) {
        const data2 = await response2.json();
        if (data2.data && data2.data.length > 0) {
            // Truy cập phần tử đầu tiên của mảng để lấy địa chỉ
            address.value = data2.data[0].address == null ? '' : data2.data[0].address;
            console.log(data2.data[0].id);
            localStorage.setItem('addressId', data2.data[0].id);
            localStorage.setItem('address', data2.data[0].address);
        }
    }

    const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', function () {
        document.getElementById('editButton').style.display = 'none';
        document.getElementById('save').removeAttribute('hidden');
        document.getElementById('cancel').removeAttribute('hidden');
        avatarFileInput.style.display = '';
        username.readOnly = false;
        fullName.readOnly = false;
        gender.removeAttribute('disabled');
        birthday.readOnly = false;
        phone.readOnly = false;
        email.readOnly = false;
        address.readOnly = false;
        avatar.readOnly = false;
        username.focus();
        avatarFileInput.addEventListener('change', function () {
            const file = avatarFileInput.files[0]; // Lấy file đầu tiên từ danh sách các files đã chọn
            const filePath = URL.createObjectURL(file); // Tạo đường dẫn tạm thời cho tệp
            avatar.src = filePath;
            console.log(filePath);
        });
    });
    document.getElementById('save').addEventListener('click', function (e) {
        e.preventDefault();
        const usernameInput = username.value;
        const fullNameInput = fullName.value;
        const genderInput = gender.value == '' ? null : (gender.value == '0' ? 0 : 1);
        const birthdayInput = birthday.value;
        const phoneInput = phone.value;
        const emailInput = email.value;
        const addressInput = address.value;
        const file = avatarFileInput.files[0];
        const formData = new FormData();
        formData.append('username', usernameInput);
        formData.append('fullName', fullNameInput);
        formData.append('gender', genderInput);
        formData.append('birthday', birthdayInput);
        formData.append('phone', phoneInput);
        formData.append('email', emailInput);
        if (file) {
            formData.append('avatar', file);
        }
        const response2 = fetch(apiPaths.updateAddress + `${localStorage.getItem('addressId')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                "customerName": fullNameInput,
                "phone": phoneInput,
                "address": addressInput,
                "type": 0,
                "addressDefault": 1
            })
        });
        updateUser(formData);
    });
    document.getElementById('cancel').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.reload();
    });
});
async function updateUser(formData) {
    $.LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.6)",
        imageAnimation: "3000ms rotate_right",
        image: "./img/loading.jpg",
        imageColor: "black",
        maxSize: 100,
    });
    const response = await fetch(apiPaths.updateUser, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        body: formData
    });
    if (response.ok) {
        toastr.success("Thay đổi thông tin thành công!");
        setTimeout(() => {
            location.reload();
        }, 800);
    }
    else {
        response.json().then(data => {
            toastr.error(JSON.stringify(data.message));
        });
    }

    $.LoadingOverlay("hide");
}
