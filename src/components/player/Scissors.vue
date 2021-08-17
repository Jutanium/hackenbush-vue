<template>
  <div class="scissors">
    <!--Adapted from Ben Young's Codepen: https://codepen.io/bendalis/pen/dvKBZd?editors=1100-->
    <div class="half">
      <div class="blade"></div>
      <div class="handle"></div>
    </div>

    <div class="half">
      <div class="blade"></div>
      <div class="handle"></div>
    </div>

    <div class="joint rounded-full"></div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    animationProgress: {
      type: Number,
      default: 0.5
    },
    startAmplitude: {
      type: Number,
      default: 20
    },
    endAmplitude: {
      type: Number,
      default: 80
    },
    isRed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      reds: {
        handle: "#710500",
        blade: "#bd0900",
        joint: "#ebb5b2"
      },
      blues: {
        handle: "#1E3A8A",
        blade: "#3B82F6",
        joint: "#BFDBFE"
      }
    }
  },
  computed: {
    halfRotation() {
      return 0.5 * (this.startAmplitude + this.animationProgress * (this.endAmplitude - this.startAmplitude));
    },
    topHalfDegrees() {
      return this.halfRotation + 'deg';
    },
    bottomHalfDegrees() {
      return `-${this.halfRotation}deg`;
    },
    colors() {
      return this.isRed ? this.reds : this.blues;
    }
  }
})
</script>

<style scoped>

.scissors {
  position: relative;
  transform-origin: 2rem 0.5rem;
}

.half {
  width: 4rem;
  height: 0.75rem;
  position: absolute;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform-origin: 54.375% 100% 0;
  transform: rotate(v-bind(topHalfDegrees));
}

.half:nth-child(even) {
  top: 0.5rem;
  transform-origin: 54.375% 0% 0;
  transform: rotate(v-bind(bottomHalfDegrees));
}

.half:nth-child(even) .blade {
  top: 0;
  border-radius: 0 0.25rem 0 0;
}

.half:nth-child(even) .blade:after {
  top: 0.25rem;
  border-style: solid;
  border-width: 0.25rem 0.5rem 0 0.5rem;
  border-color: v-bind(colors.blade) transparent transparent transparent;
}

.joint {
  width: 0.175rem;
  height: 0.175rem;
  border-radius: 50%;
  background: v-bind(colors.joint);
  position: absolute;
  top: 0.5375rem;
  left: 2.1rem;
}

.handle {
  width: 1.5rem;
  height: 0.75rem;
  border-radius: 0.375rem;
  border: 0.25rem solid v-bind(colors.handle);
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.blade {
  width: 2.5rem;
  height: 0.25rem;
  position: absolute;
  top: 0.5rem;
  left: 1.5rem;
  background: v-bind(colors.blade);
  border-radius: 0 0 0.25rem 0;
}

.blade:before {
  content: '';
  width: 0.75rem;
  height: 0.25rem;
  background: v-bind(colors.blade);
  position: absolute;
  top: 0;
  left: -0.75rem;
}

.blade:after {
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0.5rem 0.25rem 0.5rem;
  border-color: transparent transparent v-bind(colors.blade) transparent;
  position: absolute;
  top: -0.25rem;
  left: -0.5rem;
}

</style>