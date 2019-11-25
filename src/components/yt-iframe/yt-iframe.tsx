import {Component, h} from '@stencil/core';

@Component({
  tag: "yt-iframe",
  styleUrl: "yt-iframe",

})
export class YtIframe {

  iframe!: HTMLElement;

  render() {
    return (
      <div id="player" ref={(el) => this.iframe = el as HTMLElement}></div>
    )
  }

  componentDidLoad() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    console.log(this.iframe);
    let player;
    window.onYouTubeIframeAPIReady = () => {
      player = new window["YT"].Player( this.iframe, {
        height: '360',
        width: '640',
        videoId: 'M7lc1UVf-VE',

      });
    }
  }



}
