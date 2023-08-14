<template>
  <div class="rightBox">
    <!-- 热门景区排行 -->
    <div class="ScenicSpotsRanking">
      <p>热门景区排行</p>
      <p class="img_line"></p>
      <table>
        <tr>
          <td>排名</td>
          <td>景区</td>
          <td colspan="2">预约数量</td>
        </tr>
        <tr v-for="(v, i) in data" :key="i">
          <td>
            <div>
              <span>NO.{{ i + 1 }}</span>
            </div>
          </td>
          <td>{{ v.name }}</td>
          <td>
            <div class="box">
              <span>{{ v.percent }}</span>
              <div
                class="ProgressBar"
                :style="`transform: scale(${(v.number / 10) * 120});`"
              ></div>
            </div>
          </td>
          <td>{{ v.number }}.00w</td>
        </tr>
      </table>
    </div>
    <!-- 年度游客量对比 -->
    <div class="touristAmount">
      <p>年度游客量对比</p>
      <p class="img_line"></p>
      <!-- 折线图 -->
      <div class="LineChartBox">
        <div ref="RefLineChart" class="LineChart"></div>
      </div>
    </div>
    <!-- 预约渠道数据统计 -->
    <div class="subscribe">
      <p>预约渠道数据统计</p>
      <p class="img_line"></p>
      <!-- 折线图 -->
      <div class="PieChartBox">
        <div ref="RefPieChart" class="PieChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted ,onBeforeUnmount} from "vue";
let data = ref([
  { name: "峨眉山", percent: "80%", number: 8 },
  { name: "稻城亚丁", percent: "60%", number: 6 },
  { name: "九寨沟", percent: "50%", number: 5 },
  { name: "万里长城", percent: "40%", number: 4 },
  { name: "北京故宫", percent: "30%", number: 3 },
]);
//获取折线图div实例
let RefLineChart = ref();
//获取饼图div实例
let RefPieChart = ref();

