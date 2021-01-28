import {enableProdMode, LOCALE_ID} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
  const umami = window.document.createElement('script')
  umami.async = true
  umami.defer = true
  umami.setAttribute('data-website-id', '9293c8fb-ba9f-4620-b650-4e7e1178d130')
  umami.src = 'https://umami.homela.top/umami.js'
  window.document.head.appendChild(umami)
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [{provide: LOCALE_ID, useValue: 'zh-CN'}]
})
  .catch(err => console.error(err));
