<template>
  <div class="container">
    <div class="scissors">
      <div class="half">
        <div class="blade"></div>
        <div class="handle"></div>
      </div>

      <div class="half">
        <div class="blade"></div>
        <div class="handle"></div>
      </div>

      <div class="joint"></div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  props: {},
  setup: () => {
  },
  data() {
    return {
      handleWidth: '8em',
      bladeWidth: '15em',
      div: 4,
      startAngle: '20deg',
      endAngle: '80deg',
      bladeCol: "#BD0900",
      jointCol: "#ebb5b2",
      handlesCol:"#710500"
    }
  },
  computed: {
    totalWidth() {
      return `calc(${this.handleWidth} + ${this.bladeWidth})`;
    },
    handleHeight() {
      return `calc(${this.handleWidth} / 2)`;
    },
    handleThickness() {
      return `calc(${this.handleHeight} / ${this.div})`;
    },
    bladeHeight() {
      return this.handleHeight;
    },
    twiceBladeHeight() {
      return this.bladeHeight * 2;
    },
    jointDiameter() {
      return `calc(${this.bladeHeight} * 0.7)`;
    },
    leftPos() {
      return `calc(${this.handleWidth} + 2 * ${this.bladeHeight} + ${this.handleWidth})`;
    },
    leftPosPercent() {
      return `calc(${this.leftPos} * 100% / (${this.bladeWidth} + ${this.handleWidth}) )`
    },
    leftPercentJoint() {
      return `calc(${this.leftPosPercent} - (${this.jointDiameter} * 100% / (${this.bladeWidth} + ${this.handleWidth}) / 2))`
    }
  }
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.scissors {
  position: relative;
  width: v-bind(totalWidth);
  height: calc(2 * v-bind(handleHeight) - v-bind(bladeHeight));
  margin: calc(v-bind(bladeWidth) / 2) auto;
}

.half {
  width: v-bind(totalWidth);
  height: v-bind(handleHeight);
  position: absolute;
  top: 0;
  left: 0;

  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform-origin: v-bind(leftPosPercent) 100% 0;
  transform: rotate(calc(v-bind(startAngle) / 2));
  /*animation: rot-up 1s ease-out infinite;*/
}

.half:nth-child(even) {
  top: calc(v-bind(handleHeight) - v-bind(bladeHeight));
  transform-origin: v-bind(leftPosPercent) 0% 0;
  transform: rotate(calc(-1 * v-bind(startAngle) / 2));
  /*animation: rot-down 1s ease-out infinite;*/
}

.half:nth-child(even) .blade {
  top: 0;
  border-radius: 0 v-bind(bladeHeight) 0 0;
}

.half:nth-child(even) .blade:after {
  top: v-bind(bladeHeight);
  border-style: solid;
  border-width: v-bind(bladeHeight) v-bind(twiceBladeHeight) 0 v-bind(twiceBladeHeight);
  border-color: v-bind(bladeCol) transparent transparent transparent;
}

.joint {
  width: v-bind(jointDiameter);
  height: v-bind(jointDiameter);
  border-radius: 50%;
  background: v-bind(jointCol);
  position: absolute;
  top: calc(v-bind(handleHeight) - v-bind(bladeHeight) / 2 - v-bind(jointDiameter) / 2);
  left: v-bind(leftPercentJoint);
}


.handle {
  width: v-bind(handleWidth);
  height: v-bind(handleHeight);
  border-radius: calc(v-bind(handleHeight) / 2);
  border: v-bind(handleThickness) solid v-bind(handlesCol);
  background: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.blade {
  width: v-bind(bladeWidth);
  height: v-bind(bladeHeight);
  position: absolute;
  top: calc(v-bind(handleHeight) - v-bind(bladeHeight));
  left: v-bind(handleWidth);
  background: v-bind(bladeCol);
  border-radius: 0 0 v-bind(bladeHeight) 0;
}

.blade:before {
  content: '';
  width: calc(v-bind(handleWidth) / 2);
  height: v-bind(bladeHeight);
  background: v-bind(bladeCol);
  position: absolute;
  top: 0;
  left: calc(-1 * v-bind(handleWidth) / 2);
}

.blade:after {
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 v-bind(twiceBladeHeight) v-bind(bladeHeight) v-bind(twiceBladeHeight);
  border-color: transparent transparent v-bind(bladeCol) transparent;
  position: absolute;
  top: calc(-1 * v-bind(bladeHeight));
  left: calc(-1 * v-bind(bladeHeight) * 2);
}
</style>