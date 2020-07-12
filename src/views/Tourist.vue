<template>
  <div class="tourist-main">
    <h1>直播间</h1>
    <div class="tourist-box">
      <video id="remote-video" autoplay width="375" height="667"></video>
      <div class="tourist-btn">
      </div>
    </div>
  </div>
</template>
<script>
  import peer from "peerjs";
  export default {
      name: 'Tourist',
      data() {
        return {
          peerIns: null,
          localPeerId: 'tourist-id',
          remotePeerId: 'live-id',
          stream: null

        }
      },
      mounted() {
          let _this = this;
          this.peerIns = new peer(_this.localPeerId, _this.$config.peerServer);
          //开启
          this.peerIns.on('open', (id) => {
              console.log(id);
          });
          //连接直播间
          setTimeout(() => {
              _this.connectRemote();
          }, 500);

          //监听连接
          this.peerIns.on('connection', (conn) => {
            conn.on('data', (data) => {
                console.log('data: '+data);
            });
          });

          //监听视频
          this.peerIns.on('call', (call) => {
              console.log(call);
              call.answer(_this.localStream);
              call.on('stream', (stream) => {
                _this.stream = stream;
                _this.recStream(stream, 'remote-video');
              });
          });

      },
      methods: {
          recStream(stream, elemId) {
              let video = document.getElementById(elemId);
              video.srcObject = stream;
              this.stream = stream;
          },
          connectRemote() {
              console.log(this.peerIns);
              let _this = this;
              let conn = this.peerIns.connect('live-id');
              conn.on('open', () => {
                  console.log('建立连接');
                  conn.send(this.localPeerId);
              });

          }
      }


  }

</script>
<style lang="scss" scoped>
  .tourist-box {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

</style>