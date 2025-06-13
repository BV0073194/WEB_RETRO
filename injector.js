fetch('https://raw.githubusercontent.com/BV0073194/WEB_RETRO/refs/heads/main/index.html')
  .then(res => res.text())
  .then(htmlText => {
    // Parse entire document
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Serialize the entire document back to a string
    const fullHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

    // Create iframe and style it fullscreen
    const iframe = document.createElement('iframe');
    iframe.id = 'web-retro-frame';
    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      border: 'none',
      margin: '0',
      padding: '0',
      zIndex: '9999'
    });
    document.body.appendChild(iframe);

    // Write full HTML into iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();

    // Listen for message from iframe to remove it
    window.addEventListener('message', event => {
      if (event.data && event.data.type === 'close-iframe') {
        iframe.remove();
      } else if (event.data && event.data.type === 'reload-iframe') {
        iframe.contentWindow.location.reload();
      }
    });

    // Also listen on main page for Escape as fallback
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        iframe.remove();
      }
    });
  })
  .catch(err => {
    console.error('Failed to load or inject HTML:', err);
  });
