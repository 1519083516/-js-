// 共享load事件
function addLoadEvent(func) {
    // 把现有的window.onload事件处理函数的值存入变量oldonload
    var oldonload = window.onload;
    // 如果这个处理函数上还没有绑定任何事件，则将新函数添加给它
    if (typeof window.onload != "function") {
        window.onload = func;
    } else {
        // 如果这个处理函数上已经绑定了一些事件，就把新函数追加到现有指令的末尾
        window.onload = function () {
            oldonload();
            func();
        };
    }
}

// 功能:将元素插入到目标元素之后
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

/* 更新元素的className属性，更改其样式（确保表示层和行为层分的更彻底）,
第一个为需要添加class的元素，第二个为class值(字符串) */
function addClass(element, value) {
    if (!element.className) {
        element.className = value;
    } else {
        var newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

// 突出文本
function highlightPage() {
    if (!document.getElementsByTagName) return false;
    var headers = document.getElementsByTagName("header");
    if (headers.length == 0) return false;
    var navs = headers[0].getElementsByTagName("nav");
    if (navs.length == 0) return false;
    var links = navs[0].getElementsByTagName("a");
    var linkurl;
    for (var i = 0; i < links.length; i++) {
        linkurl = links[i].getAttribute("href");
        if (window.location.href.indexOf(linkurl) != -1) {
            links[i].className = "here";
            // 获得链接文本
            var linktext = links[i].lastChild.nodeValue.toLowerCase();
            document.body.setAttribute("id", linktext);
        }
    }
}

// 随时间慢慢移动元素
function moveElement(elementId, final_x, final_y, interval) {
    if (!document.getElementById) return false;
    if (!document.getElementById(elementId)) return false;
    var elem = document.getElementById(elementId);
    // 清楚setTimeout队列中的事件，消除动画滞后现象
    if (elem.movement) {
        clearTimeout(elem.movement);
    }
    // 假设元素有letf,top属性，没有则设置为0px;
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    if (!elem.style.top) {
        elem.style.top = "0px";
    }
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    // dist为偏移量
    var dist = 0;
    // 改变位置
    if (xpos == final_x && ypos == final_y) return true;
    if (xpos < final_x) {
        dist = Math.ceil((final_x - xpos) / 10);
        xpos += dist;
    }
    if (xpos > final_x) {
        dist = Math.ceil((xpos - final_x) / 10);
        xpos -= dist;
    }
    if (ypos < final_y) {
        dist = Math.ceil((final_y - ypos) / 10);
        xpos += dist;
    }
    if (ypos > final_y) {
        dist = Math.ceil((xpos - final_y) / 10);
        xpos -= dist;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    // elementId为字符串
    var repeat = "moveElement('" + elementId + "'," + final_x + "," + final_y + "," + interval + ")";
    // repeat也为字符串
    // 重复执行
    elem.movement = setTimeout(repeat, interval);
}

// 准备幻灯片
function prepareSlideShow() {
    if (!document.getElementById) return false;
    if (!document.getElementById("intro")) return false;
    if (!document.getElementsByTagName) return false;
    var intro = document.getElementById("intro");
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id", "slideshow");

    var frame = document.createElement("img");
    frame.setAttribute("src", "images/frame.gif");
    frame.setAttribute("alt", "");
    frame.setAttribute("id", "frame");
    slideshow.appendChild(frame);

    var preview = document.createElement("img");
    preview.setAttribute("src", "images/slideshow.gif");
    preview.setAttribute("id", "preview");
    preview.setAttribute("alt", "a glimpse of what awaits you");
    slideshow.appendChild(preview);
    insertAfter(slideshow, intro);

    var links = intro.getElementsByTagName("a");
    var destination;
    for (var i = 0; i < links.length; i++) {
        links[i].onmouseover = function () {
            destination = this.getAttribute("href");
            if (destination.indexOf("index.html") != -1) {
                moveElement("preview", 0, 0, 5);
            }
            if (destination.indexOf("about.html") != -1) {
                moveElement("preview", -150, 0, 5);
            }
            if (destination.indexOf("photos.html") != -1) {
                moveElement("preview", -300, 0, 5);
            }
            if (destination.indexOf("live.html") != -1) {
                moveElement("preview", -450, 0, 5);
            }
            if (destination.indexOf("contact.html") != -1) {
                moveElement("preview", -600, 0, 5);
            }
        }
    }
}
// 展示相应的section部分
function showSection(id) {
    var sections = document.getElementsByTagName("section");
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].getAttribute("id") != id) {
            sections[i].style.display = "none";
        } else {
            sections[i].style.display = "block";
        }
    }
}
function prepareInternalNav() {
    if (!document.getElementsByTagName) return false;
    var articles = document.getElementsByTagName("article");
    if (articles.length == 0) return false;
    var navs = articles[0].getElementsByTagName("nav");
    if (navs.length == 0) return false;
    var links = navs[0].getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        // 0为空串，1为id
        var sectionId = links[i].getAttribute("href").split("#")[1];
        // 没有对应的section元素，则进入下一循环
        if (!document.getElementById(sectionId)) continue;
        document.getElementById(sectionId).style.display = "none";
        links[i].destination = sectionId;
        links[i].onclick = function () {
            showSection(this.destination);
            return false;
        }
    }
}
// 图片库
// 创建占位符和描述文本
function preparePlaceholder() {
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegallery")) return false;
    if (!document.createElement) return false;
    if (!document.createTextNode) return false;
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id", "placeholder");
    placeholder.setAttribute("src", "images/placeholder.gif");
    placeholder.setAttribute("alt", "my gallery image");
    var describtion = document.createElement("p");
    describtion.setAttribute("id", "description");
    var desctext = document.createTextNode("Choose an image.");
    describtion.appendChild(desctext);
    var gallery = document.getElementById("imagegallery");
    // 将描述文本和占位符分别插入到id为 imagegallery的ul元素后面
    insertAfter(describtion, gallery);
    insertAfter(placeholder, describtion);
}
function showPic(whichPic) {
    if (!document.getElementById("placeholder")) return true;
    if (!document.getElementById("description")) return true;
    var placeholder = document.getElementById("placeholder");
    var source = whichPic.getAttribute("href");
    placeholder.setAttribute("src", source);
    if (whichPic.getAttribute("title")) {
        var text = whichPic.getAttribute("title");
    } else {
        var text = "";
    }
    var describtion = document.getElementById("description");
    // 如果节点是文本节点
    if (describtion.firstChild.nodeType == 3) {
        describtion.firstChild.nodeValue = text;
    }
    return false;
}
function prepareGallery() {
    if (!document.getElementById) return false;
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById("imagegallery")) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function () {
            // 取消点击事件的默认行为
            return showPic(this);
        }
    }
}

