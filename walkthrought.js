var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length - 1].src;
var iconsUrl = currentScriptPath.replace(new RegExp("js-walkthrough.js.*"), 'js-walkthrough/icons/');

var walkthrough = {
  attrs: {},
  content: [],
  mainDiv: null,
  opts: {
    cursor: 0,
    enabled: true,
    debug: false,
    iconsSize: 100,
    gotIt: 'Got It !',
    fadeOutOpacity: 0.85
  },
  onFinish: null,

  init: function (content) {
    this.content = content;
  },
  options: function (opts) {
    if (opts.debug != null) this.opts.debug = opts.debug;
    if (opts.gotIt != null) this.opts.gotIt = opts.gotIt;
    if (opts.iconsSize != null) this.opts.iconsSize = opts.iconsSize;
    if (opts.fadeOutOpacity != null) this.opts.fadeOutOpacity = opts.fadeOutOpacity;
    this.debug(this.opts);
  },
  start: function () {
    this.debug('start');

    this.mainDiv = document.createElement('div');
    this.mainDiv.setAttribute("id", "walthrought-main");
    document.body.appendChild(this.mainDiv);

    this.showWalkThrought();
  },
  debug: function (text) {
    if (this.opts.debug)console.log(text);
  },
  showWalkThrought: function () {
    this.debug('showWalkThrought');

    var elmToFind = this.content[this.opts.cursor];
    this.debug(elmToFind);

    if (elmToFind != null) {
      var placeToShow = document.getElementById(String(elmToFind.id));
      if (elmToFind.fadeOut != null && elmToFind.fadeOut == true) {
        if (placeToShow != null) {
          var coord = this.getCoord(placeToShow);
          this.fadeOutPlace(coord);
        }
      }
      if (this.content[this.opts.cursor].showIcon) {
        this.showIcon(coord);
      }
      if (this.content[this.opts.cursor].text) {
        this.showText(this.content[this.opts.cursor].text);
      }
      this.showGotItButton();
    }
  },
  clickGotIt: function () {
    if (this.opts.cursor < this.content.length) {
      this.opts.cursor++;
      this.clearMainDiv();
      this.showWalkThrought();
    }
    else {
      if (this.onFinish != null) {
        this.onFinish();
      }
    }
  },
  clearMainDiv: function () {
    this.mainDiv.innerHTML = '';
  },
  getCoord: function (element) {
    this.debug('getCoord');
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    var left = element.offsetLeft;
    var top = element.offsetTop;
    return {top: top, left: left, height: height, width: width};
  },
  fadeOutPlace: function (coord) {
    // create 4 rect
    var docSize = {
      height: window.outerHeight,
      width: window.outerWidth
    };

    var rects = {
      top: {
        top: 0,
        left: 0,
        height: coord.top,
        width: docSize.width
      },
      left: {
        top: 0,
        left: 0,
        height: docSize.height,
        width: coord.left
      },
      right: {
        top: coord.top,
        left: coord.width + coord.left,
        height: docSize.height - coord.top,
        width: docSize.width - (coord.width + coord.left)
      },
      bottom: {
        top: coord.top + coord.height,
        left: coord.left,
        height: docSize.height - (coord.top + coord.height),
        width: coord.width
      }
    };
    this.debug(rects);
    this.showRect(rects.top);
    this.showRect(rects.left);
    this.showRect(rects.right);
    this.showRect(rects.bottom);
  },
  showRect: function (coord) {
    var elm = '<div ' +
      'style="' +
      'position: fixed;' +
      'width:' + coord.width + 'px;' +
      'height:' + coord.height + 'px;' +
      'top:' + coord.top + 'px;' +
      'left:' + coord.left + 'px;' +
      'background-color:rgba(0, 0, 0, ' + this.opts.fadeOutOpacity + ');' +
      'z-index:99999;' +
      '"></div>';

    this.appendElm(elm);
  },
  showIcon: function (coord) {
    this.debug('showIcon');

    var position = {
      top: coord.top + coord.height / 2,
      left: coord.left + coord.width / 2
    };

    var iconType = this.content[this.opts.cursor].icon || 'single_tap';
    console.log(iconType);
    var iconPath = this.getIcon(iconType);

    var elm = '<img ' +
      'id="icon-walthrought" ' +
      'src="' + iconPath + '" ' +
      'style="' +
      'position: fixed;' +
      'top:' + position.top + 'px;' +
      'left:' + position.left + 'px;' +
      'width:' + this.opts.iconsSize + 'px;' +
      'z-index:99999;"' +
      '/>';

    console.log(elm);
    this.appendElm(elm);
  },
  appendElm: function (elm) {
    this.debug(elm);
    var wrapper = document.createElement('div');
    wrapper.innerHTML = elm;
    this.mainDiv.appendChild(wrapper);
  },
  getIcon: function (icon) {
    var retval = null;
    switch (icon) {
      case ("single_tap"):
        retval = iconsUrl + "Single_Tap.png";
        break;
      case ("double_tap"):
        retval = iconsUrl + "Double_Tap.png";
        break;
      case ("swipe_down"):
        retval = iconsUrl + "Swipe_Down.png";
        break;
      case ("swipe_left"):
        retval = iconsUrl + "Swipe_Left.png";
        break;
      case ("swipe_right"):
        retval = iconsUrl + "Swipe_Right.png";
        break;
      case ("swipe_up"):
        retval = iconsUrl + "Swipe_Up.png";
        break;
      case ("arrow"):
        retval = ""; //Return nothing, using other dom element for arrow
        break;
    }
    if (retval == null && icon && icon.length > 0) {
      retval = icon;
    }
    return retval;
  },
  showGotItButton: function () {
    this.debug('showGotItButton');

    var elm = '<button ' +
      'id="walktrhought-go-it"' +
      'style="' +
      'position:fixed;' +
      'z-index: 2147483647;' +
      'bottom:10px;' +
      'right:10px;"' +
      '>' + this.opts.gotIt + '</button>';

    this.appendElm(elm);

    var self = this;
    document.getElementById("walktrhought-go-it").addEventListener("click",
      function () {
        self.clickGotIt();
      });
  },
  showText: function (text) {
    this.debug(text);

    var elm = '<div ' +
      'id="walktrhought-text"' +
      'style="' +
      'position:fixed;' +
      'color:white;' +
      'z-index: 2147483647;' +
      'bottom:10px;' +
      'margin-right:60px;' +
      'left:10px;"' +
      '>' + text + '</div>';

    this.appendElm(elm);
  }
};
