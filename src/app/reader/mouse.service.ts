import { Injectable } from '@angular/core';
import { ReaderService } from './reader.service';

@Injectable({
  providedIn: 'root'
})
export class MouseService {
  private unbindEvent: () => void;

  constructor(private readerService: ReaderService) { }

  bind(epub: any, isScrollMode: boolean) {
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    let lock = false; // 暂时锁住翻页快捷键，避免快速点击产生的Bug
    const arrowKeys = (event: any) => {
      // event.preventDefault();
      if (lock) {
        return;
      }

      if (event.keyCode === 37 || (event.keyCode === 38 && !isScrollMode)) {
        epub.rendition.prev();
        lock = true;
        setTimeout(() => {
          lock = false;
        }, 100);
        return false;
      }
      if (event.keyCode === 39 || (event.keyCode === 40 && !isScrollMode)) {
        epub.rendition.next();
        lock = true;
        setTimeout(() => {
          lock = false;
        }, 100);
        return false;
      }
    };
    const mouseFirefox = (event: any) => {
      event.preventDefault();
      if (lock) {
        return;
      }
      if (event.detail < 0) {
        epub.rendition.prev();
        lock = true;
        setTimeout(() => {
          lock = false;
        }, 100);
        return false;
      }
      if (event.detail > 0) {
        epub.rendition.next();
        lock = true;
        setTimeout(() => {
          lock = false;
        }, 100);
        return false;
      }
    };

    const mouseChrome = (event: any) => {
      if (lock) {
        return;
      }
      if (event.wheelDelta > 0) {
        epub.rendition.prev();
        lock = true;
        setTimeout(() => {
          lock = false;
        }, 100);
        return false;
      }
      if (event.wheelDelta < 0) {
        epub.rendition.next();
        lock = true;
        setTimeout(() => {
          lock = false;
        }, 100);
        return false;
      }
    };

    // const gesture = (event: any) => {
    //   if (lock) {
    //     return;
    //   }
    //   if (event.type === 'panleft' || event.type === 'panup') {
    //     epub.rendition.next();
    //     lock = true;
    //     setTimeout(() => {
    //       lock = false;
    //     }, 100);
    //     return false;
    //   }
    //   if (event.type === 'panright' || event.type === 'pandown') {
    //     epub.rendition.prev();
    //     lock = true;
    //     setTimeout(() => {
    //       lock = false;
    //     }, 100);
    //     return false;
    //   }
    // };

    const bindEvent = (doc: any) => {
      window.addEventListener('keydown', arrowKeys);
      doc.addEventListener('keydown', arrowKeys); // 箭头按键翻页
      // 鼠标滚轮翻页
      if (!isScrollMode) {
        if (isFirefox) {
          doc.addEventListener('DOMMouseScroll', mouseFirefox, false);
        } else {
          doc.addEventListener('mousewheel', mouseChrome, false);
        }
      }

      this.unbindEvent = () => {
        window.removeEventListener('keydown', arrowKeys);
        doc.removeEventListener('keydown', arrowKeys); // 箭头按键翻页
        // 鼠标滚轮翻页
        if (isFirefox) {
          doc.removeEventListener('DOMMouseScroll', mouseFirefox, false);
        } else {
          doc.removeEventListener('mousewheel', mouseChrome, false);
        }
      };
    };

    epub.rendition.on('rendered', () => {
      const iframe = document.getElementsByTagName('iframe')[0];
      if (!iframe){
        return;
      }
      const doc = iframe.contentDocument;
      if (!doc) {
        return;
      }

      // if (OtherUtil.getReaderConfig('isTouch') === 'yes') {
      //   const mc = new Hammer(doc);
      //   mc.on('panleft panright panup pandown', (event: any) => {
      //     gesture(event);
      //   });
      // }

      if (this.unbindEvent) {
        this.unbindEvent();
      }
      bindEvent(doc);
    });
  }

  unbind() {
    if (this.unbindEvent) {
      this.unbindEvent();
    }
  }
}
