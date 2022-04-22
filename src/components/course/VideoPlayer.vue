<template>
  <div class="prism-player" id="player-con"></div>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    src: String,
  },
  mounted() {
    this.initVideoPlayer();
  },
  methods: {
    initVideoPlayer() {
      console.log(this.src);
      var player = new Aliplayer(
        {
          id: "player-con",
          source: this.src,
          width: "100%",
          height: "500px",
          autoplay: true,
          isLive: false,
          // "cover": "http://outin-6a80578fa81811ec8a7900163e12ac16.oss-cn-shenzhen.aliyuncs.com/c440b9d382ff4c36b4d0bfd8773488ee/snapshots/f2163ca6abf44a86a511b9e0661b5e49-00001.jpg?Expires=1648714260&OSSAccessKeyId=LTAI4FocoL6tuCdYhuvug6Ee&Signature=JB8VZ2AAJg1f5gFlu9QdtaNuRH0%3D",
          rePlay: false,
          playsinline: true,
          preload: true,
          controlBarVisibility: "hover",
          useH5Prism: true,
          skinLayout: [
            {
              name: "bigPlayButton",
              align: "blabs",
              x: 130,
              y: 50,
            },
            {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 0,
              children: [
                {
                  name: "progress",
                  align: "blabs",
                  x: 0,
                  y: 44,
                },
                {
                  name: "playButton",
                  align: "tl",
                  x: 15,
                  y: 12,
                },
                {
                  name: "timeDisplay",
                  align: "tl",
                  x: 10,
                  y: 7,
                },
                {
                  name: "fullScreenButton",
                  align: "tr",
                  x: 10,
                  y: 12,
                },
                {
                  name: "subtitle",
                  align: "tr",
                  x: 15,
                  y: 12,
                },
                {
                  name: "setting",
                  align: "tr",
                  x: 15,
                  y: 12,
                },
                {
                  name: "volume",
                  align: "tr",
                  x: 5,
                  y: 10,
                },
              ],
            },
          ],
        },
        function (player) {
          console.log(player);
        }
      );
    },
  },
};
</script>

<style>
  .prism-player {
    height: 600px !important;
  }
@media (max-width: 450px) {
  .prism-player {
    height: 200px !important;
  }
}
</style>
