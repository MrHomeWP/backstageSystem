<template>
  <div class="leftBox">
    <!-- 游客实时数据 -->
    <div class="tourist">
      <p>实时游客记录</p>
      <p class="img_line"></p>
      <p>可预约总量<span>999999</span>人</p>
      <!-- 现有人数 -->
      <div class="peopleNum">
        <span v-for="v in '216908人'">{{ v }}</span>
      </div>
      <!-- 水球图 -->
      <div class="WaterCircleBox">
        <div ref="RefWaterCircle" class="WaterCircle"></div>
      </div>
    </div>
    <!-- 男女比例 -->
    <div class="gender">
      <p>男女比例</p>
      <p class="img_line"></p>
      <!-- 图片 -->
      <div class="genderImg">
        <div class="male">
          <p>男士</p>
          <img src="../images/man.png" alt="" />
        </div>
        <div class="female">
          <p>女士</p>
          <img src="../images/woman.png" alt="" />
        </div>
      </div>
      <!-- 柱状图两端数据 -->
      <div class="data">
        <span>男士60%</span>
        <span>女士40%</span>
      </div>
      <!-- 柱状图 -->
      <div class="ratioBox">
        <div ref="RefRatio" class="ratio"></div>
      </div>
    </div>
    <!-- 年龄比例 -->
    <div class="age">
      <p>年龄比例</p>
      <p class="img_line"></p>
      <!-- 男女比例饼图 -->
      <div class="ageRatioBox">
        <div ref="RefSexRatio" class="sexRatio"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
//引入echarts
import * as echarts from "echarts";
import "echarts-liquidfill";
import { ref, onMounted, onBeforeUnmount } from "vue";
let RefWaterCircle = ref(); //获取水球图的div实例
let RefRatio = ref(); //获取男女比例图的div实例
let RefSexRatio = ref(); //获取年龄比例图的div实例
//组件一挂载完毕
onMounted(() => {
  //渲染水球图
  let ChartTourist = echarts.init(RefWaterCircle.value);
  function Pie() {
    // 外层虚线圈数据
    let dataArr = [];
    for (var i = 0; i < 150; i++) {
      if (i % 2 === 0) {
        dataArr.push({
          name: (i + 1).toString(),
          value: 50,
          itemStyle: {
            color: "#19A4BB",
            borderWidth: 0,
            borderColor: "rgba(0,0,0,0)",
          },
        });
      } else {
        dataArr.push({
          name: (i + 1).toString(),
          value: 100,
          itemStyle: {
            color: "rgba(0,0,0,0)",
            borderWidth: 0,
            borderColor: "rgba(0,0,0,0)",
          },
        });
      }
    }
    return dataArr;
  }
  const rate = 0.55;
  let option = {
    polar: {
      radius: ["75%", "80%"],
      center: ["50%", "50%"],
    },
    angleAxis: {
      max: 100,
      startAngle: 180, //设置起始点
      clockwise: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    radiusAxis: {
      type: "category",
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        // 水波球
        // value: 50, //  内容 配合formatter
        type: "liquidFill",
        name: "预估量",
        radius: "70%", // 控制中间圆球的尺寸（此处可以理解为距离外圈圆的距离控制）
        center: ["50%", "50%"],
        data: [rate, rate, rate], // data个数代表波浪数
        backgroundStyle: {
          borderWidth: 1,
          borderColor: "#23c8da",
          color: {
            // 球体背景色
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: "transparent" }, //第1个样式渐变点，设置为透明
              { offset: 0.7, color: "transparent" }, //第2个样式渐变点，设置为透明
              { offset: 1, color: "rgba(29, 218,184,.5)" }, //第3个样式渐变点，设置为浅绿色
            ],
          },
        },
        amplitude: "5%", //波浪的振幅
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: "#1dd9b6",
              },
              {
                offset: 0,
                color: "#189aba",
              },
            ],
            globalCoord: false,
          },
        ],
        label: {
          formatter: "{a}",
          fontSize: 14,
          color: "#fff",
        },
        outline: {
          show: false,
        },
      },
      {
        // 外层虚线环
        type: "pie",
        zlevel: 0,
        silent: true,
        radius: ["76%", "78%"],
        z: 1,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: Pie(),
      },
      {
        // 进度条环
        name: "",
        type: "bar",
        roundCap: true,
        z: 2,
        showBackground: false,
        data: [rate * 100],
        coordinateSystem: "polar",
        barWidth: 30, //大的占比环
        startAngle: -0, // 设置起始角度为-90度
        endAngle: 360, // 设置结束角度为270度
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 0,
              color: "#19A4BB",
            },
            {
              offset: 1,
              color: "#22C7DA",
            },
          ]),
        },
      },
    ],
    grid: {
      top: 0, // 图表距离容器顶部的距离
      left: 0, // 图表距离容器左侧的距离
      right: 0, // 图表距离容器右侧的距离
      bottom: 0, // 图表距离容器底部的距离
    },
  };
  ChartTourist.setOption(option);
  // 渲染男女比例柱状图
  let ChartRatio = echarts.init(RefRatio.value);
  ChartRatio.setOption({
    xAxis: {
      show: false, // 不显示 x 轴
      type: "value", // 值轴类型为数值轴
      min: 0, // 数值轴的最小值
      max: 100, // 数值轴的最大值
    },
    yAxis: {
      show: false, // 不显示 y 轴
      type: "category", // 值轴类型为类目轴
    },
    series: [
      {
        z: 10, // 设置层级，使得这个柱状图在上方
        type: "bar",
        data: [60], // 柱状图的数据
        barWidth: 16, // 柱状图的宽度
        itemStyle: {
          borderRadius: 10, // 设置柱状图的圆角
          color: "#0077ff", // 设置柱状图的颜色
        },
      },
      {
        type: "bar",
        data: [100], // 柱状图的数据
        barGap: "-100%", // 将两个柱状图叠加在一起
        barWidth: 16, // 柱状图的宽度
        itemStyle: {
          borderRadius: 10, // 设置柱状图的圆角
          color: "#ff5c78", // 设置柱状图的颜色
        },
      },
    ],
    grid: {
      top: 0, // 图表距离容器顶部的距离
      left: 0, // 图表距离容器左侧的距离
      right: 0, // 图表距离容器右侧的距离
      bottom: 0, // 图表距离容器底部的距离
    },
  });

  //渲染年龄比例饼图
  let CharSexRatio = echarts.init(RefSexRatio.value);
  let list = [
    { percent: 16, name: "10岁以下", value: 16 },
    { percent: 8, name: "10-18岁", value: 8 },
    { percent: 12, name: "18-30岁", value: 12 },
    { percent: 24, name: "30-40岁", value: 24 },
    { percent: 20, name: "40-60岁", value: 20 },
    { percent: 20, name: "60岁以上", value: 20 },
  ];
  var nameArray = list.map((item) => {
    return item.name + "\t\t\t" + item.percent + "%";
  });
  var color = [
    "#ffc64d",
    "#ff8023",
    "#1b809a",
    "#0c50a8",
    "#73c5f4",
    "#9878c8",
  ];
  var data = [];
  for (var i = 0; i < list.length; i++) {
    data.push({
      value: list[i].value,
      name: list[i].name + "\t\t\t" + list[i].percent + "%",
      itemStyle: {
        shadowBlur: 5,
        borderRadius: 10,
        borderColor: color[i],
      },
    });
  }
  let option2 = {
    backgroundColor: "#061740",
    color: color,
    tooltip: {
      trigger: "item", // 提示框触发类型，即鼠标悬停时显示提示信息
    },
    title: {
      text: "本月总数",
      left: "24%",
      top: "center",
      textStyle: {
        color: "#6c7bb0",
        fontWeight: "bold",
        fontSize: "15",
      },
    },
    legend: [
      {
        orient: "vertical",
        data: nameArray,
        right: "0",
        top: "center",
        align: "left",
        itemGap: 15,
        textStyle: {
          color: "#fff",
          fontSize: "14",
        },
        //图例标记的图形高度
        itemHeight: 15,
        //图例标记的图形宽度
        itemWidth: 15,
      },
    ],
    series: [
      {
        name: "",
        type: "pie",
        clockwise: false,
        radius: ["70%", "130%"],
        width: "65%",
        height: "55%",
        emphasis: {
          scale: false,
        },
        center: ["50%", "50%"],
        top: "center",
        label: {
          show: true,
          position: "inside",
          color: "#fff",
          fontSize: "15",
          formatter: function (params) {
            return params.percent + "%";
          },
        },
        data: data,
      },
    ],
  };
  CharSexRatio.setOption(option2);
  onBeforeUnmount(() => {
    // 在组件销毁前执行清除数据和销毁echarts实例的操作
    ChartTourist.dispose();
    ChartRatio.dispose();
    CharSexRatio.dispose();
  });
});
</script>