// 给表格的奇数行定义odd类名
function stripeTables() {
    if (!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        var rows = tables[i].getElementsByTagName("tr");
        var odd = false;
        for (var j = 0; j < rows.length; j++) {
            if (odd == true) {
                addClass(rows[j], "odd");
                odd = false;
            } else {
                odd = true;
            }
        }
    }
}

// 当鼠标移到行的时候添加highlight类名，进行高亮处理
function highlightRows() {
    if (!document.getElementsByTagName) return false;
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].oldClassName = rows[i].className;
        rows[i].onmouseover = function () {
            addClass(this, "highlight");
        }
        rows[i].onmouseout = function () {
            this.className = this.oldClassName;
        }
    }
}

// 呈现缩略词
function displayAbbreviations() {
    if (!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
    var abbrs = document.getElementsByTagName("abbr");
    if (abbrs.length < 1) return false;
    var defs = new Array();
    for (var i = 0; i < abbrs.length; i++) {
        // 如果当前的abbr没有文本节点，则进入下一循环
        if (abbrs[i].childNodes.length < 1) continue;
        var key = abbrs[i].lastChild.nodeValue;
        var definition = abbrs[i].getAttribute("title");
        // 给数组赋值
        defs[key] = definition;
    }
    // 创造定义列表
    var dlist = document.createElement("dl");
    // 遍历数组,构建解释列表的标题和定义
    for (key in defs) {
        var dtitle = document.createElement("dt");
        var dtitle_text = document.createTextNode(key);
        var desc = document.createElement("dd");
        var desc_text = document.createTextNode(defs[key]);
        dtitle.appendChild(dtitle_text);
        desc.appendChild(desc_text);
        dlist.appendChild(dtitle);
        dlist.appendChild(desc);
    }
    if (dlist.childNodes.length < 1) return false;
    var header = document.createElement("h1");
    var header_text = document.createTextNode("Abbreviations");
    header.appendChild(header_text);
    var articles = document.getElementsByTagName("article");
    if (articles.length < 1) return false;
    articles[0].appendChild(header);
    articles[0].appendChild(dlist);
}

// 点击label，表单中相应字段会获得焦点
function focusLabels() {
    if (!document.getElementsByTagName) return false;
    var labels = document.getElementsByTagName("label");
    for (var i = 0; i < labels.length; i++) {
        if (!labels[i].getAttribute("for")) continue;

        labels[i].onclick = function () {
            var id = labels[0].getAttribute("for");
            if (!document.getElementById(id)) return false;
            var elem = document.getElementById(id);
            elem.focus();
        }
    }
}
// 当浏览器不支持input显示placeholder内容时
function resetFields(whichform) {
    // 如果支持placeholder则返回
    if (Modernizr.input.placeholder) return;
    // 遍历表单所有元素
    for (var i = 0; i < whichform.elements.length; i++) {
        var element = whichform.elements[i];
        // 如果元素为submit类型或没有placeholder属性，则进入下一循环
        if (element.type == "submit") continue;
        if (!element.placeholder || !element.getAttribute("placeholder")) continue;
        element.onfocus = function () {
            var text = this.placeholder || this.getAttribute("placeholder");
            if (this.value == text) {
                this.className = "";
                this.value = "";
            }
        }
        element.onblur = function () {
            if (this.value == "") {
                this.className = "placeholder";
                this.value = this.placeholder || this.getAttribute("placeholder");
            }
        }
        element.onblur();
    }
}
function prepareForms() {
    for (var i = 0; i < document.forms.length; i++) {
        var thisform = document.forms[i];
        resetFields(thisform);
        thisform.onsubmit = function () {
            if (!validateForm(this)) return false;
            var article = document.getElementsByTagName("article")[0];
            if (submitFormWithAjax(this, article)) return false;
            return true;
        }
    }
}

// 验证
function isFilled(field) {
    if (field.value.replace(' ', '').length == 0) return false;
    var placeholder = field.placeholder || field.getAttribute("placeholder");
    return (field.value != placeholder);
}

function isEmail(field) {
    return (field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1);
}

function validateForm(whichform) {
    for (var i = 0; i < whichform.elements.length; i++) {
        var element = whichform.elements[i];
        if (element.required == "required") {
            if (!isFilled(element)) {
                alert("Please fill in the " + element.name + " field.");
                return false;
            }
        }
        if (element.type == "email") {
            if (!isEmail(element)) {
                alert("The " + element.name + " field must be a valid email address.");
                return false;
            }
        }
    }
    return true;
}
// 创建XMLHTTPRequest对象
function getHTTPObject() {
    if (typeof XMLHttpRequest == "undefined") {
        XMLHttpRequest = function () {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) { }
        }
    }
    return new XMLHttpRequest();
}

