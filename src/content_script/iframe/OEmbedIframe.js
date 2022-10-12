import DOMPurify from 'dompurify'
import videoToBlock from '../../datas/videos-to-block'
import { localOption } from '../../utils/get-local-options'
import {
  getYoutubeId,
  getDailymotionId,
  getVimeoId,
} from '../../utils/get-video-id'
import sanitizeEmbedUrl from '../../utils/sanitize-embed-video-url'

/**
 * Custom video iframe
 */
let videoQuality = 1
export default class oEmbedIframe {
  constructor(el, style) {
    this.el = el
    this.style = style

    let src = el.src
    if (!src || src === '') {
      src = el.dataset.src
    }
    this.src = src

    localOption('video_quality').then((quality) => {
      videoQuality = quality
    })

    if (src) {
      this.type = videoBlocked(src)
      if (this.type !== false) {
        this.dataVideoBlock = videoToBlock[this.type]
        const id = getId(src, this.type)

        if (
          this.dataVideoBlock.video_url !== '' &&
          this.dataVideoBlock.oembed !== '' &&
          id
        ) {
          this.videoUrl = this.dataVideoBlock.video_url.replace('##ID##', id)

          if (this.videoUrl && this.dataVideoBlock.oembed) {
            const oembedUrl =
              this.dataVideoBlock.oembed +
              '?format=json&url=' +
              encodeURIComponent(this.videoUrl)

            const message = {
              message: 'oembed',
              data: {
                type: this.type,
                videoUrl: this.videoUrl,
                oembedUrl: oembedUrl,
              },
            }

            browser.runtime.sendMessage(message).then(
              (e) => this.onOEmbed(e),
              (e) => {
                console.error('error message iframe-to-load oembed', e)
              }
            )
          }
        }
      }
    }
  }

  onOEmbed(response) {
    if (response && response.data) {
      if (this.dataVideoBlock.skin) {
        // test parentNode, iframe may be removed from the dom
        if (this.el && this.el.parentNode) {
          this.data = response.data
          this.id = getId(this.el.src, this.type)

          const newIframe = document.createElement('iframe')
          // copy html attributes from original iframe
          // TODO limit to known attributes
          for (let i = 0; i < this.el.attributes.length; i++) {
            const a = this.el.attributes[i]
            if (a.name !== 'src') {
              newIframe.setAttribute(a.name, a.value)
            }
          }

          const skin = this.getSkin()
          newIframe.dataset.src = this.el.src
          newIframe.src =
            'data:text/html;charset=utf-8,' + encodeURIComponent(skin)
          this.el.parentNode.replaceChild(newIframe, this.el)

          const message = {
            message: 'logOptimised',
            data: {
              type: 'iframe-to-load',
              tabId: response.tabId,
              url: this.videoUrl,
            },
          }
          console.log('log iframe-to-load')
          browser.runtime.sendMessage(message).then(
            () => console.log('logged'),
            (e) => console.error('>>>>', e),
          )
        }
      }
    }
  }

  getSkin() {
    let skin = this.dataVideoBlock.skin

    const title = this.getTitle()
    const thumb = this.getThumb()
    const sanitizedUrl = sanitizeEmbedUrl(this.src, true, true, videoQuality)

    if (title) {
      skin = skin.replace('##TITLE##', title)
    }

    if (this.data.description) {
      skin = skin.replace('##DESCRIPTION##', this.data.description)
    }

    if (this.data.author_name) {
      skin = skin.replace('##AUTHOR##', this.data.author_name)
    }

    if (this.videoUrl) {
      if (this.videoUrl.indexOf(this.dataVideoBlock.embed_url) !== -1) {
        this.videoUrl = sanitizedUrl // sanitizeEmbedUrl(this.videoUrl, true, true, videoQuality)
        skin = skin.replace('_blank', '_self')
      }
      skin = skin.replace('##VIDEO_URL##', sanitizedUrl)
    }

    if (thumb) {
      let alt = ''
      if (this.videoUrl) alt = this.videoUrl
      skin = skin.replace(
        '##IMAGE##',
        '<img src="' + thumb + '" alt="' + alt + '" />',
      )
    }

    skin =
      '<style type="text/css">' +
      DOMPurify.sanitize(this.style) +
      '</style><div class="lowweb--' +
      DOMPurify.sanitize(this.type) +
      '"><div>' +
      DOMPurify.sanitize(skin) +
      '</div></div>'

    return skin
  }

  getThumb() {
    let thumb = this.data.thumbnail_url
    if (this.type === 'youtube') {
      thumb = thumb.replace('hqdefault', 'mqdefault')
    }
    // some oembed doesn't provide thumbnail_url
    if (!thumb && this.dataVideoBlock.image !== '') {
      thumb = this.dataVideoBlock.image.replace('##ID##', this.id)
    }
    return thumb
  }

  getTitle() {
    if (this.data.title) {
      return this.data.title
    }
  }
}

function videoBlocked(url) {
  const keys = Object.keys(videoToBlock)
  for (const key of keys) {
    if (url.indexOf(videoToBlock[key].embed_url) !== -1) {
      return key
    }
  }
  return false
}

function getId(url, type) {
  const u = new URL(url)
  const path = u.origin + u.pathname

  let id
  switch (type) {
    case 'youtube':
      id = getYoutubeId(path)
      break
    case 'vimeo':
      id = getVimeoId(path)
      break
    case 'dailymotion':
      id = getDailymotionId(path)
      break
    // case 'twitch':
    //   id = getTwitchId(path)
    //   break
    // case 'facebook':
    //   id = getFacebookId(url)
    //   break
  }
  return id
}
