import {enableProdMode, LOCALE_ID} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
  const umami = window.document.createElement('script')
  umami.async = true
  umami.defer = true
  umami.setAttribute('data-website-id', '9275873e-6855-44eb-866e-9a11f9cdfd65')
  umami.src = 'https://umami.homela.top/umami.js'
  window.document.head.appendChild(umami)
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [{provide: LOCALE_ID, useValue: 'zh-CN'}]
})
  .catch(err => console.error(err));
