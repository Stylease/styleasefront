//var adminurl = "http://admin.thestylease.com/";
// var adminurl = "http://192.168.0.110:81/";
 var adminurl = "http://130.211.245.224:81/";
//var adminurl = "http://localhost:1337/";
var imgurl = adminurl + "upload/";
var uploadurl = imgurl;
var uploadallurl = imgurl + "allImage/";
var imgpath = imgurl + "readFile";
var navigationservice = angular.module('navigationservice', [])

    .factory('NavigationService', function ($http) {
        var navigation = [{
            name: "Users",
            classis: "active",
            link: "#/page/userView",
            subnav: []
        }, {
            name: "Slider",
            classis: "active",
            link: "#/page/viewSlider",
            subnav: []
        }, {
            name: "Category",
            classis: "active",
            link: "#/page/viewCategory",
            subnav: []
        }, {
            name: "Subcategory",
            classis: "active",
            link: "#/page/viewSubcategory",
            subnav: []
        }, {
            name: "Product",
            classis: "active",
            link: "#/page/viewProduct",
            subnav: []
        }, {
            name: "Order",
            classis: "active",
            link: "#/page/viewOrder",
            subnav: []
        }, {
            name: "Celebrity choice",
            classis: "active",
            link: "#/page/viewCelebritychoice",
            subnav: []
        }, {
            name: "Color",
            classis: "active",
            link: "#/page/viewColor",
            subnav: []
        }, {
            name: "Size",
            classis: "active",
            link: "#/page/viewSize",
            subnav: []
        },
        {
            name: "Designer Type",
            classis: "active",
            link: "#/page/viewDesignerType",
            subnav: []
        }, {
            name: "Designer",
            classis: "active",
            link: "#/page/viewDesigner",
            subnav: []
        }, {
            name: "Config",
            classis: "active",
            link: "#/page/viewConfig",
            subnav: []
        }, {
            name: "Testimonial",
            classis: "active",
            link: "#/page/viewTestimonial",
            subnav: []
        }, {
            name: "Filter Sorting",
            classis: "active",
            link: "#/page/viewProductsort",
            subnav: []
        }, {
            name: "Disable Product",
            classis: "active",
            link: "#/page/viewProducttime",
            subnav: []
        }, {
            name: "Coupon",
            classis: "active",
            link: "#/page/viewCoupon",
            subnav: []
        }, {
            name: "Contact",
            classis: "active",
            link: "#/page/viewContact",
            subnav: []
        }, {
            name: "External Enquiry",
            classis: "active",
            link: "#/page/viewLocation",
            subnav: []
        }];

        return {
            getnav: function () {
                return navigation;
            },
            makeactive: function (menuname) {
                console.log(menuname);
                for (var i = 0; i < navigation.length; i++) {
                    if (navigation[i].link == menuname) {
                        navigation[i].classis = "active";
                    } else {
                        navigation[i].classis = "";
                    }
                }
                return menuname;
            },
            saveApi: function (data, apiName, successCallback, errorCallback) {
                $http.post(adminurl + apiName, data).success(successCallback).error(errorCallback);
            },
            getSubCategory: function (successCallback, errorCallback) {
                $http.post(adminurl + "subcategory/getAll").success(successCallback).error(errorCallback);
            },

            getDesigner: function (successCallback, errorCallback) {
                $http.post(adminurl + "designer/getAll").success(successCallback).error(errorCallback);
            },
            deleteProject: function (data, successCallback, errorCallback) {
                $http.post(adminURL + "project/delete", data).success(successCallback).error(errorCallback);
            },
            findRentalDate: function (apiName, pagination, successCallback, errorCallback) {
                $http.post(adminurl + apiName, pagination).success(successCallback).error(errorCallback);
            },
            findProjects: function (apiName, pagination, successCallback, errorCallback) {
                $http.post(adminurl + apiName, pagination).success(successCallback).error(errorCallback);
            },
            findOneProject: function (apiName, urlParams, successCallback, errorCallback) {
                console.log(adminurl + apiName);
                $http.post(adminurl + apiName, urlParams).success(successCallback).error(errorCallback);
            },

            getDropDown: function (apiName, successCallback, errorCallback) {
                $http.post(adminurl + apiName).success(successCallback).error(errorCallback);
            },

            Excel: function (apiName, successCallback) {
                $http.post(adminurl + apiName).success(successCallback);
            },

            submitLogin: function (data, successCallback, errorCallback) {
                $http.post(adminurl + "register/login", data).success(successCallback).error(errorCallback);
            },
            deleteApi: function (data, successCallback, errorCallback) {
                $http.post(adminURL + "api/delete", data).success(successCallback).error(errorCallback);
            },
            logout: function (successCallback, errorCallback) {
                $http.post(adminurl + "register/logout").success(successCallback).error(errorCallback);
            },
            sideMenu1: function (apiName, pagination, successCallback, errorCallback) {
                $http.post(adminurl + apiName, pagination).success(successCallback).error(errorCallback);
            },

            uploadExcel: function (filename, callback) {
                var data = {
                    "file": filename
                };
                return $http({
                    url: adminurl + "product/import",
                    method: "POST",
                    data: data
                }).success(callback);
            },

            exportOrder: function (filename, callback) {
                var data = {

                };
                return $http({
                    url: adminurl + "order/generateExcel",
                    method: "POST",
                    data: data
                }).success(callback);
            },


            getCoupon: function (cdata, callback, errCallback) {
                var data = cdata;
                return $http({
                    url: adminurl + "coupon/getLimited",
                    method: "POST",
                    data: data
                }).success(callback).error(errCallback);
            },

            exportOrderByDesigner: function (designer, callback) {
                var data = {
                    designer: designer
                };
                return $http({
                    url: adminurl + "order/generateExcelByDesigner",
                    headers: {
                        'Content-Type': "application/octet-stream"
                    },
                    method: "POST",
                    data: data
                }).success(callback);
            },
        };
    });
