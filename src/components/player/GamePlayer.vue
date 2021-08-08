<template>

  <div>
    <div v-if="!pictureMode && showTurn" class="turnBox">
      <div v-if="!currentPlayer && !puppetMode">
        Who goes first?
        <button :class="playerDisplay.blue.class" @click="currentPlayer = 'blue'">
          {{playerDisplay.blue.text}}
        </button> or
        <button :class="playerDisplay.red.class" @click="currentPlayer = 'red'">
          {{playerDisplay.red.text}}
        </button>
      </div>
      <div v-else-if="playerWon">
        <!--Red can't move, so bLue wins!-->
        <span :class="playerDisplay[otherPlayer(playerWon)].class">
          {{playerDisplay[otherPlayer(playerWon)].text}}
        </span>
          can't move, so
        <span :class="playerDisplay[playerWon].class">
         {{playerDisplay[playerWon].text}}
        </span>
         wins
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
        <title v-if="debugMode">{{segment.id}}</title>
        <PiecePath class="piece" :segment="segment" :class="{clickable: clickable(segment)}"
                   @click="pieceClicked(segment)"
        >
        </PiecePath>
        <circle :cx="segment.start.x" :cy="segment.start.y" :r="1.5"></circle>
        <circle :cx="segment.end.x" :cy="segment.end.y" :r="1.5"></circle>
      </g>

    </svg>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import {Segment} from "@/model/segment";
import PiecePath from "@/components/shared/PiecePath.vue";
import {buildGraph, Graph} from "@/model/graph";
import {Color} from "@/model/segment-color";

type Player = "red" | "blue";
export default defineComponent({
  components: {PiecePath},
  props: {
    pictureMode: {
      type: Boolean,
      default: false,
    },
    debugMode: {
      type: Boolean,
      default: true
    },
    puppetMode: {
      type: Boolean,
      default: false,
    },
    showTurn: {
      type: Boolean,
      default: true
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
    const playerDisplay = {
      red: {
        class: "red",
        text: "Red"
      },
      blue: {
        class: "blue",
        text: "bLue"
      },
    }
    const otherPlayer = (player: Player) => player == "red" ? "blue" : "red";
    return {
      playerDisplay,
      otherPlayer
    }
  },
  data() {
    return {
      turn: 1,
      currentPlayer: false as Player | false,
    }
  },
  computed: {
    playerWon (): false | Player {
      const colorsLeft = this.segmentRenders.map(segment => segment.color);
      if (!colorsLeft.includes(Color.Red)) {
        return "blue"
      }
      if (!colorsLeft.includes(Color.Blue)) {
        return "red";
      }
      return false;
    },
    currentPlayerClass (): String {
      if (this.currentPlayer) {
        return this.playerDisplay[this.currentPlayer].class;
      }
    },
    currentPlayerString (): String {
      if (this.currentPlayer) {
        return this.playerDisplay[this.currentPlayer].text;
      }
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
      if (this.puppetMode || this.pictureMode) return false;
      return segment.color == "green" || segment.color == this.currentPlayer
    },
    pieceClicked (segment: Segment) {
      if (this.clickable(segment) && this.graph) {
        this.graph.removeEdge(segment.id);
        this.nextTurn();
      }
    },
    nextTurn() {
      this.togglePlayer();
      this.turn++;
    },
    togglePlayer() {
      this.currentPlayer = this.otherPlayer(this.currentPlayer);
    }
  },
})
</script>

<style scoped>
  .turnBox {
    position: absolute;
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
    @apply text-red-500
  }
  .blue {
    @apply text-blue-600
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