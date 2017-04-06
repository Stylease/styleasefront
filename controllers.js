// var adminURL = "http://localhost:81/";
var adminURL = "http://130.211.245.224:81/";
// window.uploadurl = "http://192.168.1.122:81/" + "upload/";
var mockURL = adminURL + "callApi/";

angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngSanitize', 'ngMaterial', 'ngMdIcons', 'ui.sortable', 'angular-clipboard', 'imageupload', 'ngDialog', 'ui.bootstrap'])

    .controller('DashboardCtrl', function ($scope, $rootScope, TemplateService, NavigationService, $timeout, $state, ngDialog, $uibModal) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("dashboard");
        $scope.menutitle = NavigationService.makeactive("Dashboard");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.AllStates = "";
        $scope.AllPABs = "";
        $scope.AllComponents = "";
        $scope.AllInstitutes = "";
        $scope.selectedPab = "";
        $scope.selectedState = "";
        $scope.AllComponents = "";
        $scope.AllInstitutes = "";
        $scope.filteredComponents = {};
        $scope.filteredComponentsNew = {};
        $scope.getNewComponents = {};
        $scope.totalUtilizedPercentage = 0;
        $rootScope.getProjectIndex = "";
        $scope.count = 0;
        var dropDownData = {
            pab: "",
            state: "",
            keyComponent: "",
            institute: ""
        };
        $scope.DashboardAllData = {};
        $rootScope.emptyData = true;
        $rootScope.vendorTable = false;
        $rootScope.photoTable = false;
        $rootScope.tempIndex = "";
        $rootScope.projectPhotos = "";

        $rootScope.serverBaseUrl = " https://rusa.thegraylab.com/api/upload/readFile?file=";
        // https://rusa.thegraylab.com/api/upload/readFile?file=58db53e51fdc1d1a58973d82.jpg

        function loadData(dropDownData) {
            // console.log("inside loadData");

            NavigationService.boxCall("Project/getProjectReport", dropDownData, function (data) {
                $scope.filteredComponents = data.data;

                NavigationService.boxCall("Transaction/getTransactionReport", dropDownData, function (data) {
                    $scope.filteredComponentsNew = data.data;

                    console.log("Dashboadr Data 1st API, filteredComponents", $scope.filteredComponents);
                    console.log("Dashboadr Data 2nd API,  filteredComponentsNew", $scope.filteredComponentsNew);

                    $scope.DashboardAllData = angular.extend({}, $scope.filteredComponents, $scope.filteredComponentsNew);
                    console.log("after extending 1st & 2nd APIs.  DashboardAllData --> filteredComponents + filteredComponentsNew", $scope.DashboardAllData);

                    // console.log("filteredComponentsNew", $scope.filteredComponentsNew);
                    $scope.centerReleasePerComp = $scope.DashboardAllData.centerReleasePerComponent;
                    $scope.stateReleasePerComp = $scope.DashboardAllData.stateReleasePerComponent;
                    $scope.delayedProPerComp = $scope.DashboardAllData.totalDelayedProjectsPerComponent;
                    $scope.transactionPerComp = $scope.DashboardAllData.transactionsPerComponents;

                    // to get totalDelayedProjectsPerComponent in institute array 
                    angular.forEach($scope.DashboardAllData.institute, function (inst, index) {
                        if ($scope.delayedProPerComp != 0) {
                            //when we get 0 records from Db we canno't make any operation 

                            angular.forEach($scope.DashboardAllData.totalDelayedProjectsPerComponent, function (tdppc, index) {
                                if (inst._id.componentId == tdppc._id.componentId) {
                                    inst.totalDelayedProjectsPerComponent = tdppc.totalDelayedProjectsPerComponent;
                                } else {
                                    if (inst.totalDelayedProjectsPerComponent != null) {
                                        // console.log("test");
                                    } else {
                                        // if it is null then make it 0 to display on table 
                                        inst.totalDelayedProjectsPerComponent = 0;
                                    }
                                }
                            });
                        } else {
                            // Don't compare it with 1st object put direct 0 in institute
                            inst.totalDelayedProjectsPerComponent = null;
                            inst.totalDelayedProjectsPerComponent = 0;
                        }
                    });

                    // to get centerReleasePerComponent in institute array 
                    angular.forEach($scope.DashboardAllData.institute, function (inst, index) {

                        if ($scope.centerReleasePerComp != 0) {
                            angular.forEach($scope.DashboardAllData.centerReleasePerComponent, function (crpc, index) {
                                if (inst._id.componentId == crpc._id.componentId) {
                                    inst.centerReleasePerComponent = crpc.centerComponentRelease;
                                } else {
                                    if (inst.centerReleasePerComponent != null) {
                                        // console.log("test");
                                    } else {
                                        inst.centerReleasePerComponent = 0;
                                    }
                                }
                            });
                        } else {
                            inst.centerReleasePerComponent = null;
                            inst.centerReleasePerComponent = 0;
                        }
                    });

                    // to get stateReleasePerComponent in institute array 
                    angular.forEach($scope.DashboardAllData.institute, function (inst, index) {
                        if ($scope.stateReleasePerComp != 0) {
                            angular.forEach($scope.DashboardAllData.stateReleasePerComponent, function (srpc, index) {
                                if (inst._id.componentId == srpc._id.componentId) {
                                    inst.stateReleasePerComponent = srpc.stateComponentRelease;
                                } else {
                                    if (inst.stateReleasePerComponent != null) {
                                        // console.log("test");
                                    } else {
                                        inst.stateReleasePerComponent = 0;
                                    }
                                }
                            });
                        } else {
                            inst.stateReleasePerComponent = null;
                            inst.stateReleasePerComponent = 0;
                        }
                    });

                    // to get transactionsPerComponents in institute array 
                    angular.forEach($scope.DashboardAllData.institute, function (inst, index) {
                        if ($scope.transactionPerComp != 0) {
                            angular.forEach($scope.DashboardAllData.transactionsPerComponents, function (tpc, index) {
                                if (inst._id.componentId == tpc._id.componentId) {
                                    inst.amountUtilizedPerComponent = tpc._id.amountUtilizedPerComponent;
                                    // inst.amountUtilizedPercentagePerComponent = tpc._id.amountUtilizedPercentagePerComponent;
                                    // console.log("totalComponentRelease", tpc.totalComponentRelease);
                                    inst.amountUtilizedPercentagePerComponent = (tpc._id.amountUtilizedPerComponent * 100) / tpc.totalComponentRelease;
                                    // console.log("count", $scope.count);
                                } else {
                                    if (inst.amountUtilizedPerComponent != null && inst.amountUtilizedPercentagePerComponent != null) {
                                        // console.log("test");
                                    } else {
                                        inst.amountUtilizedPerComponent = 0;
                                        inst.amountUtilizedPercentagePerComponent = 0;
                                        // console.log("count inside", $scope.count);
                                    }
                                }
                            });
                        } else {
                            inst.amountUtilizedPerComponent = null;
                            inst.amountUtilizedPercentagePerComponent = null;
                            inst.amountUtilizedPerComponent = 0;
                            inst.amountUtilizedPercentagePerComponent = 0;
                        }

                    });

                    console.log("after merge 1st & 2nd APIs.  DashboardAllData --> filteredComponents + filteredComponentsNew", $scope.DashboardAllData);

                    // when component is not available in project & transaction table 
                    NavigationService.boxCall("Project/getComponentsNotAvailInProject", dropDownData, function (data) {
                        $scope.getNewComponents = data.data;

                        console.log("Dashboadr Data 3rd API, getComponentsNotAvailInProject", $scope.getNewComponents);

                        $scope.totCompFundAllo = 0;
                        $scope.totCenterAllocation = 0;
                        $scope.newCompLength = $scope.getNewComponents.length;
                        $scope.temp = 0;


                        angular.forEach($scope.getNewComponents, function (getNewComp, index) {

                            getNewComp.amountUtilizedPerComponent = 0;
                            getNewComp.amountUtilizedPercentagePerComponent = 0;
                            getNewComp.centerReleasePerComponent = 0;
                            getNewComp.stateReleasePerComponent = 0;
                            getNewComp.totalComponentProjects = 0;
                            getNewComp.totalDelayedProjectsPerComponent = 0;

                            $scope.totCompFundAllo = $scope.totCompFundAllo + getNewComp.totalComponentAllocation;
                            // $scope.totCenterAllocation = $scope.totCenterAllocation + ($scope.totCompFundAllo * getNewComp._id.centerShare / 100);

                            $scope.totCenterAllocation = $scope.totCenterAllocation + (getNewComp.totalComponentAllocation * getNewComp._id.centerShare / 100);

                            // it may give push eror in case of no data found 
                            // we have to send [] in callback instead of "NO data founds"

                            $scope.DashboardAllData.institute.push(getNewComp);

                            if ($scope.newCompLength - 1 == $scope.temp) {


                                console.log("-----------------------------------------------------------------");
                                console.log("$scope.newCompLength", $scope.newCompLength);
                                console.log("-----------------------------------------------------------------");

                                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation %%%%%%%%%%%%%%%%%%%%%%%%%%%%%", $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation);

                                console.log("-----------------------------------------------------------------");
                                console.log("$scope.totCompFundAllocation", $scope.totCompFundAllo);
                                console.log("-----------------------------------------------------------------");

                                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare %%%%%%%%%%%%%%%%%%%%%%%%%%%%%", $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare);

                                console.log("-----------------------------------------------------------------");
                                console.log("$scope.totCenterAllocation", $scope.totCenterAllocation);
                                console.log("-----------------------------------------------------------------");

                                $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation = $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation + $scope.totCompFundAllo;

                                $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare = $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare + $scope.totCenterAllocation;

                                $scope.DashboardAllData.totalCenterAndStateAllocation.stateShare = $scope.DashboardAllData.totalCenterAndStateAllocation.stateShare + ($scope.totCompFundAllo - $scope.totCenterAllocation);

                                $scope.DashboardAllData.totalComponents.count = $scope.DashboardAllData.totalComponents.count + $scope.getNewComponents.length;

                                $scope.DashboardAllData.inTimeComponents.inTimeComponentsCount = $scope.getNewComponents.length;

                                // $scope.DashboardAllData.totalReleaseAndUtilization.totalFundRelease1 = 0;
                                // $scope.DashboardAllData.totalCenterRelease.totalCenterRelease = 0;
                                // $scope.DashboardAllData.totalReleaseAndUtilization.totalfundUtizedPercent1 = 0;
                                // $scope.DashboardAllData.totalReleaseAndUtilization.totalUtilization1 = 0;

                                console.log("DashboardAllData after updating allocation", $scope.DashboardAllData);
                                console.log("$scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation", $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation);

                                console.log("$scope.DashboardAllData.totalCenterAndStateAllocation.centerShare", $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare);

                                console.log("$scope.DashboardAllData.totalCenterAndStateAllocation.stateShare", $scope.DashboardAllData.totalCenterAndStateAllocation.stateShare);

                                console.log("after merge  DashboardAllData with --> 3rd API getComponentsNotAvailInProject", $scope.DashboardAllData);
                            }

                            $scope.temp++;
                            // $scope.totCompFundAllo = 0;

                        });
                    });

                    console.log("DashboardAllData after updating allocation", $scope.DashboardAllData);
                    console.log("hiiii $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation", $scope.DashboardAllData.totalComponentsFundAllocation.totalFundAllocation);

                    console.log("hiiii $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare", $scope.DashboardAllData.totalCenterAndStateAllocation.centerShare);

                    console.log("hiiii $scope.DashboardAllData.totalCenterAndStateAllocation.stateShare", $scope.DashboardAllData.totalCenterAndStateAllocation.stateShare);

                    console.log("hiiii after merge  DashboardAllData with --> 3rd API getComponentsNotAvailInProject", $scope.DashboardAllData);
                    // console.log("*************** after done with all the things DashboardAllData is **********************", $scope.DashboardAllData);
                });
            });
        }
        loadData(dropDownData);

        $scope.getAllDashboardData = function (item) {
            console.log("filter selected item", item);
            var id = angular.element(event.target).data('id');
            // console.log(id);

            if (id == "pab") {
                dropDownData.pab = item._id;

            } else if (id == "state") {
                dropDownData.state = item._id;
                // loadData(dropDownData);

                NavigationService.boxCall("Institute/findAllInstituteDashBoard", dropDownData, function (data) {
                    $scope.AllInstitutes = data.data;
                    $scope.generateField = true;
                });

            } else if (id == "component") {
                dropDownData.keyComponent = item._id;
                // loadData(dropDownData);
            } else if (id == "institute") {
                dropDownData.institute = item._id;
                // loadData(dropDownData);
            }

            loadData(dropDownData);
        };

        $scope.resetFilters = function () {
            console.log("Hey there ");
            dropDownData.pab = "";
            dropDownData.state = "";
            dropDownData.keyComponent = "";
            dropDownData.institute = "";
            loadData(dropDownData);
            $scope.AllStates = "";
            $scope.AllPABs = "";
            $scope.AllComponents = "";
            $scope.AllInstitutes = "";
            NavigationService.callApi("Pab/findAllPab", function (data) {
                $scope.AllPABs = data.data;
                $scope.generateField = true;
            });

            NavigationService.callApi("State/findAllState", function (data) {
                $scope.AllStates = data.data;
                $scope.generateField = true;
            });

            NavigationService.callApi("Institute/findAllInstituteDashBoard", function (data) {
                $scope.AllInstitutes = data.data;
                $scope.generateField = true;
            });

            NavigationService.callApi("KeyComponents/findAllKeyComponents", function (data) {
                $scope.AllComponents = data.data;
                $scope.generateField = true;
                // console.log("AllComponents", $scope.AllComponents);
            });

            // $route.reload();
            // $state.reload();
        };

        // $scope.getKeyCompName = function (data) {

        //   var keyCompId = {};
        //   keyCompId._id = data;

        //   NavigationService.boxCall("KeyComponents/findOne", keyCompId, function (data) {
        //     $scope.getKeyCompName = data.data.name;
        //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! here is $scope.getKeyCompName !!!!!!!!!!!!!!!!!!!!!!!!!!!!!", $scope.getKeyCompName);
        //     return $scope.getKeyCompName;
        //   });

        // }

        NavigationService.callApi("Pab/findAllPab", function (data) {
            $scope.AllPABs = data.data;
            $scope.generateField = true;
        });

        NavigationService.callApi("State/findAllState", function (data) {
            $scope.AllStates = data.data;
            $scope.generateField = true;
        });

        NavigationService.callApi("Institute/findAllInstituteDashBoard", function (data) {
            $scope.AllInstitutes = data.data;
            $scope.generateField = true;
        });

        NavigationService.callApi("KeyComponents/findAllKeyComponents", function (data) {
            $scope.AllComponents = data.data;
            $scope.generateField = true;
            // console.log("AllComponents", $scope.AllComponents);
        });

        $scope.getOneComponentDetails = function (object) {

            console.log("--------------------------------------------------------------------------------------------");
            console.log("getOneComponentDetails object", object);
            console.log("--------------------------------------------------------------------------------------------");

            if (object.totalComponentProjects != 0) {
                $rootScope.emptyData = false;
                $scope.getAllprojectOfComponent = [];
                // $scope.projectInProExpense = {};
                $scope.projectNotInProExpense = {};
                $scope.compObject = {};
                $scope.compObject.component = object._id.componentId;


                //get filterd dashboard data after selecting a component 
                // dropDownData.keyComponent = object._id.keyComponent;
                dropDownData.component = object._id.componentId;
                console.log("--------------------------------------------------------------------------------------------");
                console.log("dropDownData.component", dropDownData.component);
                console.log("--------------------------------------------------------------------------------------------");
                loadData(dropDownData);

                NavigationService.boxCall("ProjectExpense/componentProjects", $scope.compObject, function (data) {
                    $scope.getAllprojectOfComponent = data.data;
                    console.log("getAllprojectOfComponent 1st api call: ", $scope.getAllprojectOfComponent);
                });

                NavigationService.boxCall("ProjectExpense/getProjectsNotAvailInProjectExpense", $scope.compObject, function (data) {
                    $scope.projectNotInProExpense = data.data;
                    console.log("projectNotInProExpense 2nd api call: ", $scope.projectNotInProExpense);

                    angular.forEach($scope.projectNotInProExpense, function (getNewPro, index) {
                        getNewPro.totalAmountReleased = 0;
                        getNewPro.vendor = [];
                        $scope.getAllprojectOfComponent.push(getNewPro);
                    });

                    console.log("getAllprojectOfComponent final merged data: ", $scope.getAllprojectOfComponent);
                });

                // $scope.getAllprojectOfComponent = $scope.projectInProExpense + $scope.projectNotInProExpense;
                // console.log("I got my selected object:", object._id.componentId);
            }
        };

        $scope.getOneProjectDetails = function (object, event, index) {
            // console.log("---------------");
            // console.log("inside getOneProjectTransactions object is:", object);
            // console.log("inside getOneProjectTransactions index", index);
            // console.log("---------------");

            $rootScope.getProjectIndex = index;

            var getTable = angular.element(event.target).data('id');
            // console.log("---------------");
            // console.log("getTable is --> getTable", getTable);
            // console.log("---------------");

            if (getTable == "vendorTable") {
                console.log("---------------");
                console.log("inside if--> vendorTable");
                console.log("---------------");
                $rootScope.photoTable = false;
                $rootScope.vendorTable = true;
            } else if (getTable == "photoTable") {

                $rootScope.projectPhotos = object.projectPhotos;

                console.log("---------------");
                console.log("inside if--> photoTable & photos are ", $rootScope.projectPhotos);
                console.log("---------------");

                $rootScope.vendorTable = false;
                $rootScope.photoTable = true;
            }

        };

        $scope.nextImage = function () {

            if ($rootScope.tempIndex < $rootScope.projectPhotos.length - 1) {
                $rootScope.tempIndex++;
                $scope.getProjectImages(null, $rootScope.tempIndex);
            }

        };

        $scope.prevImage = function () {

            if ($rootScope.tempIndex != 0) {
                $rootScope.tempIndex--;
                $scope.getProjectImages(null, $rootScope.tempIndex);
            }
        };

        // to get all project imgaes 
        $scope.getProjectImages = function (object, index) {

            $rootScope.tempIndex = index;
            console.log("$rootScope.tempIndex", $rootScope.tempIndex);
            console.log(" $rootScope.projectPhotos", $rootScope.projectPhotos);
            $scope.projectPhoto = $rootScope.projectPhotos[index].photo;

            $scope.ImagePath = $rootScope.serverBaseUrl + $scope.projectPhoto;

            console.log("---------------");
            console.log("ImagePath", $scope.ImagePath);
            console.log("---------------");

            console.log("---------------");
            console.log("projectPhoto", $scope.projectPhoto);
            console.log("---------------");
            // $scope.projectPhoto = object.photo;
            // $scope.projectPhoto = "http://www.planwallpaper.com/static/images/4-Nature-Wallpapers-2014-1_cDEviqY.jpg";
            // console.log("******************************* I am inside getProjectImages ********************************************");
            // console.log("******************************* object ********************************************", object);
            // console.log("-----------------------------------------------------------------------------------------------");
            // console.log("******************************* index ********************************************", $scope.projectPhoto);
            // console.log("-----------------------------------------------------------------------------------------------");

            // ngDialog.open({ template: 'myProjectImage' });

            $uibModal.open({
                animation: true,
                templateUrl: "../backend/views/modal/project-image.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'md'
            });

        };

        // to get all project expense Image
        $scope.projectExpenseImage = function (object) {

            // $scope.projectPhoto = object.photo;
            $scope.projectExpenseOneImage = "http://www.planwallpaper.com/static/images/4-Nature-Wallpapers-2014-1_cDEviqY.jpg";
            console.log("******************************* I am inside projectExpenseImage ********************************************");
            console.log("******************************* object ********************************************", object);
            console.log("-----------------------------------------------------------------------------------------------");

            // ngDialog.open({ template: 'myProjectImage' });

            $uibModal.open({
                animation: true,
                templateUrl: "../backend/views/modal/projectExpensePhoto.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'md'
            });
        };

    })
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


    .controller('jsonViewCtrl', function ($scope, $element, TemplateService, NavigationService, $timeout, $stateParams, $http, $state, $filter, $mdDialog, $location) {
        //Used to name the .html file
        $scope.back = function () {
            window.history.back();
        };
        $scope.template = TemplateService.changecontent("users");
        $scope.menutitle = NavigationService.makeactive("Users");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var jsonArr = $stateParams.jsonName.split("¢");
        var jsonName = jsonArr[0];
        var urlParams = {};
        $scope.dropdown = {};
        $scope.dropdownvalues = [];
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

                $scope.pagination = {
                    "search": "",
                    "pagenumber": 1,
                    "pagesize": 10
                };

                //get coupon code
                NavigationService.getCoupon($scope.pagination, function (data) {
                    if (data.value) {
                        $scope.allCoupon = data.data.data;
                        console.log("aaa", $scope.allCoupon);
                    }
                }, function () {
                    console.log("fail");
                });

                //get subcategory 
                NavigationService.getSubCategory(function (data) {
                    if (data.value) {
                        $scope.subCategory = data.data;
                        console.log($scope.subCategory);
                    }
                }, function () {
                    console.log("fail");
                });

                //get designer 
                NavigationService.getDesigner(function (data) {
                    if (data.value) {
                        $scope.designer = data.data;
                        console.log($scope.designer);
                    }
                }, function () {
                    console.log("fail");
                });


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
                    console.log("scope", $scope.search);
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
                        $state.go("pageno", {
                            no: $scope.pagination.pagenumber,
                            jsonName: $stateParams.jsonName,
                            search: $scope.search
                        });
                    } else {

                        if ($scope.filterSearch == true) {
                            $scope.pagination.status = $scope.search.status;
                            $scope.pagination.coupon = $scope.search.coupon;
                            $scope.pagination.subcategory = $scope.search.subcategory;
                            $scope.pagination.designer = $scope.search.designer;
                            $scope.pagination.rentalDate = $scope.search.rentalDate;
                            console.log("scope", $scope.pagination);
                            if ($scope.search.search) {

                                $scope.pagination.search = $scope.search.search;
                            } else {
                                $scope.pagination.search = "";
                            }
                            $scope.pagination.price = $scope.search.price;
                        } else if ($scope.search) {
                            $scope.pagination.search = $scope.search;
                        } else if ($scope.pagination.search) {
                            $scope.pagination.search = $scope.pagination.search;
                        } else {
                            $scope.pagination.search = '';
                        }
                        console.log($scope.pagination);
                        NavigationService.findProjects($scope.apiName, $scope.pagination, function (findData) {
                            console.log(findData);
                            if (findData.value !== false) {
                                if (findData.data && findData.data.data && findData.data.data.length > 0) {
                                    $scope.pageInfo.lastpage = findData.data.totalpages;
                                    $scope.pageInfo.pagenumber = findData.data.pagenumber;
                                    $scope.pageInfo.totalitems = $scope.pagination.pagesize * findData.data.totalpages;
                                    $scope.json.tableData = findData.data.data;
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
                        // $scope.dateNew="2017-02-10T18:30:00.000Z";
                        NavigationService.findRentalDate($scope.apiName, $scope.pagination, function (findData) {
                            console.log(findData);
                            if (findData.value !== false) {
                                if (findData.data && findData.data.data && findData.data.data.length > 0) {
                                    $scope.pageInfo.lastpage = findData.data.totalpages;
                                    $scope.pageInfo.pagenumber = findData.data.pagenumber;
                                    $scope.pageInfo.totalitems = $scope.pagination.pagesize * findData.data.totalpages;
                                    $scope.json.tableData = findData.data.data;
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
                                // console.log("new log ", $scope.json.tableData);

                            } else {
                                $scope.json.tableData = [];
                            }
                        } else {
                            $scope.json.tableData = [];
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
    });