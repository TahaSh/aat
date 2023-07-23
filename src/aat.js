import { clamp } from './helpers'
export { valueAtPercentage } from './helpers'

const defaultOptions = {
  offsetBottom: 0,
  offsetTop: 0,
  offsetRight: 0,
  offsetLeft: 0,
  addWrapper: false,
  wrapperClass: '',
  container: document.documentElement
}

export class ScrollObserver {
  static Container(container = document.documentElement) {
    return new ContainerScrollObserver(container)
  }

  static Element(element, options) {
    return new ElementScrollObserver(element, { ...defaultOptions, ...options })
  }

  onScroll(handler) {
    this._handler = handler
    this._onScroll()
  }
}

class ContainerScrollObserver extends ScrollObserver {
  constructor(container) {
    super()
    this._container = container
    const scrollElement =
      container === document.documentElement ? window : container
    scrollElement.addEventListener('scroll', this._onScroll.bind(this))
  }

  _onScroll() {
    const currentScrollY = this._container.scrollTop
    const totalScrollY =
      this._container.scrollHeight - this._container.clientHeight
    const percentageY = clamp(currentScrollY / totalScrollY, 0, 1) || 0

    const currentScrollX = this._container.scrollLeft
    const totalScrollX =
      this._container.scrollWidth - this._container.clientWidth
    const percentageX = clamp(currentScrollX / totalScrollX, 0, 1) || 0

    if (this._handler && typeof this._handler === 'function') {
      requestAnimationFrame(() => this._handler({ percentageY, percentageX }))
    }
  }
}

class ElementScrollObserver extends ScrollObserver {
  constructor(element, options) {
    super()
    this._element = element
    this._options = options
    this._lastPercentageY = null
    this._lastPercentageX = null

    if (this._options.addWrapper) {
      this._addWrapper()
    }

    const scrollContainer =
      this._options.container === document.documentElement
        ? window
        : this._options.container
    scrollContainer.addEventListener('scroll', this._onScroll.bind(this))
    requestAnimationFrame(() => this._onScroll())
  }

  _addWrapper() {
    this._wrapper = document.createElement('div')
    if (this._options.wrapperClass) {
      this._wrapper.classList.add(this._options.wrapperClass)
    }
    this._element.parentNode.insertBefore(this._wrapper, this._element)
    this._wrapper.appendChild(this._element)
  }

  get _containerClientHeight() {
    return this._options.container === window
      ? window.innerHeight
      : this._options.container.clientHeight
  }

  get _containerClientWidth() {
    return this._options.container === window
      ? window.innerWidth
      : this._options.container.clientWidth
  }

  get _elRectRelativeToContainer() {
    const element = this._options.addWrapper ? this._wrapper : this._element
    const rect = element.getBoundingClientRect()
    if (this._options.container === document.documentElement) {
      return rect
    }
    const containerRect = this._options.container.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.width,
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      right: rect.right - containerRect.right,
      bottom: rect.bottom - containerRect.bottom
    }
  }

  _calculatePercentageY() {
    const rect = this._elRectRelativeToContainer
    const startPoint = this._containerClientHeight - this._options.offsetBottom
    const endPoint = this._options.offsetTop

    const viewHeight = startPoint - endPoint

    return clamp((startPoint - rect.top) / viewHeight, 0, 1)
  }

  _calculatePercentageX() {
    const rect = this._elRectRelativeToContainer
    const startPoint = this._containerClientWidth - this._options.offsetRight
    const endPoint = this._options.offsetLeft

    const viewWidth = startPoint - endPoint

    return clamp((startPoint - rect.left) / viewWidth, 0, 1)
  }

  _onScroll() {
    const percentageY = this._calculatePercentageY()
    const percentageX = this._calculatePercentageX()
    if (
      this._handler &&
      typeof this._handler === 'function' &&
      (this._lastPercentageY !== percentageY ||
        this._lastPercentageX !== percentageX)
    ) {
      requestAnimationFrame(() => this._handler({ percentageY, percentageX }))
    }
    this._lastPercentageY = percentageY
    this._lastPercentageX = percentageX
  }
}
