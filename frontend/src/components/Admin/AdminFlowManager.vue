<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">Instance Information</span>
          </div>
        </template>

          <el-row style="justify-content: center;">
            <div class="card-icon" style='{ backgroundColor: "#e67e2266" }'>
                <i>i</i>
            </div>
          </el-row>
            <div style="padding: 6px">
            <span class="card-title"> Status: </span>
            <el-tag class="ml-2" type="success">{{isRunning}}</el-tag>
            </div>
            <div style="padding: 6px">
            <span class="card-title">Port :</span>
            <span class="card-title" style="font-weight: bold;">{{port }}</span>
          </div>
          <div style="padding: 6px">
            <span class="card-title">Address :</span>
            <span class="card-title" style="font-weight: bold;">{{address }}</span>

          </div>

      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
        <template #header>
          <div class="card-header" id="instruction">
            <span class="card-title"
              >You can manage all the flows from Node Red, please for the
              instruction in order for proper deployment</span
            >
            <el-popover
              :width="300"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
            >
              <template #reference>
                <el-avatar src="./assets/i.png" />
              </template>
              <template #default>
                <div
                  class="demo-rich-conent"
                  style="display: flex; gap: 16px; flex-direction: column"
                >
                  <el-avatar
                    :size="60"
                    src="https://avatars.githubusercontent.com/u/72015883?v=4"
                    style="margin-bottom: 8px"
                  />
                  <div>
                    <p
                      class="demo-rich-content__name"
                      style="margin: 0; font-weight: 500"
                    >
                      Element Plus
                    </p>
                    <p
                      class="demo-rich-content__mention"
                      style="
                        margin: 0;
                        font-size: 14px;
                        color: var(--el-color-info);
                      "
                    >
                      @element-plus
                    </p>
                  </div>

                  <p class="demo-rich-content__desc" style="margin: 0">
                    Element Plus, a Vue 3 based component library for
                    developers, designers and product managers
                  </p>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
        <iframe
          :src=instanceSrc
          class="myIfr"
          frameborder="0"
          style="width: 1000px;height: 800px;" 
        ></iframe>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { flowService } from '@/services/flow.service';
export default {
  data() {
    return {
      json: {
        hello: "vue",
      },
      flow : null,
      options: {
        mode: "text",
        search: false,
        mainMenuBar: false,
        height: "430px",
      },
    };
  },
  props: ['userId'],
   mounted() {
    flowService.getById(this.userId).then((res) => { 
      this.flow = res.data;
    })

    },
  computed: { 
    isRunning(){ 
      return this.flow?.isRunning ? "Running" : "Stopped"  
    },
    port(){
      return this.flow?.port ;
    },
    address(){
      return this.flow?.address == "::" ? 'localhost' : this.flow?.address;
    },
    instanceSrc(){
      return `http://${this.address}:${this.port}/red`;
    }
  },  
  watch: {
    userId(newUserId) {
      // Respond to changes in userId here
      flowService.getById(newUserId).then((res) => {
        this.flow = res.data;
      });
    },
  },
  methods: {
    onError() {
      console.log("error");
    },
    SaveAndDeploy() {
      console.log(this.json);
    },
  },
};
</script>
<style>
#footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 4%;
}
#instruction {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.jse-main.svelte-sxaskb {
  min-height: 440px !important;
}
.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e67e2266;
}
</style>



