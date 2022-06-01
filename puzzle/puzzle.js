// 设置计数时间
var time = 0;
// 设置暂停标志符
var pause = true;
// 设置计时函数
var set_timer;
// 创建数组储存对应位置的块编码
var d = new Array(10);
d[1] = 1;
d[2] = 2;
d[3] = 3;
d[4] = 4;
d[5] = 5;
d[6] = 6;
d[7] = 7;
d[8] = 8;
d[9] = 0;
// 创建数组储存对应位置可去的位置编码
var d_direct = new Array(
    [0],
    [2,4],
    [1,3,5],
    [2,6],
    [1,5,7],
    [2,4,6,8],
    [3,5,9],
    [4,8],
    [5,7,9],
    [6,8]
);
// 创建数组储存对应位置的位置信息（left,top）
var d_posXY = new Array(
    [0],
    [0,0],
    [150,0],
    [300,0],
    [0,150],
    [150,150],
    [300,150],
    [0,300],
    [150,300],
    [300,300]
);

// 移动函数,id为块编码
function move(id) {
    var pos;
    // 遍历所有位置，找到块所在位置编码
    for(pos = 1;pos < 10;pos++){
        if(d[pos] == id) break;
    }
    // 设置该位置可去位置编码
    var target_d = whereCanTo(pos);
    // 若可移动则移动块至可移动位置
    if(target_d != 0){
        // 移动位置
        document.getElementById("d"+id).style.left = d_posXY[target_d][0]+"px";
        document.getElementById("d"+id).style.top = d_posXY[target_d][1]+"px";
        // 更新编码
        d[pos] = 0;
        d[target_d] = id;
    }
    // 设置是否完成标志符
    var finish_flag = true;
    // 遍历所有块，查看是否完成拼图
    for(var i = 1;i < 9;i++){
        if(d[i] != i){
            finish_flag = false;
        }
    }
    // 若完成拼图，未暂停则设置为暂停状态，弹出信息。
    if(finish_flag == true){
        if(!pause) start();
        alert("Congratulations!");
    }
}

// 是否可移动，可移动则返回可去位置编码，反之，则返回0
function whereCanTo(cur_div) {
    // 设置是否可移动标志符
    var move_flag = false;
    var pos2;
    // 遍历所有可去的位置，当可去位置为空时，则可移动
    for(pos2 = 0;pos2 < d_direct[cur_div].length;pos2++){
        if(d[d_direct[cur_div][pos2]] == 0){
            move_flag = true;
            break;
        }
    }
    if(move_flag == true){
        return d_direct[cur_div][pos2];
    }else{
        return 0;
    }
}

// 计时函数
function timer() {
    time += 1;
    var min = parseInt(time / 60);
    var sec = time % 60;
    // 输出时间
    document.getElementById("timer").innerHTML = min + "分" + sec + "秒"; 
}
// 开始暂停函数
function start() {
    // 若为暂停状态，则转为开始状态
    if(pause){
        document.getElementById("start").innerHTML = "开始";
        pause = false;
        set_timer = setInterval(timer,1000);
    }else{ // 若为开始状态，则转为暂停状态
        document.getElementById("start").innerHTML = "暂停";
        pause = true;
        clearInterval(set_timer);
    }
}

// 重来函数
function reset() {
    // 时间重置
    time = 0;
    // 若为暂停状态则变为开始状态
    if(pause) start();
    // 随机变换位置
    randomPos();
}

function randomPos() {
    // 从第九个位置遍历到第二个位置
    for(var j = 9;j > 1;j--){
        // 随机获得1-i的位置编码，不包括i
        var to = parseInt(Math.random() * (j-1) + 1);
        // 当该位置不为空时，则移动到to位置
        if(d[j]!=0){
            document.getElementById("d"+d[j]).style.left = d_posXY[to][0]+"px";
            document.getElementById("d"+d[j]).style.top = d_posXY[to][1]+"px";
        }
        // 当to位置也不为空时，则互换位置
        if(d[to]!=0){
            document.getElementById("d"+d[to]).style.left = d_posXY[j][0]+"px";
            document.getElementById("d"+d[to]).style.top = d_posXY[j][1]+"px";
        }
        // 更新编码
        var tem = d[to];
        d[to] = d[j];
        d[j] = tem;
    }
}

// 当页面加载完成后，调用reset函数
window.onload = function() {
    reset();
}