/**
 * Created by Administrator on 2017/4/13.
 */
var app = angular.module("eleme", ["ionic"]);

//防抖动处理
app.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    function($rootScope, $browser, $q, $exceptionHandler) {
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
            var deferred = $q.defer(),
                promise = deferred.promise,
                skipApply = (angular.isDefined(invokeApply) && !invokeApply),
                timeoutId, cleanup,
                methodId, bouncing = false;

            // check we dont have this method already registered
            angular.forEach(methods, function(value, key) {
                if (angular.equals(methods[key].fn, fn)) {
                    bouncing = true;
                    methodId = key;
                }
            });

            // not bouncing, then register new instance
            if (!bouncing) {
                methodId = uuid++;
                methods[methodId] = { fn: fn };
            } else {
                // clear the old timeout
                deferreds[methods[methodId].timeoutId].reject('bounced');
                $browser.defer.cancel(methods[methodId].timeoutId);
            }

            var debounced = function() {
                // actually executing? clean method bank
                delete methods[methodId];

                try {
                    deferred.resolve(fn());
                } catch (e) {
                    deferred.reject(e);
                    $exceptionHandler(e);
                }

                if (!skipApply) $rootScope.$apply();
            };

            timeoutId = $browser.defer(debounced, delay);

            // track id with method
            methods[methodId].timeoutId = timeoutId;

            cleanup = function(reason) {
                delete deferreds[promise.$$timeoutId];
            };

            promise.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            promise.then(cleanup, cleanup);

            return promise;
        }


        // similar to angular's $timeout cancel
        debounce.cancel = function(promise) {
            if (promise && promise.$$timeoutId in deferreds) {
                deferreds[promise.$$timeoutId].reject('canceled');
                return $browser.defer.cancel(promise.$$timeoutId);
            }
            return false;
        };

        return debounce;
    }
]); //防抖动处理



app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('start', {
            url: '/kflstart',
            templateUrl: 'tpl/start.html',
            controller: "startCtrl"
        }).state("main", {
            url: "/kflmain",
            templateUrl: "tpl/main.html",
            controller: "mainCtrl"
        }).state("detail", {
            url: "/kfldetail/:id",
            templateUrl: "tpl/detail.html",
            controller: "detailCtrl"
        }).state("myorder", {
            url: "/kflmyorder",
            templateUrl: "tpl/myorder.html",
            controller: "myorderCtrl"
        }).state("setting", {
            url: "/kflsetting",
            templateUrl: "tpl/settings.html",
            controller: "settingCtrl"
        }).state("cart", {
            url: "/kflcart",
            templateUrl: "tpl/cart.html",
            controller: "cartCtrl"
        }).state("register", {
            url: "/kflregister",
            templateUrl: "tpl/register.html",
            controller: "registerCtrl"
        }).state("Login", {
        url: "/kflLogin",
        templateUrl: "tpl/Login.html",
        controller: "LoginCtrl"
        }).state("success", {
            url: "/kflsuccess/:oid",
            templateUrl: "tpl/include/success.html",
            controller: "successCtrl"
        });
    $urlRouterProvider.otherwise('/kflstart');

});
//如果发起post请求，设置请求头信息：
app.run(function($http) {
    $http.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' };
});

app.controller("startCtrl",["$scope",function ($scope) {

}]);

app.controller("mainCtrl", ["$scope", "$http", "$debounce", "$ionicLoading", "$timeout", function($scope, $http, $debounce) {
    $scope.hasMore = true;
    $scope.shwo = false;
    $http.get("data/dish_getbypage.php?start=" + 0).success(function(data) {
        $scope.list = data;
        console.log($scope.list);
    });
    $scope.parent = { search: "" };
    $scope.$watch("parent.search", function() {
        $debounce(watchSearch, 300);
    });
    watchSearch = function() {
        console.log("搜索打印：" + $scope.parent.search);
        if ($scope.parent.search) {
            $http({
                method: 'post',
                url: 'data/dish_getbykw.php?search=' + $scope.parent.search
            }).success(function(data) {
                // 请求成功执行代码
                $scope.list = data;
                if ($scope.list.length < 1) {
                    $scope.shwo = true;
                } else if ($scope.list.length > 0) {
                    $scope.shwo = false;
                } else if ($scope.list.code == -1) {
                    console.log($scope.list.msg);
                }
                console.log($scope.list);
            })
        } else {
            $http.get("data/dish_getbypage.php?start=" + 0).success(function(data) {
                $scope.list = data;
            })
        }
    };

    $scope.btn = function() {
        $http.get("data/dish_getbypage.php?start=" + $scope.list.length).success(function(data) {
            if (data.length < 5) {
                $scope.hasMore = false;
            }
            //          $interval(function(){
            //          	$ionicLoading.show({
            //          	template:"Loading..."
            //          })
            //          },1000);

            $scope.list = $scope.list.concat(data);
            $scope.shwo = false;
            console.log($scope.list);
        });
    }

    $scope.loadMore = function() {

        $http.get("data/dish_getbypage.php?start=" + $scope.list.length).success(function(data) {
            if (data.length < 5) {
                $scope.hasMore = false;
            }

            $scope.list = $scope.list.concat(data);
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.shwo = false;
            console.log($scope.list);
        });



    }

}]);

