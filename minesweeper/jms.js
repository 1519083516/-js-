// 实现部分
(function () {
  // JMS构造函数
  var JMS = function (id, rowCount, colCount, minLandMineCount, maxLandMineCount) {
    // 若JMS构造函数的原型不在该对象的原型链上，则新建一个JMS对象
    if (!(this instanceof JMS)) {
      return new JMS(id, rowCount, colCount, minLandMineCount, maxLandMineCount);
    }
    // 格子容器
    this.table = document.getElementById(id);
    this.rowCount = rowCount || 10;
    this.colCount = colCount || 10;
    this.minLandMineCount = minLandMineCount || 10;
    this.maxLandMineCount = maxLandMineCount || 20;

    // 雷数
    this.landMineCount = 0;
    // 标记的雷数
    this.markLandMineCount = 0;
    // 操作步数
    this.currentStepCount = 0;
    // 储存格子的数组
    this.arrs = [];
    // 开始时间
    this.beginTime = null;
    // 结束回调函数
    this.endCallBack = null;
    // 更新雷数回调函数
    this.landMineCallBack = null;

    //禁用右键菜单
    document.oncontextmenu = function () {
      return false;
    };
    // 画格子
    this.drawMap();
  };

  // JMS原型
  JMS.prototype = {
    // 画格子
    drawMap: function () {
      // 储存结构数组
      var tds = [];
      for (var i = 0; i < this.rowCount; i++) {
        tds.push("<tr>");
        for (var j = 0; j < this.colCount; j++) {
          tds.push("<td id= 'm_" + i + "_" + j + "'></td>");
        }
        tds.push("</tr>");
      }
      // 把结构放入Table中
      this.setTableInnerHTML(this.table, tds.join(""));
    },
    // 把结构放入Table中
    setTableInnerHTML: function (table, html) {
      table.innerHTML = html;
    },
    // 初始化 
    init: function () {
      // 使每个格子赋值为0
      for (var i = 0; i < this.rowCount; i++) {
        this.arrs[i] = [];
        for (var j = 0; j < this.colCount; j++) {
          this.arrs[i][j] = 0;
        }
      }
      this.beginTime = null;
      this.markLandMineCount = 0;
      this.currentStepCount = 0;
      // 获得雷数
      this.landMineCount = this.getRandomValue(this.minLandMineCount, this.maxLandMineCount);
    },
    // 在格子中布置雷，使其值为9
    landMine: function () {
      // 存放已放入格子中的地雷
      var landMineArr = {};
      for (var i = 0; i < this.landMineCount; i++) {
        // 随机获得雷的位置
        var randomValue = this.getRandomValue(0, this.rowCount * this.colCount - 1);
        var rowCol = this.getRowCol(randomValue);
        // 若该位置已放置地雷则重新选择位置
        if (randomValue in landMineArr) {
          i--;
          continue;
        }
        this.arrs[rowCol.row][rowCol.col] = 9;
        landMineArr[randomValue] = randomValue;
      }
    },
    // 计算其他格子的数值
    calculateNoLandMine: function () {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          if (this.arrs[i][j] == 9) continue;
          if (i > 0 && j > 0) {
            if (this.arrs[i - 1][j - 1] == 9) this.arrs[i][j]++;
          }
          if (i > 0) {
            if (this.arrs[i - 1][j] == 9) this.arrs[i][j]++;
          }
          if (i > 0 && j < this.colCount - 1) {
            if (this.arrs[i - 1][j + 1] == 9) this.arrs[i][j]++;
          }
          if (j < this.colCount - 1) {
            if (this.arrs[i][j + 1] == 9) this.arrs[i][j]++;
          }
          if (i < this.rowCount - 1 && j < this.colCount - 1) {
            if (this.arrs[i + 1][j + 1] == 9) this.arrs[i][j]++;
          }
          if (i < this.rowCount - 1) {
            if (this.arrs[i + 1][j] == 9) this.arrs[i][j]++;
          }
          if (i < this.rowCount - 1 && j > 0) {
            if (this.arrs[i + 1][j - 1] == 9) this.arrs[i][j]++;
          }
          if (j > 0) {
            if (this.arrs[i][j - 1] == 9) this.arrs[i][j]++;
          }
        }
      }
    },
    // 绑定事件
    bindCells: function () {
      // 保存的为JMS原型
      var self = this;
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          (function (row, col) {
            self.$("m_" + row + "_" + col).onmousedown = function (e) {
              e = e || window.event;
              var mouseNum = e.button;
              // 如果按右键，已标记则取消标记，反之则标记
              if (mouseNum == 2) {
                if (this.className == "flag") {
                  this.className = "";
                  self.markLandMineCount--;
                } else {
                  this.className = "flag";
                  self.markLandMineCount++;
                }
                // 若存在更新地雷数回调函数，则调用
                if (self.landMineCallBack) {
                  self.landMineCallBack(self.landMineCount - self.markLandMineCount);
                }
              } else if (this.className != "flag") {
                // 左键且为标记时则显示
                self.openBlock.call(self, this, row, col);
              }
            };
          })(i, j);
        }
      }
    },
    // 显示
    openBlock: function (obj, x, y) {
      // 当不为地雷时则增加操作步数，设置normal样式，清楚点击事件
      if (this.arrs[x][y] != 9) {
        this.currentStepCount++;
        obj.className = "normal";
        obj.onmousedown = null;

        // 若周围有地雷则写入数字
        if (this.arrs[x][y] != 0) {
          obj.innerHTML = this.arrs[x][y];
        }

        if (this.currentStepCount + this.landMineCount == this.rowCount * this.colCount) {
          this.success();
        }

        // 若周围没有地雷，则展示无地雷区域
        if (this.arrs[x][y] == 0) {
          this.showNoLandMine.call(this, x, y);
        }
      } else {
        this.failed();
      }
    },
    // 显示无雷区域
    showNoLandMine: function (x, y) {
      // 遍历该格子周围一圈的格子
      for (var i = x - 1; i < x + 2; i++) {
        for (var j = y - 1; j < y + 2; j++) {
          if (!(i == x && j == y)) {
            var elem = this.$("m_" + i + "_" + j);
            if (elem && elem.className == "") {
              this.openBlock.call(this, elem, i, j);
            }
          }
        }
      }
    },
    // 隐藏所有格子信息
    hideAll: function () {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          this.$("m_" + i + "_" + j).innerHTML = "";
          this.$("m_" + i + "_" + j).className = "";
        }
      }
    },
    // 展示所有格子信息
    showAll: function () {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          if (this.arrs[i][j] != 9) {
            this.$("m_" + i + "_" + j).className = "normal";
            if (this.arrs[i][j] != 0) {
              this.$("m_" + i + "_" + j).innerHTML = this.arrs[i][j];
            }
          } else {
            this.$("m_" + i + "_" + j).className = "landMine";
          }
        }
      }
    },
    // 解绑事件
    disableAll: function () {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          this.$("m_" + i + "_" + j).onmousedown = null;
        }
      }
    },
    // 获得随机数(min-max),包括max
    getRandomValue: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    // 获得格子行列下标
    getRowCol: function (val) {
      return {
        row: parseInt(val / this.colCount),
        col: val % this.colCount,
      }
    },
    // 获取元素
    $: function (id) {
      return document.getElementById(id);
    },
    // 开始游戏
    begin: function () {
      // 开始时间
      this.beginTime = new Date();
      // 绑定事件
      this.bindCells();
      // 隐藏所有格子信息
      this.hideAll();
    },
    // 结束游戏
    end: function () {
      // 解除事件
      this.disableAll();
      // 展示所有格子信息
      this.showAll();
      // 若存在结束回调函数，则调用
      if (this.endCallBack) {
        this.endCallBack();
      }
    },
    // 成功
    success: function () {
      this.end();
      alert("Congratulations!");
    },
    // 失败
    failed: function () {
      this.end();
      alert("GAME OVER");
    },
    // 入口
    play: function () {
      // 初始化
      this.init();
      // 使地雷为9
      this.landMine();
      // 计算其他格子数值
      this.calculateNoLandMine();
    },
  };
  // 将JMS函数设置为全局函数
  window.JMS = JMS;
})();