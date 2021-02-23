var seting = {
    apiUrl: "https://api.vvhan.com/api/360wallpaperApi.php",
    ratio: 0.618,
    types: '360new',
    downApi: 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url='
};
var jigsaw = {
    count: 0,
    halfHtml: '',
    loadBig: false,
    ajaxing: false
};
window.onresize = function () {
    resizeHeight()
};
window.onload = function () {
    loadData(seting.types, true);
    resizeHeight()
};
$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() + $(window).height() + 20 >= $(document).height() && $(this).scrollTop() > 20) {
            loadData(seting.types, false)
        }
    })
});
console["log"]("%c \u97e9\u5c0f\u97e9\u4e8c\u6b21\u7f8e\u5316 \u97e9\u5c0f\u97e9api\u63a5\u53e3 Api.vvhan.com qq\uff1a1655466387 %c", "color: #fadfa3; background: #030307; padding:5px", "background: #fadfa3; padding:5px");

function loadData(types, newload) {
    if (types != seting.types || newload === true) {
        seting.types = types;
        jigsaw = {
            count: 0,
            halfHtml: '',
            loadBig: false,
            ajaxing: false
        };
        $("#walBox").html('');
        $(".onepage-pagination").remove();
        $("body").removeClass();
        $(".jigsaw").removeAttr("style")
    }
    ajax360Wal(seting.types, jigsaw.count, 30)
}
resizeHeight();

function resizeHeight() {
    switch (seting.types) {
        default:
            var newHeight = $("#walBox").width() * (seting.ratio / 2);
            $(".jigsaw .item").css('height', newHeight);
            $(".jigsaw .Hhalf").css('height', newHeight / 2)
    }
    return true
}

function addJigsaw(img, alt) {
    var newHtml;
    var imgWidth, imgHeight;
    jigsaw.count++;
    if (jigsaw.halfHtml !== '') {
        imgWidth = parseInt(screen.width / 4);
        imgHeight = parseInt(imgWidth * seting.ratio);
        newHtml = '<div class="Hhalf oneImg"><a href="' + decode360Url(img, 0, 0, 100) + '" data-fancybox="images"><img  src="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt + '"title="关键字：' + alt + '" class="pimg"></a>    </div></div>';
        contAdd(jigsaw.halfHtml + newHtml);
        jigsaw.halfHtml = '';
        return true
    }
    if (((jigsaw.count - 1) % 5) === 0) {
        jigsaw.loadBig = false
    }
    if ((jigsaw.loadBig === false) && ((Math.floor(Math.random() * 3) === 0) || ((jigsaw.count % 5) === 0))) {
        imgWidth = parseInt(screen.width / 2);
        imgHeight = parseInt(imgWidth * seting.ratio);
        newHtml = '<div class="item half oneImg"><a href="' + decode360Url(img, 0, 0, 100) + '" data-fancybox="images"><img src="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt + '" title="关键字：' + alt + '" class="pimg"></a></div>';
        contAdd(newHtml);
        jigsaw.loadBig = true;
        return true
    }
    imgWidth = parseInt(screen.width / 4);
    imgHeight = parseInt(imgWidth * seting.ratio);
    jigsaw.halfHtml = '<div class="item quater">    <div class="Hhalf oneImg"><a href="' + decode360Url(img, 0, 0, 100) + '" data-fancybox="images"><img src="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt + '" title="关键字：' + alt + '" class="pimg"></a>    </div>';
    return true
}

function contAdd(html) {
    var myBox = $("#walBox");
    var $newHtml = $(html);
    myBox.append($newHtml);
    $("img", $newHtml).lazyload({
        effect: 'fadeIn',
        threshold: 200
    })
}

function ajax360Wal(cid, start, count) {
    if (jigsaw.ajaxing === true) return false;
    $("#loadmore").html('努力加载中……');
    $("#loadmore").show();
    jigsaw.ajaxing = true;
    $.ajax({
        type: "GET",
        url: seting.apiUrl,
        data: "cid=" + cid + "&start=" + start + "&count=" + count,
        dataType: "json",
        success: function (jsonData) {
            for (var i = 0; i < jsonData.data.length; i++) {
                addJigsaw(jsonData.data[i].url, decode360Tag(jsonData.data[i].tag))
            }
            resizeHeight();
            jigsaw.ajaxing = false;
            if (jsonData.data.length === 0) {
                $("#loadmore").html('所有的壁纸都已经加载完啦！')
            } else {
                $("#loadmore").hide()
            }
        }
    });
    return true
}

function decode360Tag(oldTag) {
    return oldTag.match(/_category_[^_]+_/g).join(" ").replace(/_category_([^_]+)_/g, "$1")
}

function decode360Url(oldUrl, width, height, quality) {
    return oldUrl.replace("r\/__85", "m\/" + parseInt(width) + "_" + parseInt(height) + "_" + quality)
}

function changeTitle(obj) {
    $('title').html($(obj).html() + ' - 电脑壁纸')
}
