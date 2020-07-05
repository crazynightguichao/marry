;(function (designWidth, maxWidth) {
    var doc = document,
        win = window;
    var docEl = doc.documentElement;
    var tid;
    var rootItem, rootStyle;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (!maxWidth) {
            maxWidth = 540;
        }
        ;
        if (width > maxWidth) {
            width = maxWidth;
        }
        //与淘宝做法不同，直接采用简单的rem换算方法1rem=100px
        var rem = width * 100 / designWidth;
        //兼容UC开始
        rootStyle = "html{font-size:" + rem + 'px !important}';
        rootItem = document.getElementById('rootsize') || document.createElement("style");
        if (!document.getElementById('rootsize')) {
            document.getElementsByTagName("head")[0].appendChild(rootItem);
            rootItem.id = 'rootsize';
        }
        if (rootItem.styleSheet) {
            rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle)
        } else {
            try {
                rootItem.innerHTML = rootStyle
            } catch (f) {
                rootItem.innerText = rootStyle
            }
        }
        //兼容UC结束
        docEl.style.fontSize = rem + "px";
    };
    refreshRem();

    win.addEventListener("resize", function () {
        clearTimeout(tid); //防止执行两次
        tid = setT imeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function (e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function (e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }
})(375, 750);

var touchScale = function(seletor, bg) {
    var startX, endX, scale, x1, x2, y1, y2, imgLeft, imgTop, imgWidth, imgHeight,
        one = false, 
        $touch = $(seletor),
        originalWidth = $touch.width(),
        originalHeight = $touch.height(),
        baseScale = parseFloat(originalWidth/originalHeight),
        imgData = [],
        bgTop = parseInt($(bg).css('top'));
    function siteData(name) {
        imgLeft = parseInt(name.css('left'));
        imgTop = parseInt(name.css('top'));
        imgWidth = name.width();
        imgHeight = name.height();
    }
    $(document).on('touchstart touchmove touchend', $(seletor).parent().selector, function(event){
        var $me = $(seletor),
            touch1 = event.originalEvent.targetTouches[0],  // 第一根手指touch事件
            touch2 = event.originalEvent.targetTouches[1],  // 第二根手指touch事件
            fingers = event.originalEvent.touches.length;   // 屏幕上手指数量
        //手指放到屏幕上的时候，还没有进行其他操作
        if (event.type == 'touchstart') {
            if (fingers == 2) {
                // 缩放图片的时候X坐标起始值
                startX = Math.abs(touch1.pageX - touch2.pageX);
                one = false;
            }
            else if (fingers == 1) {
                x1 = touch1.pageX;
                y1 = touch1.pageY;
                one = true;
            }
            siteData($me);
        }
        //手指在屏幕上滑动
        else if (event.type == 'touchmove') {
            if (fingers == 2) {
                // 缩放图片的时候X坐标滑动变化值
                endX = Math.abs(touch1.pageX - touch2.pageX);
                scale = endX - startX;
                $me.css({
                    'width' : originalWidth + scale,
                    'height' : (originalWidth + scale)/baseScale,
                    'left' : imgLeft,
                    'top' : imgTop
                });
                
            }else if (fingers == 1) {
                x2 = touch1.pageX;
                y2 = touch1.pageY;
                if (one) {
                    $me.css({
                        'left' : imgLeft + (x2 - x1),
                        'top' : imgTop + (y2 - y1)
                    });
                }
            }
        }
        //手指移开屏幕
        else if (event.type == 'touchend') {
            // 手指移开后保存图片的宽
            originalWidth = $touch.width(),
            siteData($me);
            imgData = [[imgLeft, imgTop-bgTop, imgWidth, imgHeight],[0, 0, 640, 640]];
        }
    });
    var getData = function(){
        return imgData;
    };
    return {
        imgData : getData
    }
};