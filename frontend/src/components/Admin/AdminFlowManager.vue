<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">You can upload the flow in here</span>
          </div>
        </template>

        <VJsoneditor
          v-model="json"
          mode="text"
          :mainMenuBar="false"
          @error="onError"
          style="height: '440px';"
        />
        <div id="footer">
          <el-button color="#7325ef" plain round @click="SaveAndDeploy">
            Save and Deploy
          </el-button>
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
            <!-- <el-button circle>
              <el-icon><Notification /></el-icon>
            </el-button> -->
          </div>
        </template>
        <iframe
          src="http://127.0.0.1:8000/red/#flow"
          class="myIfr"
          frameborder="0"
        ></iframe>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import VJsoneditor from 'json-editor-vue';
// import { Notification } from "@element-plus/icons-vue";
export default {
  components: {
    VJsoneditor,
    // Notification,
  },
  data() {
    return {
      json: {
        hello: "vue",
      },
      options: {
        mode: "text",
        search: false,
        mainMenuBar: false,
        height : "430px"

      },
    };
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
.jse-main.svelte-sxaskb{
  min-height : 440px !important
}
</style>



