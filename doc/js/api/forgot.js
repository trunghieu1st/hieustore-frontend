import { apiPaths } from "./url.js";

document.addEventListener('DOMContentLoaded', async function () {

    document.getElementById('forgotButton').addEventListener("click", async function () {
        var emailStr = document.getElementById('emailInput').value;
        var emailRegexStr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        var isvalid = emailRegexStr.test(emailStr);
        if (!isvalid) {
            swal({
                title: "",
                text: "Bạn vui lòng nhập đúng định dạng email...",
                icon: "error",
                close: true,
                button: "Thử lại",
            });
            document.getElementById('emailInput').focus;
        } else {
            let url = apiPaths.sendMail;
            try {
                $.LoadingOverlay("show", {
                    background: "rgba(255, 255, 255, 0.6)",
                    imageAnimation: "2000ms rotate_right",
                    image: "./img/loading.jpg",
                    imageColor: "black",
                    maxSize: 100,
                });
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "email": emailStr
                    })
                });
                if (!response.ok) {
                    swal({
                        title: "Không tồn tại email!",
                        text: "Không có người dùng với email: " + emailStr,
                        icon: "error",
                        close: true,
                        button: "Đóng",
                    });
                }
                else {
                    swal({
                        title: "Đã gửi mã xác nhận",
                        text: "Chúng tôi đã gửi mã xác nhận qua email:" + emailStr,
                        icon: "success",
                        close: true,
                        button: "Đóng",
                    });

                    document.getElementById('emailInput').style.display = 'none';
                    document.getElementById('forgotButton').style.display = 'none';
                    document.getElementById('verificalCode').style.display = 'block';
                    document.getElementById('verificalButton').style.display = 'block';
                    
                    const countdownElement = document.getElementById('countdown');
                    countdownElement.style.display = 'block';

                    const fiveMinutes = 60 * 5;
                    startCountdown(fiveMinutes, countdownElement);
                }
            } catch (error) {
                console.error('Error:', error);
                throw error; // Đẩy lỗi để bắt ở phía trên
            } finally {
                $.LoadingOverlay("hide");
            }
        }
    })
});

function startCountdown(duration, display) {
    var timer = duration, minutes, seconds;
    var countdownInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            display.textContent = "Mã hết hạn!";
            // Add any additional actions when the countdown finishes here
        }
    }, 1000);
}