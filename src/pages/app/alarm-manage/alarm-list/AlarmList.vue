<template>
  <div class="cds-wrapper cds-border cds-padding-14" style="position: relative">
    <!-- 头部搜索和按钮操作 -->
    <!-- <div class="d-bord" @click="cardSearch(-1)">
      <div id="clickclassL" class="l-bord d-hover">
        <svg
          t="1661932961759"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="1378"
          width="100%"
          height="100%"
        >
          <path
            d="M101.964 482.708c5.746-19.334 26.228-26.474 46.376-27.284 46.002-1.84 151.37-4.674 364.66-4.674 213.29 0 318.658 2.832 364.66 4.674 20.148 0.81 40.63 7.95 46.376 27.284 2.324 7.82 3.964 17.774 3.964 30.292 0 12.52-1.64 22.47-3.964 30.292-5.746 19.334-26.228 26.474-46.376 27.284-46.002 1.84-151.37 4.674-364.66 4.674-213.29 0-318.658-2.832-364.66-4.674-20.148-0.81-40.63-7.95-46.376-27.284C99.64 535.472 98 525.52 98 513c0-12.52 1.64-22.47 3.964-30.292z"
            fill="#53B5FF"
            p-id="1379"
          ></path>
          <path
            d="M367.75 513m-145.25 0a145.25 145.25 0 1 0 290.5 0 145.25 145.25 0 1 0-290.5 0Z"
            fill="#FF934A"
            p-id="1380"
          ></path>
          <path
            d="M924.036 212.958c-5.746-19.334-26.228-26.474-46.376-27.284-46.002-1.84-151.37-4.674-364.66-4.674-213.29 0-318.658 2.832-364.66 4.674-20.148 0.81-40.63 7.95-46.376 27.284C99.64 220.778 98 230.732 98 243.25c0 12.52 1.64 22.47 3.964 30.292 5.746 19.334 26.228 26.474 46.376 27.284 46.002 1.84 151.37 4.674 364.66 4.674 213.29 0 318.658-2.832 364.66-4.674 20.148-0.81 40.63-7.95 46.376-27.284 2.324-7.82 3.964-17.774 3.964-30.292 0-12.52-1.64-22.47-3.964-30.292z"
            fill="#53B5FF"
            p-id="1381"
          ></path>
          <path
            d="MNaNNaNmNaNNaNaNaNNaNNaN 1 0NaNNaNNaNNaNNaN 1 0NaNNaNZ"
            fill="#FFDA8F"
            p-id="1382"
          ></path>
          <path
            d="M924.036 752.458c-5.746-19.334-26.228-26.474-46.376-27.284-46.002-1.84-151.37-4.674-364.66-4.674-213.29 0-318.658 2.832-364.66 4.674-20.148 0.81-40.63 7.95-46.376 27.284C99.64 760.278 98 770.232 98 782.75c0 12.52 1.64 22.47 3.964 30.292 5.746 19.334 26.228 26.474 46.376 27.284 46.002 1.84 151.37 4.674 364.66 4.674 213.29 0 318.658-2.832 364.66-4.674 20.148-0.81 40.63-7.95 46.376-27.284 2.324-7.82 3.964-17.774 3.964-30.292 0-12.52-1.64-22.47-3.964-30.292z"
            fill="#53B5FF"
            p-id="1383"
          ></path>
          <path
            d="MNaNNaNmNaNNaNaNaNNaNNaN 1 0NaNNaNNaNNaNNaN 1 0NaNNaNZ"
            fill="#FFDA8F"
            p-id="1384"
          ></path>
        </svg>
      </div>
      <div class="r-bord">
        <div class="r-t-bord">全部</div>
        <div class="r-b-bord">
          <count-to
            :start-val="0"
            :end-val="statisticsData.allCount"
            :duration="1"
          />
        </div>
      </div>
    </div>
    <div class="d-bord" style="margin-left: 40px" @click="cardSearch(0)">
      <div id="clickclassC" class="l-bord l-hover">
        <svg
          t="1662002130427"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="1101"
          width="100%"
          height="100%"
        >
          <path
            d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"
            fill="#f23504"
            p-id="1102"
            data-spm-anchor-id="a313x.7781069.0.i0"
            class="selected"
          ></path>
          <path
            d="M771.656 704.254c-63.656 87.816-164.966 135.53-268.148 133.504-166.044-3.264-306.84-139.13-316.776-306.686C176 349.956 322.15 190.156 503.508 186.26c90.964-1.958 185.35 34.574 248.782 100.036 0.306 0.32 0.612 0.646 0.918 0.97 14.864-9.22 27.612-16.276 38.282-21.66 22.828-11.526 45.574 3.72 46.144 29.416 0.714 31.54-0.488 78.908-8.368 141.336-3.218 25.496-27.186 42.844-52.254 37.822-61.356-12.296-106.42-26.166-135.926-36.856-24.05-8.708-31.198-35.228-13.094-53.356 8.654-8.66 19.65-18.824 33.498-30.406a160.624 160.624 0 0 1-1.284-1.484c-39.2-46.806-85.812-74.81-156.698-72.702-130.898 3.894-234.772 121.146-223.98 251.7 9.632 116.72 108.112 210.332 223.98 213.564 71.172 1.986 141.304-29.198 187.386-87.35 13.908-17.546 32.928-31.252 53.292-22.054a135.776 135.776 0 0 1 12.178 6.304 135.548 135.548 0 0 1 11.506 7.452c18.102 13.128 16.94 37.13 3.786 55.264z"
            fill="#FFFFFF"
            p-id="1103"
          ></path>
        </svg>
      </div>
      <div class="r-bord">
        <div class="r-t-bord" style="color: red">未恢复</div>
        <div class="r-b-bord">
          <count-to
            :start-val="0"
            :end-val="statisticsData.abnormalCount"
            :duration="1"
          />
        </div>
      </div>
    </div>
    <div class="d-bord" style="margin-left: 40px" @click="cardSearch(1)">
      <div id="clickclassR" class="l-bord r-hover">
        <svg
          t="1662002777390"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="1747"
          width="100%"
          height="100%"
        >
          <path
            d="M64 512c0 247.424 200.576 448 448 448s448-200.576 448-448S759.424 64 512 64 64 264.576 64 512z"
            fill="#34bfa3"
            p-id="1748"
            data-spm-anchor-id="a313x.7781069.0.i9"
            class="selected"
          ></path>
          <path
            d="M519.66 525.44a10.654 10.654 0 0 1-15.32 0c-21.14-21.718-82.92-84.97-147.134-148.374-14.508-14.336-35.158-19.86-51.414-7.744-6.656 4.972-14.186 11.584-22.272 20.352-11.03 11.926-18.39 23.296-23.274 32.768-8.022 15.51-3.948 33.686 6.228 47.766 79.574 110.25 165.484 185.43 211.606 221.802 20.288 15.98 47.552 15.98 67.84 0 46.122-36.372 132.032-111.552 211.606-221.802 10.176-14.08 14.25-32.256 6.228-47.766-4.884-9.472-12.244-20.842-23.274-32.768-8.086-8.768-15.616-15.38-22.272-20.352-16.256-12.116-36.906-6.592-51.414 7.744-64.212 63.404-125.994 126.656-147.136 148.374z"
            fill="#FFFFFF"
            p-id="1749"
          ></path>
        </svg>
      </div>
      <div class="r-bord">
        <div class="r-t-bord" style="color: green">已恢复</div>
        <div class="r-b-bord">
          <count-to
            :start-val="0"
            :end-val="statisticsData.recoveredCount"
            :duration="1"
          />
        </div>
      </div>
    </div>
    <div class="d-bord" style="margin-left: 40px" @click="cardSearch(2)">
      <div id="clickclassPart" class="l-bord part-hover">
        <svg
          t="1679030388945"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6923"
          data-spm-anchor-id="a313x.7781069.0.i26"
          width="100%"
          height="100%"
        >
          <path
            d="M514 202.8V510H202.8v2c0 170.8 138.4 309.3 309.2 309.3 170.8 0 309.3-138.4 309.3-309.3C821.2 342 684 204 514 202.8z"
            p-id="6924"
            fill="#d81e06"
            data-spm-anchor-id="a313x.7781069.0.i21"
            class="selected"
          ></path>
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m282.8 730.8c-36.8 36.8-79.5 65.6-127.2 85.7C618.4 901.4 566 912 512 912s-106.4-10.6-155.7-31.4c-47.6-20.1-90.4-49-127.2-85.7-36.8-36.8-65.6-79.5-85.7-127.2C122.6 618.4 112 566 112 512s10.6-106.4 31.4-155.7c20.1-47.6 49-90.4 85.7-127.2 36.8-36.8 79.5-65.6 127.2-85.7C405.6 122.6 458 112 512 112c54 0 106.4 10.6 155.7 31.4 47.6 20.1 90.4 49 127.2 85.7 36.8 36.8 65.6 79.5 85.7 127.2C901.4 405.6 912 458 912 512s-10.6 106.4-31.4 155.7c-20.2 47.6-49 90.4-85.8 127.1z"
            p-id="6925"
            fill="#d81e06"
            data-spm-anchor-id="a313x.7781069.0.i27"
            class="selected"
          ></path>
        </svg>
      </div>
      <div class="r-bord">
        <div class="r-t-bord" style="color: red">部分恢复</div>
        <div class="r-b-bord">
          <count-to
            :start-val="0"
            :end-val="statisticsData.partRecoveredCount"
            :duration="1"
          />
        </div>
      </div>
    </div>
    <div class="d-bord" style="margin-left: 40px" @click="cardSearch(3)">
      <div id="clickclassAll" class="l-bord all-hover">
        <svg
          t="1679029523142"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3020"
          width="97%"
          height="97%"
        >
          <path
            d="M512 0C229.284469 0 0 229.284469 0 512S229.284469 1024 512 1024 1024 794.715531 1024 512 794.715531 0 512 0z m302.394637 552.27352C791.969609 712.681117 670.46257 820.344134 512 820.344134c-120.248492 0-227.568268-70.478659-278.024581-175.281341l-16.246704 38.328492c-4.462123 10.41162-14.530503 16.704358-25.17095 16.704357-3.546816 0-7.208045-0.68648-10.640447-2.173854-13.844022-5.949497-20.365587-21.967374-14.416089-35.811397l43.934749-103.429721c0-0.114413 0.114413-0.228827 0.114413-0.34324v-0.114413c0.114413-0.114413 0.228827-0.34324 0.228827-0.457654 0.68648-1.487374 1.372961-2.860335 2.288268-4.233296 0.34324-0.457654 0.800894-0.915307 1.144134-1.372961 0.68648-0.915307 1.487374-1.830615 2.288268-2.745922 0.457654-0.457654 1.029721-0.800894 1.487375-1.258547 0.800894-0.68648 1.716201-1.487374 2.631508-2.059441 0.572067-0.34324 1.144134-0.572067 1.601788-0.915308 1.029721-0.572067 1.945028-1.144134 2.974748-1.601787 0.800894-0.34324 1.601788-0.457654 2.402682-0.686481 0.800894-0.228827 1.601788-0.572067 2.517095-0.800894h0.228827c0.68648-0.114413 1.372961-0.114413 2.059441-0.228827 4.805363-0.572067 9.496313 0 13.729609 1.830615h0.114413l103.887375 44.049162c13.844022 5.949497 20.365587 21.967374 14.416089 35.811397-4.462123 10.41162-14.530503 16.704358-25.17095 16.704357-3.546816 0-7.208045-0.68648-10.640447-2.173855l-48.511285-20.594413c40.61676 88.327151 130.088045 148.165363 230.543017 148.165363 132.033073 0 229.513296-86.839777 248.277095-221.046704 2.059441-14.988156 16.017877-25.399777 30.777207-23.225922 15.216983 2.173855 25.628603 16.017877 23.569162 30.891621z m42.218547-190.498324l-43.934748 103.315307c-1.029721 2.517095-2.402682 4.805363-4.118883 6.864804-0.34324 0.34324-0.572067 0.68648-0.915307 1.029721-1.601788 1.830615-3.317989 3.432402-5.37743 4.69095l-0.686481 0.34324c-1.716201 1.029721-3.661229 1.945028-5.606257 2.631508-0.572067 0.228827-1.144134 0.34324-1.716201 0.572067-0.457654 0.114413-0.915307 0.34324-1.372961 0.457654-1.830615 0.34324-3.661229 0.572067-5.491843 0.572067-0.68648 0-1.372961-0.114413-2.059442-0.228827-1.144134-0.114413-2.173855-0.114413-3.203575-0.34324l-1.029721-0.34324c-1.372961-0.34324-2.860335-0.68648-4.118882-1.258548h-0.228827L672.750838 436.029497c-13.844022-5.949497-20.365587-21.967374-14.416089-35.811396 5.949497-13.844022 21.967374-20.365587 35.811396-14.41609l48.511285 20.594414C701.926257 318.069274 612.454972 258.116648 512 258.116648c-132.033073 0-229.513296 86.725363-248.277095 221.046704-1.945028 13.615196-13.615196 23.569162-27.001564 23.569162-1.258547 0-2.517095-0.114413-3.775643-0.228827-14.988156-2.059441-25.399777-15.903464-23.225921-30.777207C232.144804 311.318883 353.651844 203.655866 512.114413 203.655866c120.248492 0 227.568268 70.478659 278.024581 175.281341l16.246704-38.328492c5.949497-13.844022 21.967374-20.365587 35.811397-14.416089 13.729609 5.606257 20.251173 21.738547 14.416089 35.58257z"
            fill="#df1b1b"
            p-id="3021"
          ></path>
        </svg>
      </div>
      <div class="r-bord">
        <div class="r-t-bord" style="color: green">全部未恢复</div>
        <div class="r-b-bord">
          <count-to
            :start-val="0"
            :end-val="statisticsData.allAbnormalCount"
            :duration="1"
          />
        </div>
      </div>
    </div> -->
    <div class="header-statistics">
      <div class="statistics">
        <!--@click="cardSearch(-1)"-->
        <div
          class="statistics-row"
          :class="{ 'statistics-row-active': statisticsIndex === -1 }"
        >
          全部：
          <span class="statistics-number">{{
            statisticsData.allCount || 0
          }}</span>
        </div>
        <div
          class="statistics-row"
          :class="{ 'statistics-row-active': statisticsIndex === 0 }"
        >
          未恢复：
          <span class="statistics-number">{{
            statisticsData.abnormalCount || 0
          }}</span>
        </div>
        <div
          class="statistics-row"
          :class="{ 'statistics-row-active': statisticsIndex === 1 }"
        >
          已恢复：
          <span class="statistics-number">{{
            statisticsData.recoveredCount || 0
          }}</span>
        </div>
        <div
          class="statistics-row"
          :class="{ 'statistics-row-active': statisticsIndex === 2 }"
        >
          部分恢复：
          <span class="statistics-number">{{
            statisticsData.partRecoveredCount || 0
          }}</span>
        </div>
        <div
          class="statistics-row"
          :class="{ 'statistics-row-active': statisticsIndex === 3 }"
        >
          全部未恢复：
          <span class="statistics-number">{{
            statisticsData.allAbnormalCount || 0
          }}</span>
        </div>
      </div>
      <div class="regular-label">
        <div
          v-for="(item, index) in regularLabelList"
          :key="index"
          class="regular-list"
        >
          <div
            class="regular-cell"
            :class="{ regularLabelActive: regularCollectLabel === item.id }"
            @click="regularChange(item.id)"
          >
            <span>{{ item.projectName }}</span>
            <span>(</span>
            <span>{{ item.coverNumber || 0 }}</span>
            <span>)</span>
          </div>
        </div>
      </div>
    </div>
    <div
      style="
        box-sizing: border-box;
        min-height: calc(100% - 128px);
        width: 100%;
      "
    >
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleCardChange"
        style="height: 100%"
      >
        <el-tab-pane
          v-for="item in cardTypeList"
          :label="item.label"
          :key="item.key"
          :name="item.key"
          style="min-height: 350px"
        >
          <!-- 搜索 -->
          <div class="cds-clearfix cds-margin-bottom-14">
            <el-select
              v-model="currentLabel"
              style="width: 200px"
              @change="labelChange"
              placeholder="请选择标签"
            >
              <el-option
                v-for="item in commonLabelList"
                :value="item.id"
                :key="item.id"
                :label="item.label"
              >
              </el-option>
            </el-select>
            <Input
              clearable
              v-model="inputAlarmId"
              style="width: 6%"
              placeholder="请输入告警ID"
              @keyup.enter.native="handleSearch"
            >
            </Input>
            <Input
              clearable
              v-model="inputProjectName"
              style="width: 6.5%"
              placeholder="请输入项目名称"
              @keyup.enter.native="handleSearch"
            >
            </Input>
            <!--<Input-->
            <!--clearable-->
            <!--v-model="inputAlarmObject"-->
            <!--style="width: 8.5%"-->
            <!--placeholder="请输入资源名称"-->
            <!--&gt;-->
            <!--</Input>-->
            <!--<Input-->
            <!--clearable-->
            <!--v-model="inputKeywords"-->
            <!--style="width: 6%"-->
            <!--placeholder="请输入告警等级"-->
            <!--&gt;-->
            <!--</Input>-->
            <Input
              clearable
              v-model="inputKeywords"
              style="width: 20%"
              placeholder="请输入资源/告警等级/告警类型/告警概要/告警详情"
              @keyup.enter.native="handleSearch"
            >
            </Input>
            <!--<Input-->
            <!--clearable-->
            <!--v-model="inputAlarmOutline"-->
            <!--style="width: 10%"-->
            <!--placeholder="请输入"-->
            <!--&gt;-->
            <!--</Input>-->
            <!--<Input-->
            <!--clearable-->
            <!--v-model="inputAlarmMessage"-->
            <!--style="width: 10%"-->
            <!--placeholder="请输入"-->
            <!--&gt;-->
            <!--</Input>-->
            <DatePicker
              type="datetime"
              placeholder="选择开始时间"
              style="width: 9.5%"
              :value="pickStartDate"
              format="yyyy-MM-dd HH:mm:ss"
              @on-change="startDateChange"
              v-if="showTimeOperate"
            ></DatePicker>
            <span v-if="showTimeOperate">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
            <DatePicker
              type="datetime"
              placeholder="选择结束时间"
              style="width: 9.5%; margin-right: 6px"
              :value="pickEndDate"
              format="yyyy-MM-dd HH:mm:ss"
              @on-change="endDateChange"
              v-if="showTimeOperate"
            ></DatePicker>
            <!--<Input-->
            <!--clearable-->
            <!--v-model="inputHostName"-->
            <!--style="width: 160px"-->
            <!--placeholder="请输入主机名称"-->
            <!--&gt;-->
            <!--</Input>-->
            <!--<Input-->
            <!--clearable-->
            <!--v-model="inputIp"-->
            <!--style="width: 160px"-->
            <!--placeholder="请输入IP地址"-->
            <!--&gt;-->
            <!--</Input>-->
            <i-button
              class="cds-btn-search"
              type="primary"
              @click="handleSearch"
            >
              <i class="iconfont icon-iconfontsousuo"></i>
            </i-button>
            <i-button type="primary" @click="handleExcel">
              <i class="iconfont icon-daochu">导出全部</i>
            </i-button>
            <!-- 按钮操作 -->
            <!--<div class="cds-float-right">-->
            <!--<i-button-->
            <!--type="primary"-->
            <!--@click="flag.add = true">-->
            <!--<i class="iconfont icon-plus">新增</i>-->
            <!--</i-button>-->
            <!--<i-button-->
            <!--type="primary"-->
            <!--@click="flag.import = true">-->
            <!--<i class="iconfont icon-zu">导入主机</i>-->
            <!--</i-button>-->
            <!--<i-button-->
            <!--type="primary"-->
            <!--@click="submitSync">-->
            <!--<i class="iconfont icon-shuaxin1">同步</i>-->
            <!--</i-button>-->
            <i-button
              type="primary"
              :disabled="alarmIds.length < 2"
              @click="flag.conFirmBatch = true"
            >
              <i class="iconfont icon-shuaxin1">批量确认</i>
            </i-button>
            <i-button
              class="cds-btn-refresh"
              type="primary"
              @click="handleRefreshFunc"
            >
              <i class="iconfont icon-shuaxin1"></i>
            </i-button>
            <!--</div>-->
            <div class="list-setting">
              <el-dropdown
                trigger="click"
                :hide-on-click="false"
                @command="handleCommand"
              >
                <el-button
                  size="mini"
                  icon="icon el-icon-s-tools"
                  class="f-comp-mini-margin"
                ></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(value, key) in currentShowFields"
                    :key="key"
                  >
                    <el-checkbox v-model="currentShowFields[key]">
                      {{ selectedList[key] }}
                    </el-checkbox>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div style="margin: 10px 0">
              <el-select
                v-model="strategyLabel"
                multiple
                style="width: 400px"
                placeholder="请选择告警状态"
                @change="strategyChange"
              >
                <el-option
                  v-for="item in strategyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="collect-box">
              <span>收藏标签：</span>
              <div
                v-for="(item, index) in collectLabelList"
                :key="index"
                class="collectList"
                :class="{ activeLabel: currentCollectLabel === item.id }"
              >
                <span v-if="index < 5" @click="activeLabelFunc(item.id)"
                  >{{ item.label }}
                  <span class="number">{{ item.coverNumber || 0 }}</span>
                </span>
              </div>
            </div>
          </div>

          <el-table
            ref="mainTable"
            size="small"
            class="alarmTable"
            stripe
            border
            v-loading="tableConfig.loading"
            :data="tableConfig.data"
            @selection-change="selectionChange"
            @sort-change="sortChange"
            :row-class-name="getRowClass"
          >
            <el-table-column type="expand">
              <template slot-scope="scope" v-if="scope.row.policyId">
                <div
                  class="interior-table-box"
                  :style="{ width: tableWidth + 'px' }"
                >
                  <InteriorAlarmOrder :parentRow="scope.row" />
                </div>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="39" fixed>
            </el-table-column>
            <el-table-column label="ID" min-width="70" prop="alarmId" sortable>
              <template slot-scope="scope">{{ scope.row.alarmId }}</template>
            </el-table-column>
            <el-table-column
              label="名称"
              min-width="100"
              align="center"
              prop="projectName"
              sortable
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="icon el-icon-s-tools"
                  class="f-comp-mini-margin"
                  v-if="scope.row.icon"
                ></el-button>
                <span>{{ scope.row.projectName }}</span></template
              >
            </el-table-column>
            <el-table-column
              label="状态"
              min-width="83"
              align="center"
              prop="alarmStatus"
              sortable
              v-if="currentShowFields.alarmStatus"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  :style="{
                    color:
                      scope.row.alarmStatus == '1' ||
                      scope.row.alarmStatus == '2'
                        ? 'green'
                        : 'red',
                  }"
                  >{{ alarmStatusList[scope.row.alarmStatus] }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="资源"
              width="120"
              align="center"
              prop="alarmObject"
              sortable
              v-if="currentShowFields.alarmObject"
            >
              <template slot-scope="scope">{{
                scope.row.alarmObject
              }}</template>
            </el-table-column>
            <el-table-column
              label="等级"
              min-width="70"
              align="center"
              prop="level"
              sortable
              v-if="currentShowFields.level"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">{{ scope.row.level }}</template>
            </el-table-column>
            <el-table-column
              label="类型"
              min-width="80"
              align="center"
              prop="strategy"
              v-if="currentShowFields.strategy"
              sortable
            >
              <template slot-scope="scope">{{ scope.row.strategy }}</template>
            </el-table-column>
            <el-table-column
              label="概要"
              min-width="170"
              align="center"
              prop="alarmOutline"
              sortable
              v-if="currentShowFields.alarmOutline"
            >
              <template slot-scope="scope">{{
                scope.row.alarmOutline
              }}</template>
            </el-table-column>
            <el-table-column
              label="详情"
              min-width="410"
              align="center"
              prop="alarmMessage"
              sortable
              v-if="currentShowFields.alarmMessage"
            >
              <template slot-scope="scope">{{
                scope.row.alarmMessage
              }}</template>
            </el-table-column>
            <el-table-column
              label="告警时间"
              min-width="93"
              align="center"
              prop="alarmTime"
              sortable
              v-if="currentShowFields.alarmTime"
            >
              <template slot-scope="scope">{{ scope.row.alarmTime }}</template>
            </el-table-column>
            <el-table-column
              label="初次时间"
              min-width="93"
              align="center"
              prop="alarmFirstTime"
              sortable
              v-if="currentShowFields.alarmFirstTime"
            >
              <template slot-scope="scope">{{
                scope.row.alarmFirstTime
              }}</template>
            </el-table-column>
            <el-table-column
              label="持续时长"
              min-width="93"
              align="center"
              prop="alarmDuration"
              sortable
              v-if="currentShowFields.alarmDuration"
            >
              <template slot-scope="scope">{{
                toHourMinute(scope.row.alarmTime, scope.row.alarmFirstTime)
              }}</template>
            </el-table-column>
            <el-table-column
              label="次数"
              min-width="70"
              align="center"
              prop="alarmTimes"
              sortable
              v-if="currentShowFields.alarmTimes"
            >
              <template slot-scope="scope">{{ scope.row.alarmTimes }}</template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="48"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div>
                  <el-dropdown :hide-on-click="false">
                    <span class="el-dropdown-link"
                      ><i
                        class="iconfont icon-plus"
                        :style="{ color: '#3399ff', cursor: 'pointer' }"
                      ></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="confirmedOperate(scope.row)"
                        >告警确认</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click.native="orderNoOperate(scope.row)"
                        >创建工单</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click.native="addPolicyOperate(scope.row)"
                        >添加策略</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="告警确认"
              width="70"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div @click="confirmedOperate(scope.row)">
                  <i
                    class="iconfont icon-plus"
                    v-if="scope.row.confirmed !== 1"
                    :style="{ color: '#3399ff' }"
                  ></i>
                  <span v-else :style="{ color: '#2dcb56' }">已确认</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="创建工单"
              width="70"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div
                  @click="orderNoOperate(scope.row)"
                  :style="{ cursor: 'pointer' }"
                >
                  <i
                    class="iconfont icon-plus"
                    v-if="scope.row.orderNo == null"
                    :style="{ color: '#3399ff' }"
                  ></i>
                  <span v-else :style="{ color: '#2dcb56' }">已创建</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="添加策略"
              width="70"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div
                  @click="addPolicyOperate(scope.row)"
                  :style="{ cursor: scope.row.policyId ? 'noraml' : 'pointer' }"
                >
                  <i
                    class="iconfont icon-plus"
                    :style="{ color: !scope.row.policyId && '#3399ff' }"
                  ></i>
                </div>
              </template>
            </el-table-column> -->
          </el-table>
          <!-- 表格 -->
          <!-- <Table
            ref="table"
            size="small"
            class="alarmTable"
            stripe
            :key="tableConfig.key"
            :loading="tableConfig.loading"
            :columns="tableConfig.columns"
            :data="tableConfig.data"
            @on-selection-change="selectionChange"
            @on-sort-change="sortChange"
          >
          </Table> -->
          <!-- 分页 -->
          <div class="page-wrapper clearfix cds-margin-bottom-14">
            <div class="cds-float-left">
              共有{{ page.totalCount }}条记录，当前页{{ page.currentPage }}/{{
                page.totalPage
              }}页
            </div>
            <div class="cds-float-right">
              <Page
                :total="page.totalCount"
                :current="page.currentPage"
                :page-size="page.pageSize"
                show-sizer
                size="small"
                placement="top"
                :page-size-opts="[50, 100]"
                @on-change="
                  getTableData({ currentPage: $event, pageSize: page.pageSize })
                "
                @on-page-size-change="getTableData({ pageSize: $event })"
              >
              </Page>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增 -->
    <AlarmOrder v-model="flag.add" title="告警转工单" :dataList="currentRow">
    </AlarmOrder>
    <!-- 修改 -->
    <AlarmEdit v-model="flag.update" title="告警确认" :dataList="currentRow">
    </AlarmEdit>

    <AlarmConfirm
      v-model="flag.conFirmBatch"
      title="告警批量确认"
      :dataList="this.alarmIds"
    >
    </AlarmConfirm>
    <!-- 新增 -->

    <AlarmPolicyAdd
      v-model="flag.addPolicy"
      title="告警屏蔽策略新增"
      :dataList="currentRow"
    >
    </AlarmPolicyAdd>

    <!-- 详情信息 -->
    <!--<h3c-modal-detail-->
    <!--title="主机资产详情"-->
    <!--label-width="140"-->
    <!--width="600"-->
    <!--:data="currentRow"-->
    <!--:rows="detailRows"-->
    <!--v-model="flag.info">-->
    <!--</h3c-modal-detail>-->
  </div>
</template>

<script>
const HostType = [
  {
    value: 0,
    label: "物理主机",
  },
  {
    value: 1,
    label: "云主机",
  },
];
import AlarmEdit from "./components/AlarmEdit.vue";
import AlarmOrder from "./components/AlarmOrder.vue";
import AlarmPolicyAdd from "../policy-list/components/AlarmPolicyAdd.vue";
import ModalConfirm from "@/components/modal-confirm/ModalConfirmTemp.vue";
import H3cModalDetail from "@/components/h3c-modal-detail/H3cModalDetail.vue";
import CountTo from "vue-count-to";
import AlarmConfirm from "./components/AlarmConfirm.vue";
import InteriorAlarmOrder from "./components/InteriorAlarmOrder.vue";
export default {
  name: "alarm-manage",
  components: {
    AlarmEdit,
    AlarmOrder,
    AlarmPolicyAdd,
    ModalConfirm,
    AlarmConfirm,
    H3cModalDetail,
    CountTo,
    InteriorAlarmOrder,
  },
  data() {
    return {
      statisticsIndex: "", //统计Index
      /*卡片类型*/
      activeName: "all",
      cardTypeList: [
        {
          label: "全部",
          key: "all",
        },
        {
          label: "近1天未恢复",
          key: "today",
        },
        {
          label: "近3天未恢复",
          key: "three",
        },
        {
          label: "超过3天未恢复",
          key: "week",
        },
      ],
      alarmStatusList: {
        0: "未恢复",
        1: "已恢复",
        2: "部分恢复",
        3: "全部未恢复",
      },
      showTimeOperate: true, // 时间可选择

      /**
       * 搜索功能定义两个变量inputValue和searchValue
       * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
       */
      statisticsData: {
        allCount: 0,
        abnormalCount: 0,
        recoveredCount: 0,
        partRecoveredCount: 0,
        allAbnormalCount: 0,
      },
      inputProjectName: "", //搜索框中显示的值
      inputKeywords: "", //模糊匹配的关键字
      inputAlarmId: "",
      alarmStatusCard: "",
      pickStartDate: "",
      pickEndDate: "",
      // searchValue: '', //实际点击查询按钮发送的值
      searchMap: {
        projectName: "", // 项目名称
        alarmId: "",
        keywords: "",
        alarmStatus: "0,2,3",
        policyStatus: 1,
        startDate: "", // 开始日期
        endDate: "", //结束日期
        policyId: "",
      },
      currentLabel: "", // 当前标签
      labelList: [], //标签列表
      strategyLabel: [0, 2, 3], //告警状态
      strategyList: [
        {
          label: "未恢复",
          value: 0,
        },
        {
          label: "已恢复",
          value: 1,
        },
        {
          label: "部分恢复",
          value: 2,
        },
        {
          label: "全部未恢复",
          value: 3,
        },
      ], //告警状态列表
      commonLabelList: [], // 普通标签列表
      currentCollectLabel: "", // 收藏标签
      collectLabelList: [], //收藏标签列表
      regularCollectLabel: "", // 固定标签
      regularLabelList: [], //固定标签列表
      showUserMembers: false, // 删除权限弹框
      membersList: [], // 项目成员数据
      //分页
      page: {
        pageSize: 50, //每页条数
        totalCount: 0, //总数
        totalPage: 1, //总页数
        currentPage: 1, //当前页码
      },

      // 筛选
      showFields: {
        // alarmId: true,
        // projectName: true,
        alarmStatus: true,
        alarmObject: true,
        level: true,
        strategy: true,
        alarmOutline: true,
        alarmMessage: true,
        alarmTime: true,
        alarmFirstTime: true,
        alarmDuration: true,
        alarmTimes: true,
      },
      currentShowFields: {
        // alarmId: true,
        // projectName: true,
        alarmStatus: true,
        alarmObject: true,
        level: true,
        strategy: true,
        alarmOutline: true,
        alarmMessage: true,
        alarmTime: true,
        alarmFirstTime: true,
        alarmDuration: true,
        alarmTimes: true,
      },
      selectedList: {
        alarmId: "ID",
        projectName: "项目名称",
        alarmObject: "资源",
        level: "告警等级",
        strategy: "告警类型",
        alarmOutline: "告警概要",
        alarmMessage: "告警详情",
        alarmTime: "告警时间",
        alarmFirstTime: "初次发生时间",
        alarmDuration: "持续时长",
        alarmTimes: "告警次数",
        alarmStatus: "告警状态",
      },
      //表格配置信息
      tableConfig: {
        key: new Date().toString(), //表格的属性key
        loading: false, //表格是否加载中
        //表格列的配置描述
        columns: [
          {
            type: "selection",
            width: 40,
            align: "center",
          },
          {
            title: "ID",
            key: "alarmId",
            width: 60,
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmId,
                  },
                },
                params.row.alarmId
              );
            },
          },
          {
            title: "项目名称",
            key: "projectName",
            ellipsis: true,
            width: 100,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.projectName,
                  },
                },
                params.row.projectName
              );
            },
          },
          {
            title: "资源",
            key: "alarmObject",
            width: 150,
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmObject,
                  },
                },
                params.row.alarmObject
              );
            },
          },

          {
            title: "告警等级",
            key: "level",
            width: 68,
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.level,
                  },
                },
                params.row.level
              );
            },
          },
          {
            title: "告警类型",
            key: "strategy",
            width: 120,
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.strategy,
                  },
                },
                params.row.strategy
              );
            },
          },
          {
            title: "告警概要",
            key: "alarmOutline",
            width: 170,
            ellipsis: true,
            render: (h, params) => {
              let text = params.row.alarmOutline;
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmOutline,
                  },
                },
                text
              );
            },
          },
          {
            title: "告警详情",
            width: 193,
            key: "alarmMessage",
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmMessage,
                  },
                },
                params.row.alarmMessage
              );
            },
          },
          {
            title: "告警时间",
            width: 135,
            key: "alarmTime",
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmTime,
                  },
                },
                params.row.alarmTime
              );
            },
          },
          {
            title: "初次发生时间",
            width: 135,
            key: "alarmFirstTime",
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmFirstTime,
                  },
                },
                params.row.alarmFirstTime
              );
            },
          },
          {
            title: "持续时长",
            key: "alarmDuration",
            ellipsis: true,
            width: 95,
            render: (h, params) => {
              let text = this.toHourMinute(
                params.row.alarmTime,
                params.row.alarmFirstTime
              );
              return h(
                "span",
                {
                  attrs: {
                    title: text,
                  },
                },
                text
              );
            },
          },
          {
            title: "告警次数",
            width: 70,
            key: "alarmTimes",
            ellipsis: true,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.alarmTimes,
                  },
                },
                params.row.alarmTimes
              );
            },
          },
          {
            title: "告警状态",
            width: 70,
            key: "alarmStatus",
            ellipsis: true,
            render: (h, params) => {
              let text = params.row.alarmStatus;
              let ploicytext = params.row.policyStatus;
              let col = "red";
              if (text == 0) {
                text = "未恢复";
              } else {
                text = "已恢复";
                col = "green";
              }
              return h(
                "span",
                {
                  attrs: {
                    title: text,
                  },
                  style: {
                    color: col,
                  },
                },
                text
              );
            },
          },

          // {
          //   title: '系统类型',
          //   key: 'systemType',
          //   sortable: 'custom',
          //   ellipsis: true,
          //   render: (h, params) => {
          //     return h('span', {
          //       attrs: {
          //         title: params.row.systemType
          //       }
          //     }, params.row.systemType);
          //   }
          // },
          //   {
          //       title: '创建时间',
          //       key: 'createTime',
          //       ellipsis: true,
          //     width: 160,
          //       align: 'center',
          //       sortable: 'custom',
          //       render: (h, params) => {
          //         let time = params.row.createTime
          //         time = time.replace(/T/g, ' ')
          //           return h('span', {
          //               attrs: {
          //                   title:time
          //               }
          //           }, time);
          //       }
          //   },
          {
            title: "告警确认",
            width: 70,
            align: "center",
            render: (h, params) => {
              let confirm = "";
              let isicon = true;
              let col = "";
              if (params.row.confirmed == 1) {
                isicon = false;
                confirm = "已确认";
                col = "#2dcb56";
              }
              return h("div", [
                h(
                  "i",
                  {
                    class: {
                      iconfont: isicon,
                      "icon-plus": isicon,
                    },
                    on: {
                      click: () => {
                        // 设置当前操作行
                        this.currentRow = params.row;
                        if (params.row.alarmStatus == 1) {
                          this.$Notice.error({
                            desc: "已恢复的告警不能确认！",
                          });
                        } else {
                          if (params.row.confirmed == 0) {
                            this.flag.update = true;
                          }
                        }
                      },
                    },
                    style: {
                      color: col,
                    },
                  },
                  confirm
                ),
              ]);
            },
          },
          {
            title: "创建工单",
            width: 70,
            align: "center",
            render: (h, params) => {
              let ordercontent = "";
              let isicon = true;
              let col = "";
              if (params.row.orderNo != null) {
                isicon = false;
                ordercontent = "已创建";
                col = "#2dcb56";
              }
              return h("div", [
                h(
                  "i",
                  {
                    class: {
                      iconfont: isicon,
                      "icon-plus": isicon,
                    },
                    on: {
                      click: () => {
                        //设置当前操作行
                        this.currentRow = params.row;
                        if (params.row.orderNo == null) {
                          if (
                            params.row.confirmed == 0 &&
                            params.row.alarmStatus == 0
                          ) {
                            this.$Notice.warning({
                              desc: "请您先确认告警之后，再创建工单！",
                            });
                          } else {
                            this.flag.add = true;
                          }
                        } else {
                          window.open(
                            "http://opscloud.h3c.com/o/bk_itsm/#/ticket/detail?id=" +
                              params.row.orderNo.split("+")[0] +
                              "&from=AllTicket"
                          );
                        }
                      },
                    },
                    style: {
                      color: col,
                      cursor: "pointer",
                    },
                  },
                  ordercontent
                ),
              ]);
            },
          },
          {
            title: "添加策略",
            width: 70,
            align: "center",
            render: (h, params) => {
              let isicon = true;
              return h("div", [
                h(
                  "i",
                  {
                    class: {
                      iconfont: isicon,
                      "icon-plus": isicon,
                    },
                    on: {
                      click: () => {
                        //设置当前操作行
                        this.currentRow = params.row;
                        this.flag.addPolicy = true;
                      },
                    },
                    style: {
                      cursor: "pointer",
                    },
                  },
                  ""
                ),
              ]);
            },
          },
        ],
        data: [], //表格中的数据
      },
      filterMap: {}, //表格筛选参数
      orderMap: {}, //表格排序参数
      alarmIds: [], //表格中选中的数据
      currentRow: {}, //表格中当前操作行
      //对话框标志位
      flag: {
        add: false, //新增
        addPolicy: false, //新增告警屏蔽
        delete: false, //删除
        conFirmBatch: false, // 批量确认
        update: false, // 修改
      },
      tableWidth: 0,
      //详情信息的标题配置信息
      detailRows: [
        {
          title: "主机名称",
          key: "hostName",
        },
        {
          title: "IP地址",
          key: "ip",
        },
        {
          title: "所属项目",
          key: "projectName",
        },
        {
          title: "CPU(核)",
          key: "cpu",
        },
        {
          title: "内存(G)",
          key: "memory",
        },
        {
          title: "主机状态",
          key: "status",
        },
        {
          title: "主机型号",
          key: "deviceType",
        },
        {
          title: "平台ID",
          key: "bkInstId",
        },
        {
          title: "创建时间",
          key: "createTime",
          render: (h, params) => {
            let time = params.row.createTime;
            if (time) {
              time = time.replace(/T/g, " ");
            }
            return h(
              "span",
              {
                attrs: {
                  title: time,
                },
              },
              time
            );
          },
        },
        {
          title: "序列号",
          key: "sn",
        },
        {
          title: "制造商",
          key: "company",
        },
      ],
    };
  },
  computed: {},
  methods: {
    getRowClass(row, index) {
      let res = [];
      if (!row.children)
        //即改行没有子元素时，添加row-expand-cover类
        res.push("row-expand-cover");
      // 1分钟以内的告警消息添加样式
      let startTime = row.row.alarmTime
      let endTime = this.$moment().format("YYYY-MM-DD HH:mm:ss")
      let seconds  = this.$moment(endTime).diff(this.$moment(startTime),"seconds");
      // 设置行的背景颜色为红色
      if (seconds <= 60) {
        return 'demo-table-info-row';
      } else {
        return '';
      }
      /* if (row.operate == 2)
      res.push('hide-row')
    return res.join(' ') */
    },
    websocketMessage() {
      // 创建 WebSocket 连接
      this.ws = new WebSocket("ws://localhost:8080/weekly/channel/alarm");
      // 监听socket连接
      this.ws.onopen = () => {
        console.log("socket-log连接成功")
      };
      this.ws.onclose = () => {
        console.log("socket-log已关闭")
      }
      // 监听socket错误信息
      this.ws.onerror = () => {
        console.log("socket-log连接错误")
      };
      this.ws.onmessage = (event) => {
        let item = JSON.parse(event.data)
        item.alarmTime = this.$moment(item.alarmTime).format("YYYY-MM-DD HH:mm:ss");
        item.alarmFirstTime = this.$moment(item.alarmFirstTime).format("YYYY-MM-DD HH:mm:ss");
        // 更新告警信息列表
        this.tableConfig.data.unshift(item)
        this.page.totalCount = this.page.totalCount + 1;
        // this.getTableData({loading: true});
      };
    },
    regularChange(id) {
      const current = this.regularLabelList.filter((item) => item.id === id);
      this.regularCollectLabel = current[0].id;
      // 下拉标签 收藏标签置空
      this.currentLabel = "";
      this.currentCollectLabel = "";

      this.inputAlarmId = current[0].alarmId || "";
      this.inputProjectName = current[0].projectName || "";
      this.inputKeywords = current[0].keywords || "";
      this.handleSearch();
    },
    labelChange(id) {
      const current = this.labelList.filter((item) => item.id === id);
      this.currentCollectLabel = "";
      this.regularCollectLabel = "";
      this.inputAlarmId = current[0].alarmId || "";
      this.inputProjectName = current[0].projectName || "";
      this.inputKeywords = current[0].keywords || "";
      this.handleSearch();
    },
    strategyChange(val) {
      this.searchMap.alarmStatus = val.toString()
      this.handleSearch();
    },
    activeLabelFunc(id) {
      const current = this.collectLabelList.filter((item) => item.id === id);
      this.currentCollectLabel = current[0].id;
      this.currentLabel = "";
      this.regularCollectLabel = "";
      this.inputAlarmId = current[0].alarmId || "";
      this.inputProjectName = current[0].projectName || "";
      this.inputKeywords = current[0].keywords || "";
      this.handleSearch();
    },
    //卡片切换
    handleCardChange(tab) {
      this.activeName = tab.name;
      switch (this.activeName) {
        case "all":
          this.searchMap.alarmStatus = "";
          this.showTimeOperate = true;
          this.handleRefresh(0,"0,2,3");
          break;
        case "today":
          this.searchMap.alarmStatus = "0,2,3";
          this.showTimeOperate = false;
          this.handleRefresh(1,"0,2,3");
          break;
        case "three":
          this.searchMap.alarmStatus = "0,2,3";
          this.showTimeOperate = false;
          this.handleRefresh(3, "0,2,3");
          break;
        case "week":
          this.searchMap.alarmStatus = "0,2,3";
          this.showTimeOperate = false;
          this.handleRefresh(365, "0,2,3");
          break;
      }
    },
    // 告警确认操作按钮
    confirmedOperate(row) {
      if (row.confirmed === 1) {
        this.$Notice.success({
          desc: "已确认",
        });
        return;
      }
      // 设置当前操作行
      this.currentRow = row;
      if (row.alarmStatus == 1) {
        this.$Notice.error({
          desc: "已恢复的告警不能确认！",
        });
      } else {
        if (row.confirmed == 0) {
          this.flag.update = true;
        }
      }
    },
    // 创建工单操作按钮
    orderNoOperate(row) {
      //设置当前操作行
      this.currentRow = row;
      if (row.orderNo == null) {
        if (row.confirmed == 0 && row.alarmStatus == 0) {
          this.$Notice.warning({
            desc: "请您先确认告警之后，再创建工单！",
          });
        } else {
          this.flag.add = true;
        }
      } else {
        window.open(
          "http://opscloud.h3c.com/o/bk_itsm/#/ticket/detail?id=" +
            row.orderNo.split("+")[0] +
            "&from=AllTicket"
        );
      }
    },

    // 添加策略操作按钮
    addPolicyOperate(row) {
      //设置当前操作行
      if (row.policyId) {
        this.$Notice.warning({
          desc: "收敛告警无法添加策略",
        });
      } else {
        this.currentRow = row;
        this.flag.addPolicy = true;
      }
    },

    // 标签配置接口
    getLabelList() {
      this.$http
        .post(`alarm/label/page/list`, {
          current: 1,
          pageSize: 1000,
          searchMap: {
            collectStatus: "",
          },
        })
        .then(({ data }) => {
          if (data.status) {
            this.labelList = data.data.records;
          }
          this.labelList.map((val) => {
            if (val.keywords) {
              val.label =
                val.projectName +
                "(" +
                val.keywords +
                ")" +
                "(" +
                (val.coverNumber || 0) +
                ")";
            } else {
              val.label = val.projectName + "(" + (val.coverNumber || 0) + ")";
            }
          });
          this.commonLabelList = this.labelList.filter(
            (item) => item.labelType === 1
          );
          this.collectLabelList = this.labelList.filter(
            (item) => item.collectStatus === "true"
          );
          this.collectLabelList.map((val) => {
            if (val.keywords) {
              val.label = val.projectName + "(" + val.keywords + ")";
            } else {
              val.label = val.projectName;
            }
          });
          this.regularLabelList = this.labelList.filter(
            (item) => item.labelType === 2
          );
        });
    },

    //点击查询按钮触发
    handleSearch() {
      //将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchMap.projectName = this.inputProjectName.trim();
      this.searchMap.keywords = this.inputKeywords.trim();
      this.searchMap.alarmId = this.inputAlarmId.trim();
      this.searchMap.startDate = this.pickStartDate;
      // this.searchMap.alarmStatus = this.alarmStatusCard.trim();
      this.searchMap.endDate = this.pickEndDate;
      //请求表格数据：不显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize,
      });
    },
    //点击查询按钮触发
    cardSearch(alarmStatusCard) {
      this.statisticsIndex = alarmStatusCard;
      //将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchMap.projectName = this.inputProjectName.trim();
      this.searchMap.keywords = this.inputKeywords.trim();
      this.searchMap.alarmId = this.inputAlarmId.trim();
      this.searchMap.startDate = this.pickStartDate;
      if (alarmStatusCard == -1) {
        this.searchMap.alarmStatus = "";
      } else {
        this.searchMap.alarmStatus = alarmStatusCard;
      }
      this.searchMap.endDate = this.pickEndDate;
      //请求表格数据：不显示缓冲状态，保留每页条数
      this.getCabTableData({
        loading: true,
        pageSize: this.page.pageSize,
      });
      if (alarmStatusCard == -1) {
        document.getElementById("clickclassL").style.background = "#dbdbdb";
        document.getElementById("clickclassC").style.background = "white";
        document.getElementById("clickclassR").style.background = "white";
        document.getElementById("clickclassPart").style.background = "white";
        document.getElementById("clickclassAll").style.background = "white";
      } else if (alarmStatusCard == 0) {
        document.getElementById("clickclassL").style.background = "white";
        document.getElementById("clickclassC").style.background = "#f4516c";
        document.getElementById("clickclassR").style.background = "white";
        document.getElementById("clickclassPart").style.background = "white";
        document.getElementById("clickclassAll").style.background = "white";
      } else if (alarmStatusCard == 1) {
        document.getElementById("clickclassL").style.background = "white";
        document.getElementById("clickclassC").style.background = "white";
        document.getElementById("clickclassR").style.background = "#34bfa3";
        document.getElementById("clickclassPart").style.background = "white";
        document.getElementById("clickclassAll").style.background = "white";
      } else if (alarmStatusCard == 2) {
        document.getElementById("clickclassL").style.background = "white";
        document.getElementById("clickclassC").style.background = "white";
        document.getElementById("clickclassR").style.background = "white";
        document.getElementById("clickclassPart").style.background = "#ffc7bb";
        document.getElementById("clickclassAll").style.background = "white";
      } else if (alarmStatusCard == 3) {
        document.getElementById("clickclassL").style.background = "white";
        document.getElementById("clickclassC").style.background = "white";
        document.getElementById("clickclassR").style.background = "white";
        document.getElementById("clickclassR").style.background = "white";
        document.getElementById("clickclassPart").style.background = "white";
        document.getElementById("clickclassAll").style.background = "#ffbec1";
      }
    },
    //点击下载
    handleExcel() {
      //   this.$http.post(`alarm/excel`).then(({data}) => {
      // })
      this.tableConfig.loading = true;
      this.$http({
        method: "GET",
        url:
          `alarm/excel?projectName=` +
          this.searchMap.projectName +
          "&alarmStatus=" +
          this.searchMap.alarmStatus +
          "&policyStatus=" +
          this.searchMap.policyStatus +
          "&alarmId=" +
          this.searchMap.alarmId +
          "&keywords=" +
          this.searchMap.keywords +
          "&startDate=" +
          this.searchMap.startDate +
          "&endDate=" +
          this.searchMap.endDate,
        responseType: "blob",
      }).then((res) => {
        window.open(res.config.url);
        this.$Notice.success({
          desc: "告警数据导出成功！",
        });
        this.tableConfig.loading = false;
      });
    },
    // 修改开始日期
    startDateChange(startTime) {
      this.pickStartDate = startTime;
    },
    // 修改结束日期
    endDateChange(endTime) {
      if (!endTime) {
        this.pickEndDate = this.getNowFormatDate();
      } else {
        this.pickEndDate = endTime;
      }
    },
    handleRefreshFunc() {
      this.handleRefresh();
    },
    handleCommand() {
      sessionStorage.setItem(
        "showFields",
        JSON.stringify(this.currentShowFields)
      );
    },
    //点击刷新按钮触发dateUtil
    handleRefresh(noraml = 0, alarmStatus = "0,2,3") {
      if(noraml ===0 ){
        this.pickStartDate = '';
      }
      if(noraml!=0){
        this.pickStartDate = this.getNowFormatDateBefore(noraml);
      }
      if(noraml==365){
        this.pickEndDate = this.getNowFormatDateBefore(3);
      }else{
        this.pickEndDate = this.getNowFormatDate();
      }

      //清空搜索输入框
      this.setInputEmpty(alarmStatus);
      // 默认告警状态0,2,3
      this.strategyLabel = [0, 2, 3]
      //清空筛选
      this.filterMap = {};
      //清空排序
      this.orderMap = {};
      //重设Table组件的key，促使Table组件重新渲染
      this.tableConfig.key = new Date().toString();
      //请求表格数据：显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize,
      });
    },
    /**
     * @description 分页切换时触发的方法
     * @param {object} option
     * @param {number} option.current
     * @param {number} option.pageSize
     * @returns {void}
     */
    handlerChangePage({ current = 1, pageSize = 50 } = {}) {
      this.page.current = current;
      this.page.pageSize = pageSize;
      this.getTableData({ pageSize: this.page.pageSize });
    },
    //清空搜索框
    setInputEmpty(alarmStatus) {
      // 清空选中标签
      this.currentCollectLabel = "";
      this.currentLabel = "";
      this.regularCollectLabel = "";
      // 清空输入
      this.searchMap.projectName = this.inputProjectName = "";
      this.searchMap.alarmStatus = this.alarmStatusCard = "";
      this.searchMap.keywords = this.inputKeywords = "";
      this.searchMap.alarmId = this.inputAlarmId = "";
      this.searchMap.alarmStatus = alarmStatus;
    },
    //表格选中项发生变化时触发
    selectionChange(selection) {
      //清空表格中选中的数据
      this.alarmIds = [];
      //重置选中项
      selection.forEach((item) => {
        this.alarmIds.push(item.alarmId);
      });
    },
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({ column, key, order }) {
      let flag;
      //将order转换为true或false，true为升序，false为降序
      switch (order) {
        case "ascending":
          flag = true;
          break;
        case "descending":
          flag = false;
          break;
        case "null":
        default:
          flag = undefined;
      }
      this.orderMap = { [key]: flag };
      this.getTableData({ pageSize: this.page.pageSize });
    },
    /**
     * 发送请求获取表格数据，并且做相应处理
     * @param loading {boolean} 表格缓冲，默认值为false
     * @param currentPage {number} 分页当前页，默认值为第一页
     * @param pageSize {number} 分页每页条数，默认值为每页10条
     */
    getTableData({ loading = false, currentPage = 1, pageSize = 50 } = {}) {
      if (loading) {
        //设置表格缓冲
        this.tableConfig.loading = loading;
        //将表格数据data设置为空数组
        this.tableConfig.data = [];
      }
      //设置分页每页条数
      this.page.pageSize = pageSize;
      //设置分页当前页
      this.page.currentPage = currentPage;
      //清空表格中选中的数据（除了批量删除其他操作都需要清空该值，故在获取数据时清空）
      this.alarmIds = [];
      this.searchMap.startDate = this.pickStartDate;
      this.searchMap.endDate = this.pickEndDate;
      //发送请求并且做相应处理
      this.$http
        .post(`alarm/page/list`, {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            // url: this.searchValue,     //不包含下拉框联动时的传参方式
            ...this.searchMap, //包含下拉框联动时的传参方式
            ...this.filterMap,
          },
        })
        .then(({ data }) => {
          //请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
          if (data.status) {
            let resp = data.data;
            //将获取的分页数据赋值给表格数据data
            this.tableConfig.data = resp.records;
            //设置分页总条数
            this.page.totalCount = resp.total;
            //设置分页总页数，当总页数为0时显示为1
            this.page.totalPage = resp.pages ? resp.pages : 1;
            this.getCountAlarm();
          }

          //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
          loading ? (this.tableConfig.loading = false) : "";
        });
    },
    /**
     * 发送请求获取表格数据，并且做相应处理
     * @param loading {boolean} 表格缓冲，默认值为false
     * @param currentPage {number} 分页当前页，默认值为第一页
     * @param pageSize {number} 分页每页条数，默认值为每页10条
     */
    getCabTableData({ loading = false, currentPage = 1, pageSize = 50 } = {}) {
      if (loading) {
        //设置表格缓冲
        this.tableConfig.loading = loading;
        //将表格数据data设置为空数组
        this.tableConfig.data = [];
      }
      //设置分页每页条数
      this.page.pageSize = pageSize;
      //设置分页当前页
      this.page.currentPage = currentPage;
      //清空表格中选中的数据（除了批量删除其他操作都需要清空该值，故在获取数据时清空）
      this.alarmIds = [];
      this.searchMap.startDate = this.pickStartDate;
      this.searchMap.endDate = this.pickEndDate;
      //发送请求并且做相应处理
      this.$http
        .post(`alarm/page/list`, {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            // url: this.searchValue,     //不包含下拉框联动时的传参方式
            ...this.searchMap, //包含下拉框联动时的传参方式
            ...this.filterMap,
          },
        })
        .then(({ data }) => {
          //请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
          if (data.status) {
            let resp = data.data;
            //将获取的分页数据赋值给表格数据data
            this.tableConfig.data = resp.records;
            //设置分页总条数
            this.page.totalCount = resp.total;
            //设置分页总页数，当总页数为0时显示为1
            this.page.totalPage = resp.pages ? resp.pages : 1;
            // this.getCountAlarm();
          }

          //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
          loading ? (this.tableConfig.loading = false) : "";
        });
    },

    //查询未恢复告警数
    getCountAlarm() {
      this.$http
        .post(`alarm/getAlarmCount`, {
          searchMap: {
            // url: this.searchValue,     //不包含下拉框联动时的传参方式
            ...this.searchMap, //包含下拉框联动时的传参方式
            ...this.filterMap,
          },
        })
        .then(({ data }) => {
          if (data != "" && data != null) {
            this.statisticsData.abnormalCount = data.abnormalCount;
            this.statisticsData.recoveredCount = data.recoveredCount;
            this.statisticsData.partRecoveredCount = data.partRecoveredCount;
            this.statisticsData.allAbnormalCount = data.allAbnormalCount;
            this.statisticsData.allCount =
              this.statisticsData.abnormalCount +
              this.statisticsData.recoveredCount +
              this.statisticsData.partRecoveredCount +
              this.statisticsData.allAbnormalCount;
          } else {
            this.statisticsData.abnormalCount = 0;
            this.statisticsData.recoveredCount = 0;
            this.statisticsData.allCount = 0;
            this.statisticsData.partRecoveredCount = 0;
            this.statisticsData.allAbnormalCount = 0;
          }
        });
    },
    getNowFormatDateBefore(noraml = 1) {
      let date = new Date(new Date().getTime() - noraml * 24 * 60 * 60 * 1000),
        seperator1 = "-", //格式分隔符
        seperator2 = ":",
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate(), // 获取前noraml天
        hours = date.getHours(),
        menutes = date.getMinutes(),
        seconds = date.getSeconds();
      if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
      let currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hours +
        seperator2 +
        menutes +
        seperator2 +
        seconds;
      return currentdate;
    },
    getNowFormatDate() {
      let date = new Date(),
        seperator1 = "-", //格式分隔符
        seperator2 = ":",
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate(), // 获取当前日(1-31)
        hours = date.getHours(),
        menutes = date.getMinutes(),
        seconds = date.getSeconds();
      if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
      let currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hours +
        seperator2 +
        menutes +
        seperator2 +
        seconds;
      return currentdate;
    },
    toHourMinute(alarmTime, alarmFirstTime) {
      var beginDate = new Date(alarmFirstTime);
      var endDate = new Date(alarmTime);
      var minutes = Math.floor((endDate - beginDate) / (1000 * 60));
      if (minutes > 1440) {
        return (
          Math.floor(minutes / 1440) +
          "天" +
          Math.floor((minutes / 60) % 24) +
          "小时" +
          (minutes % 60) +
          "分"
        );
      } else {
        return Math.floor(minutes / 60) + "小时" + (minutes % 60) + "分";
      }
    }
  },
  //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {
    this.inputAlarmId = this.$route.query.id || "";
    if (this.inputAlarmId != null) {
      this.searchMap.alarmId = this.inputAlarmId;
    }
    // this.pickStartDate = this.getNowFormatDateBefore();
    this.pickEndDate = this.getNowFormatDate();
    this.getTableData({ loading: true });
    this.getCountAlarm();
    this.getLabelList();
    if (!!sessionStorage && !sessionStorage.getItem("showFields")) {
      sessionStorage.setItem("showFields", JSON.stringify(this.showFields));
      this.currentShowFields = this.showFields;
    } else {
      this.currentShowFields = JSON.parse(sessionStorage.getItem("showFields"));
    }
    this.websocketMessage();
  },
  mounted() {
    this.tableWidth =
      document.getElementsByClassName("alarmTable")[0].offsetWidth - 80;
  },
};
</script>
<style>
.d-bord {
  height: 110px;
  width: 220px;
  margin-bottom: 18px;
  color: #666;
  cursor: pointer;
  border-radius: 5px 4px 4px 40px rgb(0 0 0 / 7%);
  box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
  border-color: rgba(0, 0, 0, 0.05);
  float: left;
}
.l-bord {
  height: 80px;
  width: 80px;
  /*border: 1px solid #5EBBF7;*/
  margin-bottom: 8px;
  float: left;
  margin: 15px 15px 15px 15px;
}

