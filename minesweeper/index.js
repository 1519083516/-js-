// 调用部分
// 声明jms实例对象，计时函数
var jms = null;
var timeHandle = null;
window.onload = function () {
    var radios = document.getElementsByName("level");
    // 给每个单选按钮绑定点击事件
    for (var i = 0; i < radios.length; i++) {
        radios[i].onclick = function () {
            // 游戏未完成点击单选按钮却不结束游戏则返回
            if (jms != null) {
                if (jms.landMineCount > 0) {
                    if (!confirm("确定结束游戏？")) return false;
                }
            }
            // 若结束了游戏，则初始化jms对象(最大雷数为每五个格子一个雷，最小值比最大值少value)，改变格子数量
            var value = this.value;
            init(value, value, (value * value) / 5 - value, (value * value / 5));
            document.getElementById("JMS_main").style.width = value * 40 + 180 + 60 + "px";
        };
    }
    // 不点击单选按钮时默认行数列数为10
    init(10, 10);
}

// 初始化
function init(rowCount, colCount, minLandMineCount, maxLandMineCount) {
    var showTime = document.getElementById("costTime");
    var landMineCountElement = document.getElementById("landMineCount");
    var beginButton = document.getElementById("begin");
    // 若jms不为空，则重置时间和雷数，清除setInterval序列
    if (jms != null) {
        showTime.innerHTML = 0;
        landMineCountElement.innerHTML = 0;
        clearInterval(timeHandle);
    }
    // 创建一个JMS对象
    jms = JMS("landmine", rowCount, colCount, minLandMineCount, maxLandMineCount);
    // 结束回调函数
    jms.endCallBack = function () {
        clearInterval(timeHandle);
    }
    // 更新雷数回调函数
    jms.landMineCallBack = function (count) {
        landMineCountElement.innerHTML = count;
    }
    // 给开始按钮绑定点击事件
    beginButton.onclick = function () {
        // 入口
        jms.play();

        landMineCountElement.innerHTML = jms.landMineCount;

        //开始游戏
        jms.begin();

        // 计时函数
        timeHandle = setInterval(function () { 
            showTime.innerHTML = parseInt((new Date() - jms.beginTime) / 1000) }
        , 1000);
    };

}