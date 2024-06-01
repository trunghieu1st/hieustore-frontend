document.addEventListener('DOMContentLoaded', async function () {
    const filterButtons = document.getElementById('showFitter');
    filterButtons.addEventListener('click', function(){
        const showFitter = document.getElementById('filterAll');
        const isActive = filterButtons.classList.contains('active');
        if (isActive) {
            showFitter.classList.remove('active');
        } else {
            showFitter.classList.add('active');
        }
    });

    const hideFitter = document.getElementById('hideFitter');
    hideFitter.addEventListener('click', function(){
        const showFitter = document.getElementById('filterAll');       
        showFitter.classList.remove('active');
       
    });

    const fitterItem = document.querySelectorAll('.button__filter-child');
    fitterItem.forEach(ft =>{
        ft.addEventListener('click', function(){
            const isActive = ft.classList.contains('active');
            if (isActive) {
                ft.classList.remove('active');
            } else {
                ft.classList.add('active');
            }
        });
        
    })
})