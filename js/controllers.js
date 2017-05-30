//  var adminURL = "http://localhost:1337/";
var adminURL = "http://130.211.245.224:81/";
// window.uploadurl = "http://192.168.1.122:81/" + "upload/";
var mockURL = adminURL + "callApi/";

angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngSanitize', 'ngMaterial', 'ngMdIcons', 'ui.sortable', 'angular-clipboard', 'imageupload', 'ngDialog', 'ui.bootstrap'])

    .controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state) {
        $scope.menutitle = NavigationService.makeactive("Login");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.successmsg = "";

        $scope.user = '';
        $scope.submitLogin = function (user) {
            NavigationService.submitLogin(user, function (data) {
                console.log(data);
                if (data.value === true) {
                    $state.go("page", {
                        jsonName: "userView"
                    });
                    $.jStorage.set("user", data);
                } else if (data.value === false) {
                    $scope.successmsg = "Email or Password is wrong";
                }
            }, function () {
                console.log("Fail");
            });
        };
    })


    .controller('DashboardCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("dashboard");
        $scope.menutitle = NavigationService.makeactive("Dashboard");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.jsonUpcomingOrders = [];
        $scope.jsonPickupOrders = [];
        $scope.jsonRefundOrders = []
        $scope.pageInfo = {};
        console.log($scope.pagination);
        NavigationService.findProjects("Order/getUpcomingOrders", $scope.json, function (findData) {
            console.log(findData);
            if (findData.value !== false) {
                if (findData.data && findData.data.length > 0) {

                    $scope.jsonUpcomingOrders = findData.data;
                }
            } else {
                $scope.jsonUpcomingOrders = [];
            }
        }, function () {
            console.log("Fail");
        });
        NavigationService.findProjects("Order/getUpcomingPickupOrders", $scope.json, function (findData) {
            console.log(findData);
            if (findData.value !== false) {
                if (findData.data && findData.data.length > 0) {

                    $scope.jsonPickupOrders = findData.data;
                }
            } else {
                $scope.jsonPickupOrders = [];
            }
        }, function () {
            console.log("Fail");
        });

        NavigationService.findProjects("Order/getRefundOrders", $scope.json, function (findData) {
            console.log(findData);
            if (findData.value !== false) {
                if (findData.data && findData.data.length > 0) {

                    $scope.jsonRefundOrders = findData.data;
                }
            } else {
                $scope.jsonRefundOrders = [];
            }
        }, function () {
            console.log("Fail");
        });

    })

    .controller('UsersCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("users");
        $scope.menutitle = NavigationService.makeactive("Users");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.field = {};
        $scope.onimageupload = function (data) {
            console.log(data);
        };
    })


    .controller('SelectFilterController', function ($scope, $element) {

        $scope.searchTerm;
        $scope.clearSearchTerm = function () {
            $scope.searchTerm = '';
        };
        console.log("aaa", $scope.searchTerm);
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function (ev) {
            console.log("ev", ev, $scope.searchTerm);
            ev.stopPropagation();
        });
    })


    .controller('jsonViewCtrl', function ($scope, $element, TemplateService, NavigationService, $timeout, $stateParams, $http, $state, $filter, $mdDialog, $location, ngDialog) {
        //Used to name the .html file
        $scope.back = function () {
            window.history.back();
        };
        $scope.template = TemplateService.changecontent("users");
        $scope.menutitle = NavigationService.makeactive('#' + $location.path());
        TemplateService.title = 'Backend';
        $scope.navigation = NavigationService.getnav();
        var jsonArr = $stateParams.jsonName.split("¢");
        var jsonName = jsonArr[0];
        var urlParams = {};
        $scope.dropdown = {};
        $scope.dropdownvalues = [];
        $scope.filterData = [];
        $scope.sidemenuVal = $stateParams;
        var jsonParam1 = jsonArr[1];
        var jsonParam2 = jsonArr[2];
        var jsonParam3 = jsonArr[3];
        var jsonParam4 = jsonArr[4];
        var jsonParam5 = jsonArr[5];
        var jsonParam6 = jsonArr[6];
        var jsonParam7 = jsonArr[7];
        var jsonParam8 = jsonArr[8];
        var jsonParam9 = jsonArr[9];
        // console.log(jsonArr);
        //  $scope.jsonStatus = [
        //      "Processing",
        //      "Order Confirmed",
        //      "Out for Delivery",
        //      "Delivered",
        //      "Pick-up",
        //      "Received",
        //      "Refund",
        //      "Completed",
        //      "Cancelled"
        //  ]
        $scope.sortableOptions = {
            stop: function (e, ui) {
                console.log($scope.json.tableData);
                var ids = _.map($scope.json.tableData, "_id");
                var names = _.map($scope.json.tableData, "name");
                console.log(names);
                $http.post(adminurl + $scope.json.sortable, ids).success(function (data) {
                    showToast("Sorted Successfully");
                }, function () {
                    showToast("Error Sorting");
                });
            }
        };


        $scope.excelUploaded = function (file) {
            console.log("Excel is uploaded with name ", file);
            NavigationService.uploadExcel(file, function (data) {
                $scope.data = data.data;
                // console.log("csvday",$scope.data);
            });
        };

        // $scope.exportOrder = function () {

        //         window.open(adminURL + 'order/generateExcel', '_blank');
        //         window.close();
        //       // var senddata={};

        // };

        $scope.exportOrder = function (data) {
            if (data) {
                console.log("data", data);
                // NavigationService.exportOrderByDesigner(data, function (data) {
                //     // window.close();
                //     console.log("doneeee");
                // });

                window.open(adminURL + 'order/generateExcelByDesigner?designer=' + data, '_blank');
                window.close();
            } else {
                console.log("else");
                window.open(adminURL + 'order/generateExcel', '_blank');
                window.close();
            }


        };

        $scope.searchTerm;
        $scope.clearSearchTerm = function () {
            $scope.searchTerm = '';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        $scope.confirm = function (title, content, api, data) {
            var confirm = $mdDialog.confirm()
                .title(title)
                .textContent(content)
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                $http.post(api, data).success(function (data) {
                    $state.reload();
                    showToast("Deleted Successfully");
                }, function () {
                    showToast("Error Deleting");
                });
            }, function () {

            });
        };

        $http.get("./pageJson/" + jsonName + ".json").success(function (data) {
            _.each(data.urlFields, function (n, key) {
                urlParams[n] = jsonArr[key + 1];
            });
            // console.log("jsonName", jsonName);
            if (jsonName == 'viewContact' || jsonName == 'viewLocation') {
                $scope.searchPlaceholder = "Search by Email";
            } else {
                $scope.searchPlaceholder = "Search by Name";
            }
            // console.log("searchPlaceholder", $scope.searchPlaceholder);

            console.log(urlParams);
            $scope.json = data;
            console.log($scope.json);
            if ($scope.json.sidemenu && $scope.json.sidemenu.length > 0) {
                $scope.sidemenuThere = true;
            }
            var idForCreate = $location.absUrl().split('%C2%A2')[1];

            console.log(idForCreate);
            $scope.idForCreate = idForCreate;
            if (idForCreate) {
                $scope.goToCreatePage = function () {
                    console.log("In create");
                    $location.url("/page/" + $scope.json.createButtonUrl + idForCreate);
                };

            }
            if (data.pageType == "orderview") {
                $scope.apiName = $scope.json.apiCall.url;
                console.log("in orderview", $scope.apiName);

                //filter orderview

                //  $scope.orderFilter = function () {
                //      $scope.modalInstance = $uibModal.open({
                //          scope: $scope,
                //          templateUrl: 'views/modal/filter.html',
                //      });
                //  };

                //functionality for filter start
                $scope.orderFilter = function () {
                    $mdDialog.show({
                        scope: $scope,
                        templateUrl: 'views/modal/filter.html',
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen
                    });

                };

                //filter code for popup filter start
                $scope.pagination = {
                    "search": "",
                    "pagenumber": 1,
                    "pagesize": 10
                };
                $scope.orderFilterClose = function () {
                    $mdDialog.hide();
                };
                $scope.filterData = [{
                    name: "Coupon Code",
                }, {
                    name: "Occasion Type",
                }, {
                    name: "Designer"
                }, {
                    name: "Order Status",
                    data: ["Processing",
                        "Order Confirmed",
                        "Out for Delivery",
                        "Delivered",
                        "Pick-up",
                        "Received",
                        "Refund",
                        "Completed",
                        "Cancelled"
                    ]
                }, {
                    name: "Price",
                    data: [
                        "0-10000", "11000-20000", "21000-30000", "31000-40000", "41000-50000", "51000-60000", "61000-70000",
                        "71000-80000", "81000-90000", "91000-100000", "100000 & Above"
                    ]
                }, {
                    name: "Rental Date"
                }];

                NavigationService.getCoupon($scope.pagination, function (data) {
                    console.log("allCoupon", $scope.allCoupon);
                    if (data.value) {
                        $scope.allCoupon = data.data.data;
                        $scope.filterData.allCoupon = $scope.allCoupon;
                        //  console.log("allCoupon", $scope.allCoupon);
                        //  console.log("filterData", $scope.filterData);
                    }
                }, function () {
                    console.log("fail");
                });
                //  get subcategory
                NavigationService.getSubCategory(function (data) {
                    if (data.value) {
                        $scope.subCategory = data.data;
                        $scope.filterData.subCategory = $scope.subCategory;
                        console.log("nnnnnnnn", $scope.filterData.subCategory);
                    }
                }, function () {
                    console.log("fail");
                });

                //get designer 
                NavigationService.getDesigner(function (data) {
                    if (data.value) {
                        $scope.designer = data.data;
                        $scope.filterData.designer = $scope.designer;
                        console.log("mmmm", $scope.filterData.designer);
                    }
                }, function () {
                    console.log("fail");
                });

                //  $scope.searchClick = function (search) {
                //      console.log("search 360", search);
                //      //  $scope.filterSearch = true;
                //      $scope.search = search;
                //      console.log($scope.search);
                //      search = $scope.search;
                //      $scope.getMoreResults(undefined, $scope.search);
                //  };
                $scope.searchPop = {};
                //API call require in this function only

                //filters of order 
                $scope.searchPop.couponCode = [];
                $scope.searchPop.occasionType = [];
                $scope.searchPop.designers = [];
                $scope.searchPop.orderStat = [];
                $scope.searchPop.price = '';
                $scope.searchPop.rentalDate = '';

                $scope.pushfilters = function (data, catName) {

                    // console.log("dataaaapushFilterscatName", data);
                    //console.log("dataaaapushFilterscatName", catName);

                    //coupon code
                    if (catName == 'Coupon Code') {
                        if (document.getElementById(data.name).checked) {
                            $scope.searchPop.couponCode.push(data.name);
                            //console.log("$scope.searchPop.couponCode", $scope.couponCode);
                        } else {
                            var arraydata = $scope.searchPop.couponCode.indexOf(data.name);
                            $scope.searchPop.couponCode.splice(arraydata, 1);
                            //console.log("$scope.searchPop.couponCode", $scope.searchPop.couponCode);
                        }
                    }

                    //Occasion type
                    if (catName == 'Occasion Type') {
                        if (document.getElementById(data.name).checked) {
                            $scope.searchPop.occasionType.push(data._id);
                            //console.log("$scope.searchPop.occasionType", $scope.searchPop.occasionType);
                        } else {
                            var arraydata = $scope.searchPop.occasionType.indexOf(data._id);
                            $scope.searchPop.occasionType.splice(arraydata, 1);
                            //console.log("$scope.searchPop.occasionType", $scope.searchPop.occasionType);
                        }
                    }

                    //Designer
                    if (catName == 'Designer') {
                        if (document.getElementById(data.name).checked) {
                            $scope.searchPop.designers.push(data._id);
                            //console.log("$scope.searchPop.designers", $scope.searchPop.designers);
                        } else {
                            var arraydata = $scope.searchPop.designers.indexOf(data._id);
                            $scope.searchPop.designers.splice(arraydata, 1);
                            //console.log("$scope.searchPop.designer", $scope.searchPop.designer);
                        }
                    }

                    //Order Status
                    if (catName == 'Order Status') {
                        if (document.getElementById(data).checked) {
                            $scope.searchPop.orderStat.push(data);
                            console.log("$scope.searchPop.orderStat", $scope.searchPop.orderStat);
                        } else {
                            var arraydata = $scope.searchPop.orderStat.indexOf(data);
                            $scope.searchPop.orderStat.splice(arraydata, 1);
                            console.log("$scope.searchPop.orderStat", $scope.searchPop.orderStat);
                        }
                    }

                    //price
                    if (catName == 'Price') {
                        if (document.getElementById(data).checked) {
                            $scope.searchPop.price = data;
                            console.log("$scope.searchPop.price", $scope.searchPop.price);
                        }
                    }

                    //Rental Date
                    if (catName == 'Rental Date') {
                        $scope.searchPop.rentalDate = data.rentalDate;
                        console.log("$scope.searchPop.rentalDate", $scope.searchPop.rentalDate);
                    }

                }
                // filters for order end
                //filter code for popup filter end
                $scope.filterActive = 0;
                $scope.selectedFilters = {};

                $scope.changeFilter = function (data) {
                    $scope.filterActive = data;
                };

                //filter orderview end
                //functionality for filter end
                //get coupon code
                //  NavigationService.getCoupon($scope.pagination, function (data) {
                //      if (data.value) {
                //          $scope.allCoupon = data.data.data;
                //          $scope.filterData.allCoupon = $scope.allCoupon;
                //          console.log("allCoupon", $scope.allCoupon);
                //          console.log("filterData", $scope.filterData);
                //      }
                //  }, function () {
                //      console.log("fail");
                //  });

                //get subcategory 
                //  NavigationService.getSubCategory(function (data) {
                //      if (data.value) {
                //          $scope.subCategory = data.data;
                //          console.log($scope.subCategory);
                //      }
                //  }, function () {
                //      console.log("fail");
                //  });

                //  //get designer 
                //  NavigationService.getDesigner(function (data) {
                //      if (data.value) {
                //          $scope.designer = data.data;
                //          console.log($scope.designer);
                //      }
                //  }, function () {
                //      console.log("fail");
                //  });

                // SIDE MENU DATA
                var urlid1 = $location.absUrl().split('%C2%A2')[1];
                console.log(urlid1);
                // var urlid2 = $location.absUrl().split('%C2%A2')[2];
                $scope.pagination1 = {};
                if (urlid1) {
                    console.log('urlid1', urlid1);
                    if ($scope.json.sendIdWithCreate) {
                        $scope.json.createButtonState = $scope.json.createButtonState.split("'" + "})").join("¢" + urlid1 + "'" + "})");
                        // $scope.json.createButtonState = $scope.json.createButtonState.split("%25C2%").join("%C2%");
                        // $scope.json.createButtonState = $scope.json.createButtonState.split("%25A2").join("%A2");
                    }
                    console.log($scope.json.createButtonState);
                    $scope.api1 = $scope.json.sidemenu[1].callFindOne;
                    if ($scope.json.sidemenu[1].sendParam && $scope.json.sidemenu[1].sendParam !== '') {
                        // ARRAY
                        // $scope.pagination1._id = urlid1;
                        $scope.pagination1._id = urlid1;
                        NavigationService.sideMenu1($scope.api1, $scope.pagination1, function (data) {
                            if (data.data.nominee) {
                                $scope.json.tableData = data.data;
                                console.log("IF");
                                console.log($scope.json.tableData);
                            }
                        }, function () {
                            console.log("fail");
                        });
                    } else {
                        console.log("ELSE");
                        $scope.pagination._id = urlid1;
                        NavigationService.sideMenu1($scope.api1, $scope.pagination, function (data) {
                            $scope.json.tableData = data.data.data;
                            console.log($scope.json.tableData);
                        }, function () {
                            console.log("fail");
                        });
                    }
                }

                $scope.filterSearch = false;
                $scope.search = '';
                $scope.searchClick = function (search) {
                    console.log("search", search);
                    $scope.filterSearch = true;
                    $scope.search = search;
                    console.log($scope.search);
                    search = $scope.search;
                    $scope.getMoreResults(undefined, $scope.search);
                };
                $scope.search = '';
                // call api for view data
                $scope.apiName = $scope.json.apiCall.url;
                $scope.pageInfo = {};
                $scope.getMoreResults = function (value, search) {
                    $scope.search = search;
                    $scope.value = value;
                    if (value) {
                        console.log($scope.search);
                        if ($scope.search === undefined) {
                            $scope.search = " ";
                            // $scope.search = $stateParams.search;
                            console.log($scope.search);
                        }
                        console.log("******page", $scope.pagination, $stateParams.jsonName);

                        $state.go("page", {
                            no: $scope.pagination.pagenumber,
                            jsonName: $stateParams.jsonName,
                            search: $scope.search
                        });
                    } else {

                        if ($scope.filterSearch == true) {
                            console.log("search!!!!", $scope.search);
                            $scope.pagination.status = $scope.search.orderStat;
                            $scope.pagination.coupon = $scope.search.couponCode;
                            $scope.pagination.subcategory = $scope.search.occasionType;
                            $scope.pagination.designer = $scope.search.designers;
                            $scope.pagination.rentalDate = $scope.search.rentalDate;
                            $scope.pagination.price = $scope.search.price;
                            if ($scope.search.search) {

                                $scope.pagination.search = $scope.search.search;
                            } else {
                                $scope.pagination.search = "";
                            }
                        } else if ($scope.search) {
                            $scope.pagination.search = $scope.search;
                        } else if ($scope.pagination.search) {
                            $scope.pagination.search = $scope.pagination.search;
                        } else {
                            $scope.pagination.search = '';
                        }
                        if (!$scope.pagination.rentalDate) {
                            $scope.pagination.rentalDate = ""
                        }
                        if (!$scope.pagination.status) {
                            $scope.pagination.status = $scope.searchPop.orderStat;
                            $scope.pagination.coupon = $scope.searchPop.couponCode;
                            $scope.pagination.subcategory = $scope.searchPop.occasionType;
                            $scope.pagination.designer = $scope.searchPop.designers;
                        }

                        console.log($scope.apiName);
                        console.log("$scope.pagination", $scope.pagination);
                        NavigationService.findProjects($scope.apiName, $scope.pagination, function (findData) {
                            console.log(findData);
                            if (findData.value !== false) {
                                if (findData.data && findData.data.data && findData.data.data.length > 0) {
                                    $scope.pageInfo.lastpage = findData.data.totalpages;
                                    $scope.pageInfo.pagenumber = findData.data.pagenumber;
                                    $scope.pageInfo.totalitems = $scope.pagination.pagesize * findData.data.totalpages;
                                    $scope.json.tableData = findData.data.data;
                                    $mdDialog.hide();
                                } else {
                                    $scope.json.tableData = [];
                                    $scope.pageInfo.totalitems = 0;
                                }
                            } else {
                                $scope.json.tableData = [];
                                $scope.pageInfo.totalitems = 0;
                            }
                            console.log($scope.pagination);
                        }, function () {
                            console.log("Fail");
                        });
                    }
                }
                $scope.getMoreResults();

            } else if (data.pageType == "create") {
                $scope.goToCancelPageCreate = function () {
                    $location.url("/page/" + $scope.json.action[1].url + idForCreate);
                };
                //  console.log("**********page create***********", $scope.json.jsonPage);
                _.each($scope.json.fields, function (n) {
                    if (n.type == "select") {
                        n.model = "";
                        n.url.unshift({
                            "value": "",
                            "name": "SELECT"
                        });
                        if (n.name == "Status") {
                            n.model = true;
                        }
                    } else if (n.type == "selectFromTable") {
                        n.model = "";
                    }

                    if (n.type == "date") {
                        if ($scope.json.jsonPage == 'viewProducttime') {
                            //  console.log("********* field type date ***********", n);
                            $scope.today = new Date().toISOString().split('T')[0];
                        }
                    }

                });

                // get select fields dropdown
                _.each($scope.json.fields, function (n) {
                    if (n.type == "selectFromTable") {
                        NavigationService.getDropDown(n.url, function (data) {
                            console.log(data);
                            n.dropdownvalues = [];
                            if (data) {
                                for (var i = 0; i < data.data.length; i++) {
                                    var dropdown = {};
                                    dropdown._id = data.data[i]._id;
                                    if (!n.dropDownName) {
                                        dropdown.name = data.data[i].name;
                                    } else {
                                        dropdown.name = data.data[i][n.dropDownName];
                                    }
                                    n.dropdownvalues.push(dropdown);
                                }
                            }
                        }, function () {
                            console.log("Fail");
                        });
                    }
                });
            } else if (data.pageType == "edit" || data.pageType == "tableview") {
                var urlid1 = $location.absUrl().split('%C2%A2')[1];
                var urlid2 = $location.absUrl().split('%C2%A2')[2];
                console.log(urlParams);
                NavigationService.findOneProject($scope.json.preApi.url, urlParams, function (data) {
                    console.log(data);
                    $scope.json.editData = data.data;
                    console.log($scope.json.editData);
                    _.each($scope.json.fields, function (n) {
                        if (n.type == "table") {
                            $scope.subTableData = $scope.json.editData[n.model];
                        }
                        if (n.type == "time" || n.type == "date") {
                            $scope.json.editData[n.model] = new Date($scope.json.editData[n.model]);
                        }

                    })
                }, function () {
                    console.log("Fail");
                });

                // get select fields dropdown
                _.each($scope.json.fields, function (n) {
                    if (n.type == "selectFromTable") {
                        NavigationService.getDropDown(n.url, function (data) {
                            console.log(data);
                            n.dropdownvalues = [];
                            if (data) {
                                for (var i = 0; i < data.data.length; i++) {
                                    var dropdown = {};
                                    dropdown._id = data.data[i]._id;
                                    if (!n.dropDownName) {
                                        dropdown.name = _.cloneDeep(data.data[i].name);
                                        // dropdown.name = data.data[i].name;
                                    } else {
                                        // dropdown.name =data.data[i][n.dropDownName];
                                        dropdown.name = _.cloneDeep(data.data[i][n.dropDownName]);
                                    }
                                    n.dropdownvalues.push(dropdown);
                                }
                            }
                        }, function () {
                            console.log("Fail");
                        });
                    }
                });
            } else if (data.pageType == "view") {
                // call api for view data
                $scope.apiName = $scope.json.apiCall.url;
                $scope.pagination = {
                    "search": "",
                    "pagenumber": 1,
                    "pagesize": 10
                };

                // SIDE MENU DATA
                var urlid1 = $location.absUrl().split('%C2%A2')[1];
                console.log(urlid1);
                // var urlid2 = $location.absUrl().split('%C2%A2')[2];
                $scope.pagination1 = {};
                if (urlid1) {
                    console.log('urlid1', urlid1);
                    if ($scope.json.sendIdWithCreate) {
                        $scope.json.createButtonState = $scope.json.createButtonState.split("'" + "})").join("¢" + urlid1 + "'" + "})");
                        // $scope.json.createButtonState = $scope.json.createButtonState.split("%25C2%").join("%C2%");
                        // $scope.json.createButtonState = $scope.json.createButtonState.split("%25A2").join("%A2");
                    }
                    console.log($scope.json.createButtonState);
                    $scope.api1 = $scope.json.sidemenu[1].callFindOne;
                    if ($scope.json.sidemenu[1].sendParam && $scope.json.sidemenu[1].sendParam !== '') {
                        // ARRAY
                        // $scope.pagination1._id = urlid1;
                        $scope.pagination1._id = urlid1;
                        NavigationService.sideMenu1($scope.api1, $scope.pagination1, function (data) {
                            if (data.data.nominee) {
                                $scope.json.tableData = data.data;
                                console.log("IF");
                                console.log($scope.json.tableData);
                            }
                        }, function () {
                            console.log("fail");
                        });
                    } else {
                        console.log("ELSE");
                        $scope.pagination._id = urlid1;
                        NavigationService.sideMenu1($scope.api1, $scope.pagination, function (data) {
                            $scope.json.tableData = data.data.data;
                            console.log($scope.json.tableData);
                        }, function () {
                            console.log("fail");
                        });
                    }
                }
                // call api for view data
                $scope.apiName = $scope.json.apiCall.url;
                $scope.pageInfo = {};
                $scope.getMoreResults = function () {
                    NavigationService.findProjects($scope.apiName, $scope.pagination, function (findData) {
                        console.log(findData);
                        if (findData.value != false) {
                            if (findData.data && findData.data.data && findData.data.data.length > 0) {
                                $scope.pageInfo.lastpage = findData.data.totalpages;
                                $scope.pageInfo.pagenumber = findData.data.pagenumber;
                                $scope.pageInfo.totalitems = $scope.pagination.pagesize * findData.data.totalpages;
                                $scope.json.tableData = findData.data.data;
                                console.log("new log ", $scope.json.tableData);

                            } else {
                                //   $scope.json.tableData = [];
                            }
                        } else {
                            // $scope.json.tableData = [];
                        }
                    }, function () {
                        console.log("Fail");
                    });

                };
                $scope.getMoreResults();
            }
            $scope.template = TemplateService.jsonType(data.pageType);
        });

        // ACTION
        $scope.performAction = function (action, result) {
            console.log(action, result);
            console.log("in pa");
            var pageURL = "";
            if (action.type == "onlyView") {
                console.log("onlyView");
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        pageURL += $filter("getValue")(result, n);
                    });
                }
                console.log(pageURL);
                $state.go("onlyview", {
                    id: pageURL
                });
            }

            //excel export
            if (action.action == 'excel') {
                var apiname = action.api;
                console.log("apiii", apiname);

                window.open(adminURL + apiname, '_blank');
                window.close();
            }


            //excel export
            if (action.action == 'importexcel') {
                var apiname = action.api;
                console.log("apiii", apiname);

                window.open(adminURL + apiname, '_blank');
                window.close();
            }

            // FOR EDIT
            if (action.action == 'redirect') {
                console.log("redirect");
                pageURL = action.jsonPage;
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        pageURL += "¢" + $filter("getValue")(result, n);
                    });
                }
                $state.go("page", {
                    jsonName: pageURL
                });
            } else if (action.action == 'apiCallConfirm') {
                pageURL = adminurl + action.api;
                var data = {};
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        data[n.name] = $filter("getValue")(result, n.value);
                    });
                }
                $scope.confirm(action.title, action.content, pageURL, data);
            } else if (action.action == 'sidemenuRedirect') {
                pageURL = action.jsonPage;
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        pageURL += "¢" + jsonArr[n];
                    });
                }
                $state.go("page", {
                    jsonName: pageURL
                });
            } else if (action.action === 'changeActive') {
                $scope.defaultActive = action.active;
            }
        };


        $scope.makeReadyForApi = function () {
            console.log("Make Ready");
            console.log($scope.formData);

            var data = {};
            if ($scope.json.pageType !== 'edit' && $scope.json.pageType !== 'tableview') {
                // CONVERT MODEL NAMES SAME AS FIELD NAMES
                _.each($scope.json.fields, function (n) {
                    console.log(n);
                    data[n.tableRef] = n.model;
                });
                $scope.formData = data;
                if (jsonArr[1]) {
                    $scope.formData[$scope.json.urlFields[0]] = jsonArr[1];
                }
            } else {
                $scope.formData = $scope.json.editData;
                console.log($scope.formData);
            }

            $scope.apiName = $scope.json.apiCall.url;

            console.log($scope.formData);

            // CALL GENERAL API
            NavigationService.saveApi($scope.formData, $scope.apiName, function (data) {
                console.log($scope.json.jsonPage);
                window.history.back();
                // showToast("Project Saved Successfully");
                // console.log("Success");
                // if ($scope.json.action[0].submitUrl && $scope.urlid && !$scope.urlid2) {
                //     $location.url("/page/" + $scope.json.action[0].submitUrl + $scope.urlid);

                // } else if ($scope.json.action[0].submitUrl && $scope.urlid2) {
                //     $location.url("/page/" + $scope.json.action[0].submitUrl + $scope.urlid2);
                // } else {
                //     $state.go("page", {
                //         jsonName: $scope.json.jsonPage
                //     });
                // }

            }, function () {
                // showToast("Error saving the Project");
                console.log("Fail");
            });


        };

        $scope.changeit = function (image) {
            console.log(image);
        };

    })

    .controller('ProjectsCtrl', function ($scope, $mdDialog, $mdToast, TemplateService, NavigationService, $timeout, clipboard) {

        $scope.isSearch = true;
        $scope.searchForm = {
            name: ""
        };
        $scope.mockURL = mockURL;

        $scope.makeSearch = function (val) {
            $scope.searchForm.name = val;
        };

        function showToast(text) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(text)
                .position("bottom left")
                .hideDelay(3000)
            );
        }

        //Used to name the .html file
        $scope.template = TemplateService.changecontent("projects");
        $scope.menutitle = NavigationService.makeactive("Projects");


        $scope.copyMockUrl = function (project) {
            clipboard.copyText(mockURL + project.alias);
        };
        $scope.copyLiveUrl = function (project) {
            clipboard.copyText(project.url);
        };

        function successCallback(data, status) {
            if (status == 200) {
                $scope.projects = data.data;
                if (_.isEmpty(data.data)) {
                    $scope.createProject();
                }
            } else {
                errorCallback(status);
            }
        }

        $scope.saveProject = function (project) {
            NavigationService.saveProject(project, function (data) {
                project._id = data.data._id;
                showToast("Project Saved Successfully");
            }, function () {
                showToast("Error saving the Project");
            });
        };
        $scope.deleteProject = function (project) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your Project?')
                .textContent('The data for the Project will also be deleted')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                NavigationService.deleteProject(project, function (data) {
                    _.remove($scope.projects, function (n) {
                        return n._id == project._id;
                    });
                    showToast("Project Deleted Successfully");
                }, function () {
                    showToast("Error Deleting Project");
                });

            }, function () {

            });

        };

        $scope.expandProject = function (project) {
            if (!project.expand) {
                _.each($scope.projects, function (n) {
                    n.expand = false;
                });
            }
            project.expand = !project.expand;
        };

        function errorCallback(err) {}

        $scope.createProject = function () {
            $scope.projects.push({
                expand: true,
                name: "",
                alias: "",
                url: ""
            });
        };
        $scope.hide = 'hideme';
        NavigationService.findProjects({}, successCallback, errorCallback);
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })

    .controller('APICtrl', function ($scope, $mdDialog, $mdToast, TemplateService, NavigationService, $timeout, $stateParams) {

    })

    .controller('onlyViewPageCtrl', function ($scope, TemplateService, NavigationService, $stateParams, $http) {
        $scope.template = TemplateService.changecontent("onlyView");
        $scope.menutitle = NavigationService.makeactive("Users");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        console.log($stateParams.id);
        $http.get("./pageJson/onlyView.json").success(function (data) {
            console.log(data);
            $scope.json = data;
            urlParams = {
                "_id": $stateParams.id
            };
            NavigationService.findOneProject($scope.json.preApi.url, urlParams, function (data) {

                $scope.json.editData = data.data;
                console.log($scope.json.editData);
                $scope.armyName = $scope.json.editData.user.armyName;
                console.log($scope.armyName);
            }, function () {
                console.log("Fail");
            });
        });
        // $scope.viewEditPage = function(pageName) {
        //     console.log("jhi");
        // };
    })

    .controller('HeaderCtrl', function ($scope, TemplateService, NavigationService, $state) {
        console.log($state.current.url);
        $scope.template = TemplateService;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        if ($.jStorage.get("user") === null) {
            $state.go("login");
        }
        $scope.logOut = function () {
            NavigationService.logout(function (data) {
                console.log(data);
                if (data.value === true) {
                    $.jStorage.flush();
                    $state.go("login");

                } else if (data.value === false) {
                    $window.location.reload();
                }
            }, function () {
                console.log("Fail");
            });
        };
    })

    .controller('ViewDesingerReportCtrl', function ($scope, TemplateService, $mdToast, NavigationService, $state) {

        $scope.template = TemplateService.changecontent("viewDesingerReport");
        $scope.menutitle = NavigationService.makeactive("Designer Report");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.searchdata = {};
        $scope.designerArray = [];
        $scope.totalRentalAmount = null;
        $scope.isText = false;

        function showToast(text) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(text)
                .position("bottom left")
                .hideDelay(3000)
            );
        }

        $scope.getDesignerDetails = function (value) {
            var reqObj = {};
            $scope.productArray = [];
            if (value.searchText != "" && value.searchText != undefined) {
                if (value != undefined) {
                    reqObj.startDate = value.startDate;
                    reqObj.endDate = value.endDate;
                }

                //  reqObj.designer = "5800a8367b8b5e154ba44d7c";
                reqObj.designer = value.designer;
                reqObj.designerName = value.searchText;
                NavigationService.getDesignerOrderDetail(reqObj, function (data) {
                    console.log("getDesignerOrderDetail", data.data);
                    //$scope.productArray = data.data.salesDetails;
                    $scope.totalRentalAmount = data.data.totalRentalAmount;
                    _.each(data.data.salesDetails, function (n) {
                        _.each(n.cartproduct, function (m) {
                            var product = {};
                            product.orderId = n.orderid;
                            product.name = m.product.name;
                            product.price = m.product.price;
                            product.fourdayrentalamount = m.product.fourdayrentalamount;
                            product.eightdayrentalamount = m.product.eightdayrentalamount;
                            product.RentalDate = m.RentalDate;
                            product.totalRentalAmount = n.totalRentalAmount;
                            $scope.productArray.push(product);
                        });
                    });

                    console.log("$scope.productArray", $scope.productArray);
                });
            } else {
                showToast("Please select designer");
            }

        };

        $scope.getDesingerName = function (searchdata) {
            $scope.isText = true;
            NavigationService.getMyDesigner(searchdata, function (data) {
                if (data.value) {
                    $scope.designerArray = data.data;
                } else {

                }
            });
        };

        //To select designer
        $scope.selectDesigner = function (value) {
            $scope.searchdata.searchText = $scope.designerArray[value].name;
            $scope.searchdata.designer = $scope.designerArray[value]._id;
            $scope.isText = false;
            console.log("$scope.searchdata", $scope.searchdata);
        };

        $scope.generateExcel = function (data) {
            //  alert("hiiii");
            if (data) {
                console.log("data", data);
                //  var data = "5800a8367b8b5e154ba44d7c";
                // NavigationService.exportOrderByDesigner(data, function (data) {
                //     // window.close();
                //     console.log("doneeee");
                // });

                window.open(adminURL + 'order/getDesignerOrderDetailExcel?designer=' + data, '_blank');
                window.close();
            } else {
                //  console.log("else");
                //  window.open(adminURL + 'order/generateExcel', '_blank');
                //  window.close();
                showToast("Please select designer");
            }
        }
    })

;