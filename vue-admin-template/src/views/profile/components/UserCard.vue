<template>
  <el-card style="margin-bottom:20px;">
     <el-dialog title="SIM Details" :visible.sync="simFormVisible" width="70%" >
      <div id="app" style="">                                        
          <div style="width: 100%; height:300px;  display: inline-block;">
              <vue-cropper              
                  @ready="doSomethingOnReady()"
                  ref='cropper'
                  :guides="true"
                  :view-mode="2"
                  drag-mode="crop"
                  :auto-crop-area="0.5"
                  :min-container-width="200"
                  :min-container-height="200"
                  :max-container-width="200"
                  :max-container-height="200"
                  :background="true"
                  :rotatable="true"
                  :src="imgSrc"
                  :aspect-ratio="1/1"
                  alt="Source Image"
                  :img-style="{ 'width': '100%', 'height': '300px' }">
              </vue-cropper>
          </div>                    
          <el-container>
              <el-row :gutter="16">
                <el-col :xs="24" :sm="12" class="pt-20">
                  <el-button     
                       type="primary"          
                        class="dark-btn" 
                        @click="rotate" v-if="imgSrc != ''">
                        Rotate
                      </el-button>
                  </el-col>
                  <el-col  :xs="24" :sm="12" class="pt-20">
                      <el-button  
                         type="primary"             
                          class="blue-btn" 
                          @click="cropImage" v-if="imgSrc != ''">
                          Crop
                      </el-button>
                  </el-col>
              </el-row>
          </el-container>
      </div>
     </el-dialog>
  
    <div class="user-profile">
      <div class="box-center">

        <div @mouseover="photoTransparent=true" @mouseout="photoTransparent=false" >
          <image-uploader
              :preview="false"
              :className="['fileinput', { 'fileinput--loaded': hasImage }]"
              capture="environment"
              :debug="1"
              doNotResize="gif"
              :autoRotate="true"
              outputFormat="verbose"
              @input="setImage"
          >
              <label for="fileInput" class="upload-label animated delay-0.1s" slot="upload-label">
                  <img class="prf-img upload-transparent cursor-pointer" src="/images/icon_photo.png" 
                  :style="photoTransparent ? 'display:block' : 'display:none'" 
                  :class="photoTransparent ? 'fadeIn' : 'fadeOut'"/>                          
                  <img class="prf-img" :src="'http://localhost:3000/avatar.png'" alt="">                           
                  <span class="upload-caption">{{
                      hasImage ? "" : ""
                  }}</span>
              </label>
          </image-uploader>
      </div>  
      </div>
      <div class="box-center align-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.org }}</div>
      </div>
    </div>

    
  </el-card>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import PanThumb from '@/components/PanThumb'

export default {
  data() {
      return {
          simFormVisible: false,
          imgSrc: '',
          cropImg: '',
          msg: "Vue Image Upload and Resize Demo",
          photoTransparent: false,
          hasImage: false,
          image: null,
          //cropper: null,
          form: {                
              
          },
          links: [
              {
                  text: 'Vehicles',
                  to: {pager: 'search'}
              },
              {
                  text: 'test',
                  active: true
              }
          ]
      }
  },   
  components: { PanThumb, VueCropper },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: '',
          org: ''
        }
      }
    }
  },
  methods: {
    setImage: function(output) {
        this.hasImage = true;
        this.image = output;
        this.imgSrc = output.dataUrl;
        
        
        
        this.simFormVisible = true  
        //this.$refs['modal-center'].show();
    },
    doSomethingOnReady() {
      console.log(this.$refs['cropper'])
      this.$refs['cropper'].replace(this.imgSrc);      
    },
    cropImage() {
        this.cropImg = this.$refs['cropper'].getCroppedCanvas().toDataURL();
        this.simFormVisible = false 
        var data = {
            id: 'IMEI_',
            photo: this.cropImg,
        }
        //console.log(data)
        //this.$store.dispatch('uploadPhoto', data);
        this.uploadPhoto(data)
    },
    async uploadPhoto(payload){          
        var urlUploadPhoto = "http://upload.quiktrak.co/image/Upload";   

        var bodyFormData = new FormData();
        bodyFormData.set('id', payload.id);
        bodyFormData.set('data', payload.photo);
        console.log(payload.photo)
        /*
        await axios({
          method: 'post',
          url: urlUploadPhoto,
          data: bodyFormData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
          } 
        })
        .then(response => { 
          //this.commit('setTempPhoto', response);
        }).catch (e => {
          console.log('er1', e);
        });*/
      },
    rotate() {
        this.$refs['cropper'].rotate(90);
    },  
  }
}
</script>

<style lang="scss" scoped>
.profile-page .box-center {
  margin: 0 auto;
  display: table;
}

.profile-page .text-muted {
  color: #777;
}

.profile-page .user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.profile-page .user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}




.profile-page .upload-label{
    margin-bottom: 0 !important;
}

.profile-page .upload-caption {
    position: absolute;
}

.profile-page .upload-transparent {
    position: absolute;
    opacity: 0.8;
}

.profile-page .prf-img{
  width: 100%;
}

</style>
