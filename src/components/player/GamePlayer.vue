<template>
  <div>
    <div v-if="!pictureMode && showTurn" class="absolute left-8 top-8 text-xl">
      <div v-if="!currentPlayer">
        Who goes first?
        <button :class="playerDisplay.blue.class" @click="nextTurn(Color.Blue)">
          {{ playerDisplay.blue.text }}
        </button>
        or
        <button :class="playerDisplay.red.class" @click="nextTurn(Color.Red)">
          {{ playerDisplay.red.text }}
        </button>
      </div>
      <div v-else-if="playerWon">
        <!--Red can't move, so bLue wins!-->
        <span :class="playerDisplay[otherPlayer(playerWon)].class">
          {{ playerDisplay[otherPlayer(playerWon)].text }}
        </span>
        can't move, so
        <span :class="playerDisplay[playerWon].class">
         {{ playerDisplay[playerWon].text }}
        </span>
        wins
      </div>
      <div v-else :class="currentPlayerClass">
        Turn {{ turn }}.
      </div>
      <!--      <div v-if="gameValue != undefined">-->
      <!--        Game value: {{gameValue}}-->
      <!--      </div>-->
    </div>


    <Scissors v-show="turn" v-for="color in ai"
              :is-red="color === Color.Red"
              :ref="el => scissors[color].ref = el"
              :animation-progress="scissors[color].cutProgress"
    ></Scissors>

    <svg ref="svg" viewBox="0 0 100 100">

      <rect class="drawnGround"
            :width="100" :height="5" :y="95" fill="green">
      </rect>

      <g v-for=" ([id, {segment, offsetY, opacity}]) in Object.entries(segmentRenders)"
         :style="{transform: `translateY(${offsetY}px)`, opacity}">
        <title v-if="debugMode">{{segment.id}}</title>
        <PiecePath :segment="segment" :class="{clickable: clickable(segment)}"
                   @click="pieceClicked(segment)"
        >
        </PiecePath>
        <circle class="lg:hidden" :cx="segment.start.x" :cy="segment.start.y" :r="1.5"></circle>
        <circle class="lg:hidden" :cx="segment.end.x" :cy="segment.end.y" :r="1.5"></circle>
        <circle class="hidden lg:block" :cx="segment.start.x" :cy="segment.start.y" :r="1"></circle>
        <circle class="hidden lg:block" :cx="segment.end.x" :cy="segment.end.y" :r="1"></circle>
      </g>

    </svg>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, reactive, ref, unref} from "vue"
import {Segment} from "@/model/segment";
import PiecePath from "@/components/shared/PiecePath.vue";
import {buildGraph, Graph} from "@/model/graph";
import {Color} from "@/model/segment-color";
import Scissors from "@/components/player/Scissors.vue";

import {gsap} from "gsap";
import Tween = gsap.core.Tween;
import Timeline = gsap.core.Timeline;

