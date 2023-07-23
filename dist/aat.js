function s(i, e, t) {
  return Math.min(Math.max(i, e), t);
}
function p({ from: i, to: e, percentage: t, unit: n }) {
  return i + (e - i) * t + (n || "");
}
const a = {
  offsetBottom: 0,
  offsetTop: 0,
  offsetRight: 0,
  offsetLeft: 0,
  addWrapper: !1,
  wrapperClass: "",
  container: document.documentElement
};
class r {
  static Container(e = document.documentElement) {
    return new h(e);
  }
  static Element(e, t) {
    return new _(e, { ...a, ...t });
  }
  onScroll(e) {
    this._handler = e, this._onScroll();
  }
}
class h extends r {
  constructor(e) {
    super(), this._container = e, (e === document.documentElement ? window : e).addEventListener("scroll", this._onScroll.bind(this));
  }
  _onScroll() {
    const e = this._container.scrollTop, t = this._container.scrollHeight - this._container.clientHeight, n = s(e / t, 0, 1) || 0, o = this._container.scrollLeft, c = this._container.scrollWidth - this._container.clientWidth, l = s(o / c, 0, 1) || 0;
    this._handler && typeof this._handler == "function" && requestAnimationFrame(() => this._handler({ percentageY: n, percentageX: l }));
  }
}
class _ extends r {
  constructor(e, t) {
    super(), this._element = e, this._options = t, this._lastPercentageY = null, this._lastPercentageX = null, this._options.addWrapper && this._addWrapper(), (this._options.container === document.documentElement ? window : this._options.container).addEventListener("scroll", this._onScroll.bind(this)), requestAnimationFrame(() => this._onScroll());
  }
  _addWrapper() {
    this._wrapper = document.createElement("div"), this._options.wrapperClass && this._wrapper.classList.add(this._options.wrapperClass), this._element.parentNode.insertBefore(this._wrapper, this._element), this._wrapper.appendChild(this._element);
  }
  get _containerClientHeight() {
    return this._options.container === window ? window.innerHeight : this._options.container.clientHeight;
  }
  get _containerClientWidth() {
    return this._options.container === window ? window.innerWidth : this._options.container.clientWidth;
  }
  get _elRectRelativeToContainer() {
    const t = (this._options.addWrapper ? this._wrapper : this._element).getBoundingClientRect();
    if (this._options.container === document.documentElement)
      return t;
    const n = this._options.container.getBoundingClientRect();
    return {
      width: t.width,
      height: t.width,
      left: t.left - n.left,
      top: t.top - n.top,
      right: t.right - n.right,
      bottom: t.bottom - n.bottom
    };
  }
  _calculatePercentageY() {
    const e = this._elRectRelativeToContainer, t = this._containerClientHeight - this._options.offsetBottom, n = this._options.offsetTop, o = t - n;
    return s((t - e.top) / o, 0, 1);
  }
  _calculatePercentageX() {
    const e = this._elRectRelativeToContainer, t = this._containerClientWidth - this._options.offsetRight, n = this._options.offsetLeft, o = t - n;
    return s((t - e.left) / o, 0, 1);
  }
  _onScroll() {
    const e = this._calculatePercentageY(), t = this._calculatePercentageX();
    this._handler && typeof this._handler == "function" && (this._lastPercentageY !== e || this._lastPercentageX !== t) && requestAnimationFrame(() => this._handler({ percentageY: e, percentageX: t })), this._lastPercentageY = e, this._lastPercentageX = t;
  }
}
export {
  r as ScrollObserver,
  p as valueAtPercentage
};
