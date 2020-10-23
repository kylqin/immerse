export function enterFullscreen() {
  const de: any = document.documentElement;
  if (de.requestFullscreen) {
    de.requestFullscreen();
  } else if (de.mozRequestFullscreen) {
    de.mozRequestFullscreen();
  } else if (de.webkitRequestFullscreen) {
    de.webkitRequestFullscreen();
  } else if (de.msRequestFullscreen) {
    de.msRequestFullscreen();
  }

  // this.setState({ isFullscreen: true });
  // OtherUtil.setReaderConfig("isFullscreen", "yes");
}

// 退出全屏模式
export function exitFullscreen() {
  // 解决使用esc退出全屏，再退出阅读时发生的 bug
  if (!document.fullscreenElement) {
    return;
  }

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullscreen) {
    document.mozCancelFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }

  // this.setState({ isFullscreen: false });
  // OtherUtil.setReaderConfig("isFullscreen", "no");
}