type Player = Color.Red | Color.Blue
export default defineComponent({
  components: {Scissors, PiecePath},
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
    startingPlayer: {
      type: String as PropType<Player>,
    },
    ai: {
      type: Array as PropType<Array<Player>>,
      default: () => ([])
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
  setup: (props) => {
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

    const otherPlayer = (player: Player) => player == Color.Red ? Color.Blue : Color.Red;

    const svg = ref<SVGElement>();
    // const segmentRefs: { [id: string]: SVGPathElement} = {}
    const segmentRenders = reactive(
        Object.fromEntries(
            Object.values(props.segments).map(segment => [segment.id,
              {
                segment,
                offsetY: 0,
                opacity: 1
              }
            ])
        )
    );

    const scissors = {
      red: reactive({
        ref: null,
        lastPos: {x: 80, y: 50},
        cutProgress: 0.6,
        rotation: 180,
        moveOffset: {x: -10, y: -5}
      }),
      blue: reactive({
        ref: null,
        lastPos: {x: 10, y: 50},
        cutProgress: 0.6,
        moveOffset: {x: -42, y: -10}
      }),
    }

    function animateScissors(color: Player, segment: Segment, onComplete: () => void) {
      const scissorsEl = unref(scissors[color].ref)?.$el;
      if (!scissorsEl) return;

      const cutpoint = (dim: "x" | "y") => (segment.start[dim] + segment.end[dim]) / 2;

      const {clientWidth, clientHeight} = unref(svg)!;
      const moveOffset = scissors[color].moveOffset;
      const x = (cutpoint("x") / 100) * clientWidth + moveOffset.x;
      const y = (cutpoint("y") / 100) * clientHeight + moveOffset.y;
      const speed = 350; //px/seconds
      const lastPos = scissors[color].lastPos;
      const duration = Math.sqrt((lastPos.x - x) ** 2 + (lastPos.y - y) ** 2) / speed;
      lastPos.x = x;
      lastPos.y = y;

      const timeline = gsap.timeline({
        onComplete
      })

      // scissors[color].cutProgress = 0.6;

      const move = timeline.to(scissorsEl, {
        x,
        y,
        ease: "none",
        duration
      });

      const open = timeline.to(scissors[color], {
        cutProgress: 1,
        duration: 0.4,
      }, "-=0.4")
      const shut = timeline.to(scissors[color], {
        cutProgress: 0,
        duration: 0.3
      })
    }

    return {
      scissors,
      segmentRenders,
      playerDisplay,
      otherPlayer,
      svg,
      Color,
      animateScissors
    }
  },
  data() {
    return {
      turn: 0,
      currentPlayer: false as Player | false,
      gameValue: undefined as undefined | number,
      leavingAnimation: undefined as undefined | Timeline,
    }
  },
  created() {
  },
  mounted() {
    if (this.graph) {
      this.gameValue = this.graph.evaluate();
    }
    Object.values(this.scissors).forEach(scissors => {
      if (scissors.ref?.$el) {
        const {x, y} = scissors.lastPos;
        const {clientWidth, clientHeight} = this.svg!;
        gsap.set(scissors.ref!.$el, {
          x: (x / 100) * clientWidth,
          y: (y / 100) * clientHeight,
          ...(scissors?.rotation && {rotation: scissors.rotation})
        })
      }
    })
    if (this.startingPlayer) {
      this.nextTurn(this.startingPlayer);
    }
  },
  computed: {
    playerWon(): false | Player {
      if (!this.currentPlayer) {
        return false;
      }
      const colorsLeft = this.liveSegments.map(segment => segment.color);
      if (!colorsLeft.includes(this.currentPlayer)) {
        return this.otherPlayer(this.currentPlayer);
      }
      return false;
    },
    currentPlayerClass(): String | undefined {
      if (this.currentPlayer) {
        return this.playerDisplay[this.currentPlayer].class;
      }
    },
    currentPlayerString(): String | undefined {
      if (this.currentPlayer) {
        return this.playerDisplay[this.currentPlayer].text;
      }
    },
    liveSegments(): Array<Segment> {
      this.turn;
      if (this.graph) {
        return Object.values(this.graph.liveSegments);
        // return Object.values(this.segments).filter(s => this.graph?.reachesGround(s.id));
      }
      return []
    },
    graph(): Graph | undefined {
      if (this.segments) {
        return buildGraph(this.segments, this.groundY);
      }
    }
  },
  methods: {
    clickable(segment: Segment): Boolean {
      if (this.puppetMode || this.pictureMode) return false;
      return segment.color == "green" || segment.color == this.currentPlayer
    },
    pieceClicked(segment: Segment) {
      if (this.clickable(segment)) {
        this.removeEdge(segment);
      }
    },
    removeEdge(segment: Segment) {
      if (this.graph) {
        const floating = this.graph.removeEdge(segment.id);
        console.log(floating);
        const timeline = gsap.timeline();
        timeline.fromTo(this.segmentRenders[segment.id], {opacity: 0.5}, {
          duration: 0.5,
          opacity: 0
        });
        if (floating.length) {
          timeline.to(floating.map(id => this.segmentRenders[id]), {
            ease: "power1.in",
            duration: 1,
            offsetY: "-=100"
          }, "<");
        }
        this.leavingAnimation = timeline;
        this.gameValue = this.graph.evaluate();
        this.nextTurn();
      }
    },
    nextTurn(firstTurnPlayer?: Player) {
      if (firstTurnPlayer) {
        this.currentPlayer = firstTurnPlayer;
        if (this.puppetMode) {
          this.turn++;
          return;
        }
      } else {
        this.togglePlayer();
      }
      this.turn++;

      if (this.ai.includes(this.currentPlayer) && !this.playerWon) {
        const aiMove = this.graph.bestMoveForColor(this.currentPlayer as Color);
        this.animateScissors(this.currentPlayer, aiMove, () => {
          this.removeEdge(aiMove)
        })
      }
    },
    togglePlayer() {
      if (this.currentPlayer) {
        this.currentPlayer = this.otherPlayer(this.currentPlayer);
      }
    }
  },
})
</script>

<style scoped>
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

</style>