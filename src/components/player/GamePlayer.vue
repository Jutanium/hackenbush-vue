<template>

  <div>
    <div class="turnBox">
      <div v-if="turn == 1">
        <button :class="currentPlayerClass"
        @click="togglePlayer">
          {{playerString}}
        </button> will go first. Take your turn!
      </div>
      <div v-else :class="currentPlayerClass">
        Turn {{turn}}.
      </div>
      <div v-if="gameOver">
        <span :class="currentPlayerClass">{{playerString}}</span> loses!
      </div>
    </div>
    <svg ref="svg" viewBox="0 0 100 100">

      <rect class="drawnGround"
            :width="100" :height="5" :y="95" fill="green">
      </rect>

      <g v-for="segment in segmentRenders">
        <PiecePath :segment="segment" :class="{clickable: clickable(segment)}"
                   @click="pieceClicked(segment)"
        >
        </PiecePath>
        <circle :cx="segment.start.x" :cy="segment.start.y" :r="1"></circle>
        <circle :cx="segment.end.x" :cy="segment.end.y" :r="1"></circle>
      </g>

    </svg>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType} from "vue"
import {Connection, Segment} from "@/model/segment";
import PiecePath from "@/components/shared/PiecePath.vue";
import {buildGraph} from "@/model/graph";

export default defineComponent({
  components: {PiecePath},
  props: {
    segments: {
      type: Object as PropType<{ [id: string]: Segment }>,
      required: true
    },
    groundConnections: {
      type: Array as PropType<Array<Connection>>,
      required: true
    }
  },
  setup: () => {
  },
  data() {
    return {
      turn: 1,
      currentPlayer: {
        red: true,
        blue: false
      }
    }
  },
  computed: {
    gameOver () {
      return this.segmentRenders.filter(this.clickable).length == 0;
    },
    currentPlayerClass () {
      return {red: this.currentPlayer.red, blue: this.currentPlayer.blue}
    },
    playerString () {
      return this.currentPlayer.red ? "Red" : "Blue";
    },
    segmentRenders (): Array<Segment> {
      this.turn;
      return Object.values(this.segments).filter(s => this.graph.touchesGround(s.id));
    },
    graph () {
      if (this.segments) {
        return buildGraph(this.segments, this.groundConnections);
      }
    }

  },
  methods: {
    clickable (segment: Segment): Boolean {
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
    width: 60%
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
</style>