import {Component, h, Element, Prop, Method, Event, EventEmitter, State} from '@stencil/core';

const iframes = [];

@Component({
  tag: "yt-iframe",
  styleUrl: "yt-iframe.css",
  shadow: true
})
export class YtIframe {

  iframe!: HTMLElement;

  @Prop({reflect: true, mutable: true}) videoId: string;
  @Prop({reflect: true, mutable: true}) width: string;
  @Prop({reflect: true, mutable: true}) height: string;

  @State() load = true;

  @Event({
    eventName: 'readyIframe',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) readyIframe: EventEmitter;

  player;

  @Method() play(video:string):void {
    if(video) {
      const VID_REGEX = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const resolveVideo = video.match(VID_REGEX)[1];
        this.player.loadVideoById( resolveVideo );
      this.videoId = video;
    } else {
      this.player.playVideo();
    }
  }

  @Method() stop():void {
    this.player.stopVideo();
  }
  
  @Method() pause():void {
    this.player.pauseVideo();
  }

  render() {
    return (
      <host>
        <div id="player" ref={(el) => this.iframe = el as HTMLElement}></div>
      </host>
    )
  }

  componentDidLoad() {
    iframes.push(this);

    this.ready();
  }

  onPlayerReady() {
    this.readyIframe.emit();
    this.load = false;
  }

  ready() {

    window.onload = () => {

      if (!document.querySelector('script[src*="youtube"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window['onYouTubeIframeAPIReady'] = () => {
          iframes.map(iframe => {
            iframe.player = new window['YT'].Player(iframe.iframe, {
              height: iframe.height ? iframe.height : '360',
              width: iframe.width ? iframe.width: '640',
              videoId: iframe.videoId ? iframe.videoId : 'M7lc1UVf-VE',
              events: {
                'onReady': iframe.onPlayerReady.bind(this),
              }
            });
            console.log(iframe);
          })
        };
      }
    }
  }



}
