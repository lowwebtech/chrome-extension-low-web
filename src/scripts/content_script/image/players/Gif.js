import { GIPHY_TOKEN } from '../../../constants';
import GifPlayer from './GifPlayer';
import GiphyPlayer from './GiphyPlayer';

(function() {
  let giphies = [];
  let gifs = [];

  let imgs = document.querySelectorAll('img');
  let gif;
  imgs.forEach(img => {
    if (img.src.indexOf('.giphy.com/media') !== -1) {
      giphies.push(new GiphyPlayer(img));
    } else if (img.src.indexOf('.gif') !== -1) {
      // TODO add animated webp
      gif = new GifPlayer(img);
      gif.start();
      gifs.push(gif);
    }
  });

  let iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    if (iframe.src.indexOf('giphy.com/embed/') !== -1) {
      giphies.push(new GiphyPlayer(iframe));
    }
  });

  if (giphies.length > 0) {
    let ids = [];
    giphies.forEach(giphy => {
      ids.push(giphy.id);
    });
    fetch('https://api.giphy.com/v1/gifs?api_key=' + GIPHY_TOKEN + '&ids=' + ids.toString())
      .then(function(response) {
        if (response.status !== 200) {
          console.warn('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function(data) {
          data.data.forEach((gifdata, index) => {
            giphies[index].setData(gifdata);
          });
          window.lowComputeStyles();
        });
      })
      .catch(function(err) {
        console.warn('Fetch Error :-S', err);
      });
  }
})();