<style lang="scss" scoped>
.leftBox {
  width: 430px;
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  transform: translateY(-20px);
  .tourist {
    background: url("../images/dataScreen-main-lt.png") no-repeat;
    background-size: cover;
    p:nth-child(1) {
      font-size: 18px;
    }
    p.img_line {
      width: 67px;
      height: 7px;
      background-image: url("../images/dataScreen-title.png");
      margin: 10px 0;
    }
    p:nth-child(3) {
      padding-right: 10px;
      text-align: right;
      span {
        color: #ff8100;
      }
    }
    .peopleNum {
      display: flex;
      justify-content: center;
      margin: 20px 0 0;
      span {
        font-size: 25px;
        color: #80ffff;
        width: 50px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        background: url("../images/total.png") no-repeat;
        background-size: cover;
        margin-right: 1px;
      }
    }
    .WaterCircleBox {
      display: flex;
      justify-content: center;
      .WaterCircle {
        width: 250px;
        height: 250px;
      }
    }
  }
  .gender {
    margin-top: 20px;
    background: url("../images/dataScreen-main-lt.png") no-repeat;
    background-size: cover;
    p:nth-child(1) {
      font-size: 18px;
    }
    p.img_line {
      width: 67px;
      height: 7px;
      background-image: url("../images/dataScreen-title.png");
      margin: 10px 0;
    }
    .genderImg {
      margin-top: 50px;
      display: flex;
      justify-content: center;
      div {
        width: 95px;
        height: 95px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: url("../images/woman-bg.png") no-repeat;
        background-size: cover;
        border-radius: 5px;
        p {
          font-size: 14px;
          line-height: 18px;
        }
        img {
          width: 45px;
          margin-top: 10px;
        }
        &.male {
          margin-right: 20px;
          background: url("../images/man-bg.png") no-repeat;
          background-size: cover;
        }
      }
    }
    .data {
      margin: 20px auto 5px;
      width: 220px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    .ratioBox {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
      .ratio {
        width: 220px;
        height: 16px;
      }
    }
  }
  .age {
    margin-top: 20px;
    background: url("../images/dataScreen-main-lt.png") no-repeat;
    background-size: cover;
    p:nth-child(1) {
      font-size: 18px;
    }
    p.img_line {
      width: 67px;
      height: 7px;
      background-image: url("../images/dataScreen-title.png");
      margin: 10px 0;
    }
    .ageRatioBox {
      .sexRatio {
        width: 370px;
        height: 250px;
      }
    }
  }
}
</style>
