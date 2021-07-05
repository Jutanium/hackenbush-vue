<template>

  <div>
    <div v-if="!pictureMode" class="turnBox">
      <div v-if="!currentPlayer.red && !currentPlayer.blue">
        Who goes first?
        <button class="blue" @click="currentPlayer.blue = true">
          bLue
        </button> or
        <button class="red" @click="currentPlayer.red = true">
          Red
        </button>
      </div>
      <div v-else-if="gameOver">
        <span :class="currentPlayerClass">{{playerString}}</span> loses!
      </div>
      <div v-else :class="currentPlayerClass">
          Turn {{turn}}.
        </div>
    </div>
    <svg ref="svg" viewBox="0 0 100 100">

      <rect class="drawnGround"
            :width="100" :height="5" :y="95" fill="green">
      </rect>

      <g v-for="segment in segmentRenders">
        <PiecePath class="piece" :segment="segment" :class="{clickable: clickable(segment)}"
                   @click="pieceClicked(segment)"
        >
        </PiecePath>
        <circle :cx="segment.start.x" :cy="segment.start.y" :r="2"></circle>
        <circle :cx="segment.end.x" :cy="segment.end.y" :r="2"></circle>
      </g>

    </svg>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType} from "vue"
import {Connection, Segment} from "@/model/segment";
import PiecePath from "@/components/shared/PiecePath.vue";
import {buildGraph, Graph} from "@/model/graph";

export default defineComponent({
  components: {PiecePath},
  props: {
    pictureMode: {
      type: Boolean,
      default: false,
    },
    segments: {
      type: Object as PropType<{ [id: string]: Segment }>,
      required: true
    },
    groundY: {
      type: Number,
      default: 95
    }
  },
  setup: () => {
  },
  data() {
    return {
      turn: 1,
      currentPlayer: {
        red: false,
        blue: false
      }
    }
  },
  computed: {
    gameOver (): Boolean {
      return this.segmentRenders.filter(this.clickable).length == 0;
    },
    currentPlayerClass (): {red: Boolean, blue: Boolean} {
      return {red: this.currentPlayer.red, blue: this.currentPlayer.blue}
    },
    playerString (): String {
      return this.currentPlayer.red ? "Red" : "bLue";
    },
    segmentRenders (): Array<Segment> {
      this.turn;
      if (this.graph) {
        return Object.values(this.segments).filter(s => this.graph?.reachesGround(s.id));
      }
      return []
    },
    graph (): Graph | undefined {
      if (this.segments) {
        return buildGraph(this.segments, this.groundY);
      }
    }

  },
  methods: {
    clickable (segment: Segment): Boolean {
      if (this.pictureMode) return false;
      return segment.color == "green" || this.currentPlayer[segment.color]
    },
    pieceClicked (segment: Segment) {
      if (this.clickable(segment)) {
        this.graph.removeEdge(segment.id);
        this.nextTurn();
      }
    },
    nextTurn() {
      this.togglePlayer();
      this.turn++;
    },
    togglePlayer() {
      this.currentPlayer.red = !this.currentPlayer.red;
      this.currentPlayer.blue = !this.currentPlayer.blue;
    }
  },
})
</script>

<style scoped>
  .turnBox {
    margin-left: 20px;
    margin-top:20px;
    font-size: 18pt;
  }
  .turnBox button {
    font-size: 18pt;
  }
  svg {
    width: 100%
  }
  .clickable:hover {
    opacity: 40%
  }
  .red {
    color: red
  }
  .blue {
    color: blue
  }
  .piece {
    stroke-width: 3;
  }
  @media (min-width:1025px) {
    .piece {
      stroke-width: 1
    }
  }

</style>