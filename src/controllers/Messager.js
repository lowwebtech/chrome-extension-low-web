import { onMessageOEmbed } from '../background_script/message/oembed'
import { onMessageIsActive } from '../background_script/message/is-active'
import { onWhitelistHoverImage } from '../background_script/message/whitelist-image'

/**
 * Messager class is used to communicate between background and content scripts
 */
class Messager {
  constructor () {
    this.handlers = [onMessageOEmbed, onMessageIsActive, onWhitelistHoverImage]
  }

  init () {
    const handleIsMessage = (request, sender) => {
      if (request.message !== undefined) {
        console.log('MESSAGE', request.message)
        let response
        for (let i = 0, lg = this.handlers.length; i < lg; i++) {
          response = this.handlers[i](request, sender, sendResponse)
          if (response) break
        }

        return Promise.resolve(response)
      }
    }
    browser.runtime.onMessage.addListener(handleIsMessage)
  }
}

const messager = new Messager()
export default messager