onMounted(() => {
  //年度游客量渲染折线图
  let LineChart = echarts.init(RefLineChart.value);
  let option1 = {
    color: ["#fa9e15", "#1b6cf5", "#f761a0"],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF",
      },
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "5%",
      top: "50px",
      containLabel: true,
    },

    legend: {
      show: true,
      icon: "rect",
      orient: "horizontal",
      left: "right",
      itemWidth: 12,
      itemHeight: 12,
      formatter: ["{a|{name}}"].join("\n"),
      textStyle: {
        fontSize: 12,
        color: "#fff",
        height: 8,
        rich: {
          a: {
            verticalAlign: "bottom",
          },
        },
      },
      data: ["2021年", "2022年", "2023年"],
    },
    xAxis: {
      type: "category",
      boundaryGap: false, //坐标轴两端不留白
      axisLine: {
        show: true,
        color: "#BDD8FB",
      },
      axisLabel: {
        // interval:0,
        color: "#BDD8FB",
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
      data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    },
    yAxis: {
      name: "(人数)        ",
      nameLocation: "end", // 将名称显示在坐标轴的中间位置
      type: "value",
      min: 0,
      minInterval: 1,
      nameTextStyle: {
        fontSize: 12,
        color: "#BDD8FB",
        align: "center",
      },
      splitLine: {
        show: false,
      },
      splitArea: { show: false },
      axisLine: {
        show: true,
        color: "#BDD8FB",
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        fontFamily: "Bebas",
        color: "#BDD8FB",
      },
    },
    series: [
      {
        type: "line",
        symbol: "none",
        showSymbol: false,
        smooth: true, // 是否曲线
        name: "2021年", // 图例对应类别
        lineStyle: {
            width: 1,
            color: "rgba(253, 169, 16,.5)", // 线条颜色
        },
        data: [
          200, 350, 200, 300, 600, 500, 50, 60, 300, 450, 600, 300, 200, 100,
        ], // 纵坐标数据
        areaStyle: {
          // 区域颜色
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          // 	{
          // 		offset: 0,
          // 		color: "#5090FF",
          // 	},
          // 	{
          // 		offset: 1,
          // 		color: "#1057E5",
          // 	},
          // ]),
          color: {
            type: "linear",
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0.1,
                color: "rgba(250, 158, 21,.8)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(250, 158, 21,.1)", // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        type: "line",
        symbol: "none",
        showSymbol: false,
        smooth: true,
        name: "2022年",
        lineStyle: {
            width: 1,
            color: "rgba(1, 114, 255,.5)", // 线条颜色
        },
        data: [
          500, 200, 200, 300, 600, 50, 50, 60, 300, 600, 500, 300, 50, 100,
        ],
        areaStyle: {
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          // 	{
          // 		offset: 0,
          // 		color: "#01B3E4",
          // 	},
          // 	{
          // 		offset: 1,
          // 		color: "#86DCF3",
          // 	},
          // ]),
          color: {
            type: "linear",
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0.1,
                color: "rgba(2, 118, 254,.8)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(2, 118, 254,.1)", // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        type: "line",
        symbol: "none",
        showSymbol: false,
        smooth: true,
        name: "2023年",
        lineStyle: {
            width: 1,
            color: "rgba(249, 96, 141,.5)", // 线条颜色
        },
        data: [30, 500, 200, 30, 20, 600, 50, 60, 300, 50, 500, 40, 50, 100],
        areaStyle: {
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          // 	{
          // 		offset: 0,
          // 		color: "#01B3E4",
          // 	},
          // 	{
          // 		offset: 1,
          // 		color: "#86DCF3",
          // 	},
          // ]),
          color: {
            type: "linear",
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0.1,
                color: "rgba(247, 97, 160,.8)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(247, 97, 160,.1)", // 100% 处的颜色
              },
            ],
          },
        },
      },
    ],
  };
  LineChart.setOption(option1);
  //预约渠道数据统计渲染饼图
  let PieChart = echarts.init(RefPieChart.value);
  function Pie() {
    let dataArr = [];
    for (var i = 0; i < 150; i++) {
      if (i % 3 === 0) {
        dataArr.push({
          name: (i + 1).toString(),
          value: 10,
          itemStyle: {
            color: "#fff",
            borderWidth: 0,
            borderColor: "rgba(0,0,0,0)",
          },
        });
      } else {
        dataArr.push({
          name: (i + 1).toString(),
          value: 25,
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
  let option2 = {
    backgroundColor: "#031845",
    tooltip: {
      trigger: "item",
      formatter: "{b} : {d}% <br/> {c}",
    },
    legend: {
      orient: "vertical",
      icon: "circle",
      left: 40,
      top: "center",
      textStyle: {
        color: "#fff",
      },
      data: ["智慧文旅平台", "携程", "飞猪", "其他"],
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        center: ["70%", "50%"],
        color: [
          "#0E7CE2",
          "#FF8352",
          "#E271DE",
          "#F8456B",
          "#00FFFF",
          "#4AEAB0",
        ],
        itemStyle: {
          borderColor: "#031845",
          borderWidth: 10,
        },
        data: [
          {
            value: 335,
            name: "智慧文旅平台",
          },
          {
            value: 310,
            name: "携程",
          },
          {
            value: 234,
            name: "飞猪",
          },
          {
            value: 235,
            name: "其他",
          },
        ],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        radius: ["12%", "14%"],
        center: ["70%", "50%"],
        color: ["#ffffff", "red"],
        startAngle: 105,
        data: [
          {
            value: 30,
            name: "",
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: 5,
            name: "",
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: 65,
            name: "ddd",
            itemStyle: {
              color: "#ffffff",
            },
          },
        ],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        radius: [0, "16%"],
        center: ["70%", "50%"],
        startAngle: 90,
        data: [
          {
            value: 25,
            name: "1",
            itemStyle: {
              color: "transparent",
              borderWidth: 4,
              borderColor: "#ffffff",
            },
          },

          {
            value: 75,
            name: "2",
            itemStyle: {
              color: "transparent",
            },
          },
        ],
        selectedOffset: 10,

        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        radius: ["65%", "66%"],
        center: ["70%", "50%"],
        color: [
          "#0b76dc",
          "transparent",
          "#0b76dc",
          "transparent",
          "#0b76dc",
          "transparent",
        ],
        data: [
          {
            value: 17,
            name: "11",
          },
          {
            value: 17,
            name: "22",
          },
          {
            value: 17,
            name: "33",
          },
          {
            value: 17,
            name: "44",
          },
          {
            value: 17,
            name: "55",
          },
          {
            value: 17,
            name: "66",
          },
        ],

        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        zlevel: 0,
        silent: true,
        radius: ["25%", "26%"],
        center: ["70%", "50%"],
        z: 10,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: Pie(),
      },
      {
        type: "pie",
        zlevel: 0,
        silent: true,
        radius: ["34%", "36%"],
        center: ["70%", "50%"],
        z: 10,
        startAngle: 90,
        label: {
          show: false,
        },
        color: ["red", "blue", "red", "blue"],

        labelLine: {
          show: false,
        },

        data: [
          {
            name: "r1",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(51,149,191,0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(51,149,191,0)",
                },
              ]),
            },
          },
          {
            name: "r2",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(0,0,0,0)",
                },
                {
                  offset: 1,
                  color: "rgba(51,149,191,0.5)",
                },
              ]),
            },
          },
          {
            name: "r3",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(51,149,191,0)",
                },
                {
                  offset: 1,
                  color: "rgba(51,149,191,0.5)",
                },
              ]),
            },
          },
          {
            name: "r4",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(51,149,191,0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
          },
        ],
      },
    ],
  };

  PieChart.setOption(option2);
  onBeforeUnmount(() => {
    // 在组件销毁前执行清除数据和销毁echarts实例的操作
    LineChart.dispose();
    PieChart.dispose();
  });
});
</script>

