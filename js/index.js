/**
 * 徽章地图入口
 */
var Main = (function () {
    var $map;

    // 地图容器id
    var $mapContainerId = "container";

    var $config = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12, //初始化地图层级
        center: [116, 39], //初始化地图中心点
        mapStyle: 'amap://styles/macaron'
    }

    function init() {
        Init.layout();

        Init.eventListener();

        Init.map();

        Init.geolocation();
    }

    var Init = (function () {

        return {
            geolocation: function () {
                Geo.watchLngLat(function (lng, lat) {
                    console.log("获取定位：" + lng + " " + lat)
                    $map.setCenter([lng, lat]); //设置地图中心点
                }, function (errmsg) {
                    console.error("获取定位信息错误：" + errmsg)
                })
            },
            // 初始化布局，根据屏幕宽高适应布局
            layout: function(){
                function resizeLayout(){
                    var rate = 0.88;
                    var width = 900;
                    var height = width * rate;
                    var ww = window.innerWidth;
                    var wh = window.innerHeight;
                    if (ww > 0 && wh > 0 ){
                        if (wh / ww > rate){
                            width = ww - 40;
                            height = width * rate;
                        } else {
                            height = wh  - 40;
                            width = height / rate;
                        }
                    }
                    // 自动适应容器宽高
                    document.getElementById("box").style.width = width + "px";
                    document.getElementById("box").style.height = height + "px";
                }
                document.body.addEventListener("load", resizeLayout);
                window.addEventListener("resize", resizeLayout);
                resizeLayout();
            },
            map: function () {
                $map = new AMap.Map($mapContainerId, $config);
            },
            eventListener: function(){

            }
        }
    })()

    return {
        init: init
    }
})()


// 定位模块
var Geo = (function () {
    // 纬度
    var $latitude = null;
    // 经度
    var $longitude = null;

    return {
        isSupport: function () {
            return navigator.geolocation;
        },
        actionPosition: function (action, success, error) {
            if (this.isSupport()) {
                var geo_options = {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000
                }
                navigator.geolocation[action](function (position) {
                    success(position.coords.longitude, position.coords.latitude);
                }, function (e) {
                    if("function" === typeof error){
                        error(e.message);
                    }
                }, geo_options)
            } else {
                var msg = "当前浏览器不支持定位.";
                console.warn(msg);
                error(msg);
            }
        },
        watchLngLat: function (success, error) {
            this.actionPosition("watchPosition", success, error)
        },
        getLngLat: function (success, error) {
            if ($latitude && $longitude) {
                success($longitude, $latitude);
            } else {
                this.actionPosition("getCurrentPosition", success, error);
            }
        }
    }
})()