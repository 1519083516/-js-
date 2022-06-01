1.分为五个页面
    主页面(index/home)
    信息页面(about)
    照片页面(photos)
    日程页面(live)
    联系页面(contact)
    五个页面同时遵循template.html模板，只改变<article>部分
2.功能实现：
// templete
// 模板使导航随页面变换而对应高亮效果:
    function highlightPage() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;  
    var headers = document.getElementsByTagName('header');
    if (headers.length == 0) return false;
    var navs = headers[0].getElementsByTagName('nav');
    if (navs.length == 0) return false;

    var links = navs[0].getElementsByTagName("a");
    for (var i=0; i<links.length; i++) {
        var linkurl;
        for (var i=0; i<links.length; i++) {
        linkurl = links[i].getAttribute("href");
        if (window.location.href.indexOf(linkurl) != -1) {
            links[i].className = "here";
            var linktext = links[i].lastChild.nodeValue.toLowerCase();
            document.body.setAttribute("id",linktext);
        }
        }
    }
}
// home
// 点击页面跳到相应页面
// 当鼠标移到对应的超链接上时，自己创造的div里出现对应的图片(通过雪碧图)
用到moveElement(elementID,final_x,final_y,interval)函数（移动图片）
和prepareSlideshow() 函数（将图片匹配不同链接href中的对应页面值）

// about
// 是否显示元素部分
  showSection(id)
// 点击链接时，显示链接中href值#后对应id元素部分，取消点击事件默认行为
  prepareInternalnav()

// photos
// 创建站位空间（放照片和照片信息）
  preparePlaceholder()
// 点击相应链接展示对应图片和信息，取消点击事件默认行为
  prepareGallery()
  showPic(whichpic)

// Live
// 给表格奇数行（不包括表格头部）添加odd类，可在css中定义其样式。 
  stripeTables()
// 当鼠标移到表格行时，添加highlight类，用css给其定义样式使其高亮显示，鼠标移出时恢复
  highlightRows()
// 在下方显示缩略词定义列表（key对应文本，definition对应title）
  displayAbbreviations()

// contact
// 点击表单标签(for和id挂钩)，对应文本框获得焦点
  focusLabels()
// 当浏览器不支持显示input的placeholder属性内容时，采用js实现，即文本框获得焦点时，不显示placeholder属性内容，当失去焦点时，则显示。
  resetFields(whichform)
// 验证表单必填字段不为空且邮件有@和.
  isFilled(field)
  isEmail(field)
  validateForm(whichform)
// 调用resetFields(whichform)，当表单验证错误时，则不提交，当用ajax请求在当前页面展示信息时，若成功则不提交，不成功则提交。
  prepareForms()
// 创建xmlhttprequest对象，ajax加载时呈现元素内容，用ajax提交表单，当请求未响应完全时，呈现请求状态码,当状态不为200或0时呈现错误信息。
  getHTTPObject()
  displayAjaxLoading(element)
  submitFormWithAjax(whichform, thetarget)