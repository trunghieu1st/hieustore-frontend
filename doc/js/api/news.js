import { apiPaths } from "./url.js"
var accessToken = localStorage.getItem('accessToken');
if (!accessToken || accessToken == null) {
    console.error('Access token not found');
    document.getElementById('number-card').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', async function () {

    // Sử dụng productId trong URL của yêu cầu fetch
    const response = await fetch(apiPaths.getAllNews, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.ok) {
        const newsShow = document.querySelector('.news-container');
        const data = await response.json();
        const news = data.data.items;

        news.forEach(n => {
            if (n.status == true) {
                var newsHTML = `
                <div class="news-items">
                    <img src="${n.avatar}" alt="Ảnh tin tức">
                    <div class="news-content">
                        <h2 class="news-title"><a>${n.title}</a></h2>
                        <p class="news-description">${n.content}</p>
                        <p class="news-description">${n.summary}.</p>
                    </div>
                </div>
            `;
                newsShow.insertAdjacentHTML('beforeend', newsHTML);
            }
        });
    } else {
        console.error('Failed to fetch product information');
    }
});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}