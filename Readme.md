# low web extension (beta)

Reduce energy consumption and carbon footprint of your internet browsing.

- Chromium : [https://chrome.google.com/webstore/detail/low-web-extension/jllfpicflcigpegdmejghjhaehdiabfj](https://chrome.google.com/webstore/detail/low-web-extension/jllfpicflcigpegdmejghjhaehdiabfj) 
- Firefox : [https://addons.mozilla.org/fr/firefox/addon/low-web-extension/](https://addons.mozilla.org/fr/firefox/addon/low-web-extension/)

:green_heart::herb::deciduous_tree::evergreen_tree::earth_africa:



## Why ?

The Internet consumes about 8% of the electricity produced worldwide and emits 3 to 4% of total greenhouse gas emissions. Every request, every resource, every calculation, is small amounts of electricity consumed ... and we visit billions of pages, make billions of computer operations, load billions of terabytes... needing to run millions of servers, millions of antennas, millions of miles of fiber and especially devices like telephones always more powerful and ever more obsolete.

This extension aims to reduce our data and limit the energy consumption of our Internet browsing.

This extension affects electricity consumption when browsing the Internet but not during manufacturing. Manufacturing is the most energy consuming and polluting stage. So let's keep our phones and computers as long as possible !




## How ?

A browser extension allows you to block resources and modify the content of a page. So we can optimize some content, block what is not necessary and thus limit the number of requests, weight and computer operations.

First, you need a good blocker for ad/malware/tracker like uBlock Origin ([Chrome](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm), [Firefox](https://addons.mozilla.org/fr/firefox/addon/ublock-origin/)) or a browser like [Brave](https://brave.com/). 


### Video

More than 80% of the data transferred over the Internet are videos. This extension tries to limit their use and the quality of the videos: 

- when possible, the extension chooses a low video quality. For example on Youtube.com, the video will be played in 240p, 360p or 480p (Youtube, Vimeo, Dailymotion)
- embed video iframes are blocked and a light preview is displayed. The click on a preview opens the video on the original site or in the iframe. We use oEmbed to get informations about the videos (Youtube, Vimeo, Dailymotion, Facebook).
- remove autoplay and loop parameters for embed videos and native html &lt;video&gt;
- optionnaly block all requests of type: video *(default:false)*


### Image

Several optimizations are made on the images, some are blocked and some displayed in smaller sizes.

- block avatar images of many services including Gravatar, Discus, Twitter, Linkedin, Github, Pinterest, Reddit and [more...](https://github.com/lowwebtech/low-web-extension/blob/master/src/lists/avatar.txt)
- stop animated GIF and play them when hovering. An animated GIF force browser to re-render part of the screen, it consumes CPU/GPU processes.
- custom embeds for Giphy images. Original animated images are blocked and replaced by static images. Animated image is loaded and played when hovering.
- ~~remove biggest or hidpi images from srcset. This prevents the browser from loading images that are too big. *(only works with lazy-loaded images eg. data-srcset, data-lazysrcset. None lazyloaded images are loading already when the extension starts and it is not possible to stop loading them)*~~
- ~~add lazyloading to all images (native loading="lazy" or [fallback](https://github.com/verlok/lazyload))~~ *(not working due to browser restrictions, images are loading when extension start and it's not possible to stop them)*
- optionnaly block all requests of type: image *(default:false)*


### And more

- block different social embeds like Facebook like or share buttons. It mostly blocks scripts from embeds, so when possible embeds are still displayed and customized with injected css and when necessary datas are loaded from oEmbed.
- add the header `Save-data: on` to all requests (currently based on [Save-data: on](https://chrome.google.com/webstore/detail/save-data-on/nholpkfnmjbinlhcfihkhiehdaohlibg)). This header can be interpreted by websites to reduce weight of pages.
- optionnaly block all requests of type: font (+ urls from font services like Google Fonts) *(default:false)*
- disable css transition and animation *(default:false)* (:warning: break transitionend / animationend events :warning:)
- disable &lt;marquee&gt; animations :P



## Results

Some results of optimisations from [various test pages](https://lowwebtech.github.io/low-web-extension/) :

|        | with extension      | without extension     |      |
|--------|---------------------|-----------------------|------|
| video  | 456Kb / 22 requests | 4Mb / 107 requests    | ~89% |
| image  | 993Mb / 30 requests | 7.7Mb / 35 requests   | ~87% |
| social | 898Kb / 78 requests | 9.3Mb / 330 requests  | ~90% |
| giphy  | 213Kb / 31 requests | 12.3Mb / 34 requests  | ~98% |

*note 1: these pages are particularly favorable for optimizations*

*note 2: theses results are for firstload*

*note 3: extension adds requests to local files, it increased the number of requests especially for image*


## Installation

### Development

- load repository
- `npm install`
- `npm run watch` / `npm run build`
- open `chrome://extensions/`, enable Developer Mode and Load unpacked folder : `dist/`

Pages for tests : 
https://lowwebtech.github.io/low-web-extension/

## Details

Some detailed explanations about functionalities of Low extension.

### Low quality video

#### Youtube

The video quality of Youtube can only be changed automatically on the official website not in embed. A script is injected by the extension on youtube.com to adjust the quality according to the Video Quality parameter available in options repectively 240p, 320px, 480p for Very Low, Low, Medium. ([Youtube-tiny.js](https://github.com/lowwebtech/low-web-extension/blob/master/src/scripts/content_script/video/players/Youtube-tiny.js), [Youtube-small.js](https://github.com/lowwebtech/low-web-extension/blob/master/src/scripts/content_script/video/players/Youtube-small.js), [Youtube-medium.js](https://github.com/lowwebtech/low-web-extension/blob/master/src/scripts/content_script/video/players/Youtube-medium.js))

#### Vimeo

The extension changes the quality of Vimeo videos when they are embedded. A 'quality' parameter can be added to the url of a vimeo iframe (eg: https://player.vimeo.com/video/156045670?quality=360p).
This parameter is defined at 240p, 360p, 540p depending on the "Video Quality" option, respectively for Very Low, Low, Medium. 
We are looking for a solution to automatically change the quality on vimeo.com.

#### Dailymotion

Disabled for the moment.



### Click to load a video

Embed videos iframe from Youtube, Vimeo, Dailymotion and Facebook are blocked and replaced by the preview image of the video, its title and a Play button imitating the official players.
A click on these preview plays the video either on the official website, or in the iframe depending on the "Video Quality" parameter. Sometimes it is necessary to double click to launch the video.

Ex for original Youtube iframe:
- no cache ~ 550 / 600KB / 16 requests / load ~ 800ms
- cache ~ 20Ko / 16 requests / load ~ 650ms

Youtube iframe optimized:
- no cache ~ 20KB / 5 requests / load ~ 220ms
- cache ~ 7KB / 5 requests / load ~ 200ms

Technically, original iframe is [blocked](https://github.com/lowwebtech/low-web-extension/blob/master/src/scripts/background/block/block-embed-video.js) by extension, then an [script](https://github.com/lowwebtech/low-web-extension/blob/master/src/scripts/content_script/video/click-to-load.js) is injected for customising blocked iframe. It loads [oEmbed datas](https://github.com/lowwebtech/low-web-extension/blob/master/src/scripts/background/message/oembed.js) to get image and title of the video, then a new simple html (with image, title, button) is created and injected (data:text/html) into the new iframe.
More technical info soon...


## TODO
- listen dom change
- split content_script start/end/idle
- look at webrequest type to maybe block them : beacon, csp_report, ping, speculative, web_manifest, websocket, xbl, xml_dtd, xslt
- videos
    + look at https://stackoverflow.com/questions/31697212/youtube-api-cannot-change-video-quality
    + stop autoplay youtube (and all)
    + remove/hide HD/4K button from players
    + netflix
- add more oembed services https://oembed.com/
- message between background blocker and content_script for temporary white-list
- write tests
- lazyload optimized assets (gif/iframe)
- block chatbot
- custom print styles (better font, small size, no image or b&w...)
- images :
    + replace hi-res by low-res for image services
    + giphy
        * regex
        * more urls
        * use mp4
        * smaller sizes
    + cloudinary
        * q_auto / q_auto:low
        * smaller size
    + gif
        * detect if gif is animated
        * pause/resume on enter/leave
    + emoji
- webassembly
- smaller injected script and styles
- inject script and styles only when needed
- audit the extension to limit size and processes (init, reflow...)
- display advice/tips to reduce bandwidth for main websites
- display time alerts
- try to block popin when mouse leaves the viewport 

- CSP
- try to debounce/throttle events like resize/scroll...
- no smooth scroll scroll-behavior: initial / scrollTo(), scrollBy(), scrollIntoView() / jQuery / smooth-scrool libs
- look at cache-control and expire for header and response requests
- disable unoptimised hide/show/scroll jQuery, gsap etc...
- publish external list for blockers : avatar, font services, chatbot
- ~~remove call to fonts.googleapis.com, fontawesome.com and other services~~
- social
    ~~+ facebook regexp for country flag en_US/fr_FR....~~
    + mimic embed styles
    + look for side-effect
- add fallback for blocked ressources
- take into account connexion network type (wifi/ethernet or 3G/4G)
- take into account carbon footprint of user's electricity (-> co2signal.com)
- set css prefers-color-scheme to dark
    + look at DarkReader


### TODO add these websites
- netflix
- brightcove
- hulu
- ustream
- livestream
- gfycat
- imgur
- tenor
- linkedin
- cloudinary
- slideshare
- soundcloud
- medium
- and more https://oembed.com/#section7