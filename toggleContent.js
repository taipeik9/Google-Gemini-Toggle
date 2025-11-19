const s = document.createElement("script");
s.src = browser.runtime.getURL("toggleInject.js");
document.head.appendChild(s);
s.remove();