<style lang="scss" scoped>
.rightBox {
  width: 430px;
  display: flex;
  flex-direction: column;
  padding-right: 40px;
  transform: translateY(-20px);
  .ScenicSpotsRanking {
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
    table {
      width: 360px;
      margin: 20px auto;
      text-align: center;
      tr {
        height: 45px;
        font-size: 12px;
        line-height: 45px;
      }
      tr:nth-child(1) {
        background: url("../images/rankingChart-bg.png") no-repeat;
        background-size: 360px 32px;
        height: 32px;
        line-height: 32px;
        color: #e5b75f;
      }
      tr:nth-child(2) {
        td {
          margin-top: 30px;
        }
      }
      tr:nth-child(n + 2) {
        td:nth-child(1) {
          display: flex;
          justify-content: center;
          align-items: center;
          div {
            position: relative;
            line-height: 20px;
            width: 60px;
            height: 0;
            border-bottom: 20px solid #263776;
            border-left: 5px solid transparent;
            border-right: 0px solid transparent;
            span {
              position: relative;
              z-index: 2;
              font-style: italic;
            }
            &:after {
              position: absolute;
              top: 0px;
              right: 0px;
              display: block;
              content: "";
              width: 20px;
              height: 20px;
              width: 55px;
              height: 0;
              border-bottom: 20px solid #365f92;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              transform: rotate(180deg);
            }
          }
        }
        td:nth-child(3) {
          display: flex;
          justify-content: center;
          div.box {
            position: relative;
            display: inline-block;
            border: 1px solid #2c73a0;
            border-radius: 10px;
            height: 20px;
            width: 120px;
            line-height: 20px;
            overflow: hidden;
            span {
              position: relative;
              z-index: 2;
            }
            div.ProgressBar {
              position: absolute;
              top: 0px;
              left: 0px;
              height: 20px;
              background-color: #017edb;
              width: 1px;
              transform-origin: left;
              transform: scaleX(30);
            }
          }
        }
      }
      tr:nth-child(2) {
        td:nth-child(1) {
          div {
            &:after {
              border-bottom: 20px solid #b8604a;
            }
          }
        }
      }
      tr:nth-child(3) {
        td:nth-child(1) {
          div {
            &:after {
              border-bottom: 20px solid #c29546;
            }
          }
        }
        td:nth-child(3) {
          div.box {
            div.ProgressBar {
              background-color: #ec8478;
            }
          }
        }
      }
      tr:nth-child(4) {
        td:nth-child(1) {
          div {
            &:after {
              border-bottom: 20px solid #1362ba;
            }
          }
        }
        td:nth-child(3) {
          div.box {
            div.ProgressBar {
              background-color: #48bdda;
            }
          }
        }
      }
      tr:nth-child(5) {
        td:nth-child(3) {
          div.box {
            div.ProgressBar {
              background-color: #f3ab30;
            }
          }
        }
      }
      tr:nth-child(6) {
        td:nth-child(3) {
          div.box {
            div.ProgressBar {
              background-color: #9478f3;
            }
          }
        }
      }
    }
  }
  .touristAmount {
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
    .LineChartBox {
      .LineChart {
        width: 383px;
        height: 240px;
      }
    }
  }
  .subscribe {
    margin-top: 20px;
    background: url("../images/dataScreen-main-rt.png") no-repeat;
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
    .PieChartBox {
      .PieChart {
        width: 100%;
        height: 270px;
      }
    }
  }
}
</style>
