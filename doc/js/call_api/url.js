const baseApiUrl = "https://hieu-store.up.railway.app/api/v1";

export const apiPaths = {
  
    getSomeOtherResource: `${baseApiUrl}/some/other/resource`,
    // Thêm các đường dẫn API khác vào đây

    // Usser
    getAllUser: `${baseApiUrl}/user/all`,
    createUser: `${baseApiUrl}/user/create`,
    editUser:  `${baseApiUrl}/user`,
    deleteUser:  `${baseApiUrl}/user/`,
    //Product
    createProduct: `${baseApiUrl}/product/create`,
    getAllProduct: `${baseApiUrl}/product/all`,
    editProduct: `${baseApiUrl}/product/`, //+id
    getProductbyId: `${baseApiUrl}/product/`, //+id
    deleteProductbyId: `${baseApiUrl}/product/`,
    //Prodcut option
    getAllProductOption: `${baseApiUrl}/product/option/allProduct`,
    getProductOptionById: `${baseApiUrl}/product/option/`,
    createProductOption: `${baseApiUrl}/product/option/create`,
    editProductOption: `${baseApiUrl}/product/option/`, //+id
    deleteProductOptionById: `${baseApiUrl}/product/option/`, //+id
    //Orrder
    getAllOrder: `${baseApiUrl}/order/all`,
    editOrder: `${baseApiUrl}/order/`, //+id
    deleteOrder: `${baseApiUrl}/order/`, //+id
    //Category
    getAllCategory: `${baseApiUrl}/category/all`,
    deleteCategoryById: `${baseApiUrl}/category/`, //+id
    createCategory: `${baseApiUrl}/category/create`,
    editCategory: `${baseApiUrl}/category/`, //+id

    //new
    createNews: `${baseApiUrl}/news/create`,
    editNews: `${baseApiUrl}/news/`, //+id
    getAllNews: `${baseApiUrl}/news/all`, //+id
    deleteNews: `${baseApiUrl}/news/`, //+id
    //Slide
    createSlide: `${baseApiUrl}/slide/create`,
    editSlide: `${baseApiUrl}/slide/`, //+id
    getAllSlides: `${baseApiUrl}/slide/all`,
    deleteSlides: `${baseApiUrl}/slide/`, //+id
    // Order_details
    getAllOrderDetailById: `${baseApiUrl}/order-detail/all/`, //+id

    //login
    login: `${baseApiUrl}/auth/login`, //+id

    //Paynent methods
    createPaymentMethods: `${baseApiUrl}/payment-methods/create`,
    editPaymentMethods: `${baseApiUrl}/payment-methods/`, //+id
    getAllPaymentMethods: `${baseApiUrl}/payment-methods/all`, //+id
    deletePaymentMethods: `${baseApiUrl}/payment-methods/`, //+id
};
// import { apiPaths } from "./url.js";