<template>
  <div class="home">
      <el-container>
        <video id="local-video" autoplay muted></video>
<!--        <video id="remote-video" autoplay controls></video>-->
      </el-container>
      <div class="box">
        <el-tag>本地id：{{localPeerId}}</el-tag>
        <div class="input-content">
          <el-input placeholder="请输入内容" v-model="remotePeerId">
            <template slot="prepend">对方id</template>
          </el-input>
        </div>
        <el-button type="primary" @click="connectRemote">连接</el-button>
        <el-button type="success" @click="liveChats">发起视频</el-button>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import peer from "peerjs";
export default {
  name: 'Home',
  data() {
    return {
      stream: null,
      localStream: null,
      peerIns: null,
      localPeerId: null,
      remotePeerId: ''

    }
  },
  mounted() {
      let _this = this;
      this.getLocalVideo((stream) => {
          _this.localStream = stream;
          _this.recStream(stream, "local-video");
      }, (err) => {
          console.log(err);
      });
      this.peerIns = new peer('live-id',{
          host: '116.62.177.171',
          port: 9000,
          path: '/peerjs/myapp'
      });
      this.peerIns.on('open', (id) => {
          _this.localPeerId = id;
      });
      console.log(this.peerIns);

      //监听连接
      this.peerIns.on('connection', (conn) => {
          conn.on('data', (data) => {
              this.remotePeerId = data;
              this.liveChats();
          });
      });

      //监听视频
      this.peerIns.on('call', (call) => {
          call.answer(_this.localStream);
          call.on('stream', (stream) => {
              _this.stream = stream;
              _this.recStream(stream, 'remote-video');
          });
      });
      //断开视频连接
      this.peerIns.on('close', () => {
          this.$meesage({
              type: 'error',
              message: '对方已断开~',
              duration: 0
          });
      });


  },
  methods: {
      liveChats() {
          let _this = this;
          let call = this.peerIns.call(this.remotePeerId, this.localStream);
          call.on('stream', (stream) => {
              _this.stream = stream;
              _this.recStream(stream, 'remote-video');
          });
      },
      getLocalVideo(success, error) {
          let constraints = {
              audio: true,
              video: true
          }
          /*navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          navigator.getUserMedia(contrains, callbacks.success, callbacks.error);*/
          console.log(navigator);
          console.log(navigator.mediaDevices);
          navigator.mediaDevices.getUserMedia(constraints)
              .then(success)
              .catch(error);
      },
      recStream(stream, elemId) {
          let video = document.getElementById(elemId);
          video.srcObject = stream;
          this.stream = stream;
      },
      connectRemote() {
          if (this.remotePeerId.trim().length) {
              let conn = this.peerIns.connect(this.remotePeerId);
              conn.on('open', () => {
                  conn.send(this.localPeerId);
              });
          }

      }

  }
}
</script>
<style lang="scss" scoped>
  .box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    .input-content {
        margin: 10px 5px;
    }
  }
</style>
