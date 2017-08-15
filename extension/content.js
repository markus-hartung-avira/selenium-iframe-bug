function addFrame(id, src) {
  let iframe = document.createElement('iframe');
  iframe.id = id;
  iframe.setAttribute('src', src);
  document.body.appendChild(iframe);
}

addFrame('normalSrcAddedByExtension', 'http://example.com')
addFrame('extensionSrcAddedByExtension', chrome.extension.getURL('iframe.html'))