app.controller("detailCtrl", ["$scope", "$stateParams", "$http", "$ionicPopup", "$state", function($scope, $stateParams, $http, $ionicPopup, $state) {
    console.log("获取商品id：" + $stateParams.id);
    $http.get("data/dish_getbyid.php?id=" + $stateParams.id).success(function(data) {
        console.log(data[0]);
        $scope.list = data[0];
    });
    $scope.add_order = function() {
        $http.get("data/login_do.php").success(function (response) {
            $scope.userlist = response;
            console.log($scope.userlist);
            if($scope.userlist.code == -1){
                $state.go("register");
            }else{
                    var result = "did=" + $scope.list.did + "&uid=" + $scope.userlist.userid + "&count=-1";
                    console.log(result);
                    $http.post("data/cart_update.php", result).success(function(data) {
                        console.log(data);
                        //当添加到购物车成功时，总数肯定是自增
                        $scope.data.totalNumInCart++;
                        $ionicPopup.alert({
                            title: '购物车弹出框',
                            template: "确认添加成功"
                        });
                    });
            }
        });

    }
}]);

app.controller("myorderCtrl", ["$scope", "$http", "$state", function($scope, $http, $state) {
    $http.get("data/login_do.php").success(function (response) {
        $scope.userlist = response;
        console.log($scope.userlist);
        if($scope.userlist.code ==-1){
            $state.go("Login");
        }else{
            $http.get("data/order_getbyuserid.php?userid=" + $scope.userlist.userid).success(function(response) {
                        console.log(response);
                        $scope.list = response.data;

                $scope.totalPrice = function () {
                    var totalNumInorder = 0;
                    angular.forEach($scope.list, function(value, key) {
                        totalNumInorder += parseInt(value.totalprice);
                    });
                    return totalNumInorder
                };
                        if ($scope.list.length < 1) {
                            $scope.res = "无订单去主页购买";
                        }
                    })
        }


    });
}]);


app.controller("cartCtrl", ["$scope", "$http", "$ionicModal", "$httpParamSerializerJQLike", "$ionicLoading", "$state", function($scope, $http, $ionicModal, $httpParamSerializerJQLike, $ionicLoading, $state) {
    $http.get("data/login_do.php").success(function (response) {
        $scope.userlist = response;
        console.log($scope.userlist);
        $http.get("data/cart_select.php?uid=" + $scope.userlist.userid).success(function(response) {
            $scope.list = response.data;
            updateTotaNum = function() {
                //在进入购物车页面时，将服务器返回的所有的数据的数量累加，
                // 赋值给totalNumInCart
                $scope.data.totalNumInCart = 0;
                angular.forEach($scope.list,
                    function(value, key) {
                        $scope.data.totalNumInCart += parseInt(value.dishCount);
                    });
            };
            console.log($scope.list);
            updateTotaNum();
            if ($scope.list.length < 1) {
                $scope.cart_ts = "购物车无商品！";
            }
            $scope.sumAll = function() {
                var totalprice = 0;
                angular.forEach($scope.list, function(value, key) {
                    totalprice += (value.price * value.dishCount);
                })
                return totalprice;
            };
            var totalprice = 0;
            angular.forEach(
                angular.fromJson($scope.list),
                function(value, key) {
                    totalprice += (value.price * value.dishCount);
                }
            );
            var result = angular.toJson($scope.list);
            $scope.order = {
                cartDetail: result,
                totalprice: totalprice,
                userid: $scope.userlist.userid
            };
            $scope.Submit_btn = function() {
                var result2 = $httpParamSerializerJQLike($scope.order);
                var regtel = /(\+86|0086)?\s*1[34578]\d{9}/;
                if (!regtel.test($scope.order.phone)){
                    $ionicLoading.show({
                        template: '手机号格式不正确...',
                        duration: 1000
                    });
                }else {
                    $http.post("data/order_add.php", result2).success(function(data) {
                        console.log(data);
                        $scope.modal.hide();
                        $scope.data.totalNumInCart = 0;
                        $state.go("main");
                    });
                }

            };
            $scope.delete_btn = function(index, item) {
                console.log(index, item);
                updateTotaNum();
                $http.post("data/cart_update.php?uid=" + $scope.userlist.userid + "&count=-2" + "&did=" + $scope.list[index].did).success(function(data) {
                    console.log(data);
                    $ionicLoading.show({
                        template: '成功删除...',
                        duration: 500 //多少毫秒
                    });
                    $scope.list.splice(index, 1);
                    if($scope.list.length <1){
                        $scope.data.totalNumInCart = 0;
                        $scope.cart_ts = "购物车无商品！";
                    }
                });
            };
            $scope.add_btn = function(index) {
                console.log(index);
                $scope.list[index].dishCount++;
                $http.post(
                    "data/cart_update.php?uid=" + $scope.userlist.userid + "&count=" + $scope.list[index].dishCount + "&did=" + $scope.list[index].did
                ).success(function(data) {
                    console.log(data);
                    updateTotaNum();
                })
            };
            $scope.minus = function(index) {
                console.log(index);
                $scope.list[index].dishCount--;
                if ($scope.list[index].dishCount == 0) {
                    $scope.list[index].dishCount = 1;
                } else {
                    $http.post(
                        "data/cart_update.php?uid=" + $scope.userlist.userid + "&count=" + $scope.list[index].dishCount + "&did=" + $scope.list[index].did
                    ).success(function(data) {
                        console.log(data);
                        updateTotaNum();
                    })
                }

            };
            //配置弹窗
            $ionicModal.fromTemplateUrl('cart_btn.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.modal = modal;
                });
            //打开一个自定义的弹窗
            $scope.open = function() {
                if ($scope.list.length < 1) {
                    $ionicLoading.show({
                        template: '购物车无商品！',
                        duration: 1000 //多少毫秒
                    });
                } else {
                    $scope.modal.show();
                }
            }
            //关闭一个自定义的弹窗
            $scope.close = function() {
                $scope.modal.hide();
            }
        })
    });

}]);