// 在Ajax请求刚启动时把它加载到目标元素中
function displayAjaxLoading(element) {
    // 删掉元素中所有子元素
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
    var content = document.createElement("img");
    content.setAttribute("src", "images/loading.gif");
    content.setAttribute("alt", "Loading...");
    element.appendChild(content);
}

// 用Ajax请求提交表单
function submitFormWithAjax(thisform, thetarget) {
    var request = getHTTPObject();
    if (!request) return false;
    displayAjaxLoading(thetarget);
    var element;
    var dataParts = [];
    // 遍历thisform的所有子元素
    for (var i = 0; i < thisform.elements.length; i++) {
        element = thisform.elements[i];
        dataParts[i] = this.name + "=" + encodeURLComponent(element.value);
    }
    var data = dataParts.join("&");
    request.open('POST', whichform.getAttribute("action"), true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
                var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
                if (matches.length > 0) {
                    thetarget.innerHTML = matches[1];
                } else {
                    thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>';
                }
            } else {
                thetarget.innerHTML = '<p>' + request.statusText + '</p>';
            }
        }
    };

    request.send(data);

    return true;
}

// 添加load事件
addLoadEvent(highlightPage);
addLoadEvent(prepareSlideShow);
addLoadEvent(prepareInternalNav);
addLoadEvent(prepareGallery);
addLoadEvent(preparePlaceholder);
addLoadEvent(displayAbbreviations);
addLoadEvent(stripeTables);
addLoadEvent(highlightRows);
addLoadEvent(focusLabels);
addLoadEvent(prepareForms);