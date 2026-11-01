import '@testing-library/jest-dom/vitest'

// jsdom lacks native <dialog> modal methods.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {}
