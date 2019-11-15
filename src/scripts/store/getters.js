import jsonOptions from './options.json'

const getters = {}
for( let i = 0, lg = jsonOptions.length; i<lg; i++ ){
  let o = jsonOptions[i]
  getters[o.id] = state => parseInt(state[o.id]);
}

getters.active = state => state.active
getters.pausedWebsites = state => state.pausedWebsites
getters.pausedPages = state => state.pausedPages

getters.isPagePaused = state => {
  // console.log('#######isPagePaused', state.url)
  // console.log('#######isPagePaused', state.pausedPages)
  return state.pausedPages.indexOf( state.url ) != -1
}
getters.isWebsitePaused = state => {
  // console.log('state.hostname', state.hostname)
  // console.log('state.pausedWebsites', state.pausedWebsites)
  // console.log('isWebsitePaused', state.pausedWebsites.indexOf( state.url ) != -1)
  return state.pausedWebsites.indexOf( state.hostname ) != -1
}
getters.isActive = (state, getters) => {
  
  // console.log('---------')
  // console.log('url', state.url)
  // console.log('global active', state.active)
  // console.log('isPagePaused', getters.isPagePaused)
  // console.log('pausedPages', state.pausedPages)
  // console.log('isWebsitePaused', getters.isWebsitePaused)
  // console.log('pausedWebsites', state.pausedWebsites)
  // console.log('---------')

  if( state.active 
    && ! getters.isPagePaused
    && ! getters.isWebsitePaused ){
    return true
  }else{
    return false
  }
}

export default getters