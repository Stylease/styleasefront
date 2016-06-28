// var adminurl = "http://blazen.io/";
var adminurl = "http://localhost:1337/";
// var adminurl = "http://pantherworldadmin.jaipurpinkpanthers.com/";
// var imgurl = "http://pantherworldadmin.jaipurpinkpanthers.com/upload/";
var imgurl = "http://localhost:1337/upload/";
var uploadurl = imgurl;
var imgpath = imgurl + "readFile";
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
    var navigation = [{
        name: "Users",
        classis: "active",
        link: "#/page/userView",
        subnav: []
    }, {
        name: "Product",
        classis: "active",
        link: "#/page/viewProduct",
        subnav: []
    },
    {
        name: "Size",
        classis: "active",
        link: "#/page/viewSize",
        subnav: []
    },
    {
        name: "Occassion",
        classis: "active",
        link: "#/page/viewOccasion",
        subnav: []
    },
    {
        name: "Color",
        classis: "active",
        link: "#/page/viewColor",
        subnav: []
    }];

    return {
        getnav: function() {
            return navigation;
        },
        makeactive: function(menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        saveApi: function(data, apiName, successCallback, errorCallback) {
            $http.post(adminurl + apiName, data).success(successCallback).error(errorCallback);
        },
        deleteProject: function(data, successCallback, errorCallback) {
            $http.post(adminURL + "project/delete", data).success(successCallback).error(errorCallback);
        },
        findProjects: function(apiName, pagination, successCallback, errorCallback) {
            $http.post(adminurl + apiName, pagination).success(successCallback).error(errorCallback);
        },
        findOneProject: function(apiName, urlParams, successCallback, errorCallback) {
            console.log(adminurl + apiName);
            $http.post(adminurl + apiName, urlParams).success(successCallback).error(errorCallback);
        },
        submitLogin: function(data, successCallback, errorCallback) {
            $http.post(adminurl + "User/login", data).success(successCallback).error(errorCallback);
        },
        deleteApi: function(data, successCallback, errorCallback) {
            $http.post(adminURL + "api/delete", data).success(successCallback).error(errorCallback);
        },
        logout: function(successCallback, errorCallback) {
            $http.post(adminurl + "register/logout").success(successCallback).error(errorCallback);
        },

    };
});