.r-bord {
  height: 80px;
  width: 10px;
  margin-bottom: 8px;
  float: left;
  margin: 15px 15px 15px -10px;
}
.r-t-bord {
  height: 39px;
  width: 96px;
  clear: both;
  text-align: right;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 19px;
  font-weight: bold;
}
.r-b-bord {
  height: 39px;
  width: 90px;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
}

.d-hover:hover {
  color: #fff !important;
  background: #dbdbdb !important;
}
.d-hover {
  color: #fff;
  background: #dbdbdb;
}

.l-hover:hover {
  color: #fff !important;
  background: #f4516c !important;
}

.r-hover:hover {
  color: #fff !important;
  background: #34bfa3 !important;
}
.alarmTable {
  table-layout: fixed;
}
.alarmTable tbody tr td div span {
  word-wrap: break-word;
  white-space: normal;
}
.demo-table-info-row td{
  animation:aBlink 2500ms infinite;
  -webkit-animation:aBlink 2500ms infinite;
}
@keyframes aBlink {
  from { background-color:#ff0; }
  50%{background-color:#fff;}
  to { background-color:#ff0; }
}
@-webkit-keyframes aBlink {
  from { background-color:#ff0; }
  50%{background-color: #fff;}
  to { background-color:#ff0; }
}
</style>

<style scoped lang="less">
.row-expand-cover .el-table__expand-column .el-icon {
  visibility: hidden;
}

.search-wrapper,
.btn-wrapper {
  padding-bottom: 15px;
}

.page-wrapper {
  position: relative;
  margin-top: 12px;
}

.interior-table-box {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 55px;
  background-color: #f7f8f8;
}

.header-statistics {
  height: 128px;
  display: flex;
  padding-bottom: 10px;
}

.statistics {
  padding: 3px 15px;
  background: rgba(241, 241, 241, 0.7);
  .statistics-row {
    margin-bottom: 5px;
    cursor: pointer;
    background: rgba(241, 241, 241, 0.7);
  }
  .statistics-row:hover {
    background: rgba(255, 255, 255, 1);
  }
  .statistics-row-active {
    background: rgba(255, 255, 255, 1);
  }
  .statistics-number {
    padding-left: 10px;
  }
}
.regular-label {
  // position: absolute;
  // right: 10px;
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  width: calc(100% - 140px);
  height: 110px;
  flex-wrap: wrap;
  overflow-y: auto;
  .regular-list {
    width: 200px;
    cursor: pointer;
    text-align: center;
    margin: 1px 0px;
    height: 30px;
    line-height: 20px;
    box-sizing: border-box;
    .regular-cell {
      margin: 0 13px;
      padding: 5px 0;
    }
    .regular-cell:hover {
      background: #3399fe;
      border-radius: 10px;
      color: #fff;
    }
    .regularLabelActive {
      background: #3399fe;
      border-radius: 10px;
      color: #fff;
    }
  }
}

.list-setting {
  float: right;
}

.collect-box {
  padding: 14px 0px 0px 10px;
  display: flex;
  .collectList {
    margin-right: 10px;
    .number {
      border-radius: 50%;
      padding: 3px 5px;
      background: #f59393;
      color: #fff;
    }
  }
  .collectList:hover {
    color: #3399fe;
    cursor: pointer;
  }
  .activeLabel {
    color: #3399fe;
  }
}
.d-bord {
  height: 110px;
  width: 220px;
  margin-bottom: 18px;
  color: #666;
  cursor: pointer;
  border-radius: 5px 4px 4px 40px rgb(0 0 0 / 7%);
  box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
  border-color: rgba(0, 0, 0, 0.05);
  float: left;
}
.l-bord {
  height: 80px;
  width: 80px;
  /*border: 1px solid #5EBBF7;*/
  margin-bottom: 8px;
  float: left;
  margin: 15px 15px 15px 15px;
}

.r-bord {
  height: 80px;
  width: 10px;
  margin-bottom: 8px;
  float: left;
  margin: 15px 15px 15px -10px;
}
.r-t-bord {
  height: 39px;
  width: 96px;
  clear: both;
  text-align: right;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 19px;
  font-weight: bold;
}
.r-b-bord {
  height: 39px;
  width: 90px;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
}

.d-hover:hover {
  color: #fff !important;
  background: #dbdbdb !important;
}
.d-hover {
  color: #fff;
  background: #dbdbdb;
}

.l-hover:hover {
  color: #fff !important;
  background: #f4516c !important;
}

.r-hover:hover {
  color: #fff !important;
  background: #34bfa3 !important;
}
.alarmTable {
  table-layout: fixed;
}
.alarmTable tbody tr td div span {
  word-wrap: break-word;
  white-space: normal;
}
.part-hover:hover {
  color: #fff !important;
  background: #ffc7bb !important;
}
.all-hover:hover {
  color: #fff !important;
  background: #ffbec1 !important;
}
</style>