app.controller("settingCtrl", ["$scope", "$http", "$ionicModal", "$state", function($scope, $http, $ionicModal, $state) {
    $http.get("data/login_do.php").success(function (response) {
        $scope.userlist = response;
        console.log($scope.userlist);
        if($scope.userlist.code == -1){
            $state.go("Login");
        }else{
            $http.get("data/About.php?userid=" + $scope.userlist.userid).success(function(data) {
                console.log(data);
                $scope.list = data;
            });
        }
    });
    //配置弹窗
    $ionicModal.fromTemplateUrl('useropen.html', {
            scope: $scope
        })
        .then(function(modal) {
            $scope.modal2 = modal;
        });
    //打开一个自定义的弹窗
    $scope.useropen = function() {
        $scope.modal2.show();
    };
    //关闭一个自定义的弹窗
    $scope.close2 = function() {
        $scope.modal2.hide();
    };

    //配置弹窗
    $ionicModal
        .fromTemplateUrl('About.html', {
            scope: $scope
        })
        .then(function(modal) {
            $scope.modal = modal;
        });
    //打开一个自定义的弹窗
    $scope.open = function() {
        $scope.modal.show();
    };
    //关闭一个自定义的弹窗
    $scope.close = function() {
        $scope.modal.hide();
    };
    $scope.closeout = function() {
        $http.get("data/login_out.php").success(function (data) {
            $state.go("start");
        }).error(function () {
            alert("错误");
        })

    }
}]);

app.controller("registerCtrl", ["$scope", "$http", "$httpParamSerializerJQLike", "$ionicLoading", "$timeout", "$state", function($scope, $http, $httpParamSerializerJQLike, $ionicLoading, $timeout, $state) {

    $scope.data = {};
    $scope.register_btn = function() {
        var result = $httpParamSerializerJQLike($scope.data);
        console.log(result);
        var reg = /^[a-z0-9_-]{6,18}$/;
        var regtel = /(\+86|0086)?\s*1[34578]\d{9}/;
            if(!reg.test($scope.data.pwd)){
                $ionicLoading.show({
                    template: '密码至少6位数...',
                    duration: 1000
                });
            }else if(!regtel.test($scope.data.phone)){
                $ionicLoading.show({
                    template: '手机号格式不正确...',
                    duration: 1000
                });
            }else {
                console.log("手机号通过");
                $http.post("data/register.php", result).success(function(reponse) {
                    console.log(reponse);
                    $ionicLoading.show({
                        template: '注册成功并登陆...',
                        duration: 1000
                    });
                    $timeout(function() {
                        $state.go("myorder");
                    }, 1000);

                })
            }



    }
}]);


app.controller("LoginCtrl",["$scope","$state","$ionicLoading","$httpParamSerializerJQLike","$http","$timeout",function ($scope,$state,$ionicLoading,$httpParamSerializerJQLike,$http,$timeout) {
    $ionicLoading.show({
        template: '请登陆...',
        duration: 1000
    });
    $scope.register = function () {
        $state.go("register");
    };
    $scope.data = {};
    $scope.Login_btn = function () {
        var result = $httpParamSerializerJQLike($scope.data);
        console.log(result);
        $http.post("data/Login.php", result).success(function(response) {
            console.log(response);
            if (response==null){
                $ionicLoading.show({
                    template: '无该账号或密码错误...',
                    duration: 1000
                });
            }else {
                $ionicLoading.show({
                    template: '登陆成功即将跳转...',
                    duration: 1000
                });
                $timeout(function() {
                    $state.go("setting");
                }, 1000);
            }



        });
    }
}]);


app.controller("successCtrl", ["$scope", "$stateParams", function($scope, $stateParams) {
    console.log("获取商品id：" + $stateParams.oid);
    $scope.list = $stateParams.oid;
}]);


app.controller("parentCtrl", ["$scope", "$state", function($scope, $state) {
    $scope.data = { totalNumInCart: 0 };
    $scope.jump = function(desState, argument) {
        console.log(desState, argument);
        $state.go(desState);
    };
}]);