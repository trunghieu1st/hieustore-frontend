const baseApiUrl = "http://localhost:8080/api/v1";
export const apiPaths = {
    //Slide
    getAllSlides: `${baseApiUrl}/slide/all`,
    createSlide: `${baseApiUrl}/slide/create`,
    deleteSlide: `${baseApiUrl}/slide`,
    //Category
    getAllCategories: `${baseApiUrl}/category/all`,

    //Product Option
    getAllProductOption: `${baseApiUrl}/product/option/allProduct`,
    getAllProductOptionByCategory: `${baseApiUrl}/product/option/allCategory/`, //+id
    getProductOptionById: `${baseApiUrl}/product/option/`, // + Id
    getAllProductOptionByProductId: `${baseApiUrl}/product/option/all/`, // + Id
    
    login: `${baseApiUrl}/auth/login`,
    myOder: `${baseApiUrl}/order/all/my`,
    myOderDetail: `${baseApiUrl}/order-detail/all`,

    //Product
    getAllProduct: `${baseApiUrl}/product/all`,
    getProdcutById: `${baseApiUrl}/product/`, // + id
    searchProduct: `${baseApiUrl}/product/search`, // + id
    //Card
    addToCart: `${baseApiUrl}/cart/create`,
    createCart: `${baseApiUrl}/cart/create`,
    getAllCart: `${baseApiUrl}/cart/all`,
    deleteCardById: `${baseApiUrl}/cart/`, // +id
    // Thêm các đường dẫn API khác vào đây

    //User
    updateUser: `${baseApiUrl}/user`,
    createUser: `${baseApiUrl}/user/create`,
    sendMail: `${baseApiUrl}/auth/send`,

    //User/my
    myInfo: `${baseApiUrl}/user/my`,

    //Address
    getMyAddress: `${baseApiUrl}/address/all`,
    getMyAddressById: `${baseApiUrl}/address/all/`, // id
    updateAddress: `${baseApiUrl}/address/`, // +AddressId

    //News
    getAllNews: `${baseApiUrl}/news/all`,

    //Odder
    createOrder: `${baseApiUrl}/order/create`,

    //Momo
    createMomo: `${baseApiUrl}/momo/create-payment-link`,
    checkStatusMomo: `${baseApiUrl}/momo/check-status-transaction`,

    //Zalo
    createZalo: `${baseApiUrl}/momo/create-payment-link`,
    checkStatusZalo: `${baseApiUrl}/momo/check-status-transaction`,

    //Address

};

//Hướng dẫn khia báo tron gteejp js: import { apiPaths } from "./url.js"