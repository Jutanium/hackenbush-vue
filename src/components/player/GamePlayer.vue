<template>
  <div>
    <PlayerSelect v-if="!currentPlayer" :starting="startingPlayer" @submit="playerSelected"
                  class="absolute w-1/2 top-20 left-10"
    />
    <div v-if="!pictureMode && showTurn" class="absolute top-14 left-10 text-xl lg:text-2xl">
      <div v-if="playerWon">
        <span :class="playerDisplay[otherPlayer(playerWon)].class">
          {{ playerDisplay[otherPlayer(playerWon)].text }}
        </span>
        can't move, so
        <span :class="playerDisplay[playerWon].class">
         {{ playerDisplay[playerWon].text }}
        </span>
        wins
        <button v-if="promptReset"
                @click="resetButtonClick"
                class="h-12 px-6 m-2 text-lg text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600">
          {{promptReset.text}}</button>
      </div>
      <div v-else-if="currentPlayerString">
        <span :class="currentPlayerClass">
          {{currentPlayerString}}'s Turn.
        </span>
        <span v-if="!ai.includes(currentPlayer)">
          Click a <span :class="currentPlayerClass">segment</span>!
        </span>
      </div>
    </div>

    <g>
      <Scissors v-for="color in [Color.Red, Color.Blue]"
                v-show="ai.includes(color)"
                :is-red="color === Color.Red"
                :ref="el => scissorsRenders[color].ref = el"
                :animation-progress="scissorsRenders[color].cutProgress"
                :style="{transform: scissorsRenders[color].transform, opacity: scissorsOpacity}"
      ></Scissors>
    </g>

    <svg ref="svg" viewBox="0 0 100 100" class="border border-black">

      <rect class="drawnGround"
            :width="100" :height="5" :y="95" fill="green">
      </rect>

      <template v-for=" ([id, {segment, style, live, animating}]) in Object.entries(segmentRenders).filter( ([_, val]) => Boolean(val))">
        <g :style="style" v-if="live || animating">
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
      </template>

    </svg>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  toRef,
  unref,
  watch,
  watchEffect
} from "vue"
import {Segment} from "@/model/segment";
import PiecePath from "@/components/shared/PiecePath.vue";
import {buildGraph, Graph} from "@/model/graph";
import {Color} from "@/model/segment-color";
import Scissors from "@/components/player/Scissors.vue";

import {gsap} from "gsap";
import Tween = gsap.core.Tween;
import Timeline = gsap.core.Timeline;

import cloneDeep from "lodash.clonedeep";
import PlayerSelect from "@/components/player/PlayerSelect.vue";

type Player = Color.Red | Color.Blue
export default defineComponent({
  components: {PlayerSelect, Scissors, PiecePath},
  emits: ['gameover', 'segmentClicked'],
  props: {
    pictureMode: {
      type: Boolean,
      default: false,
    },
    debugMode: {
      type: Boolean,
      default: true
    },
    startingPlayer: {
      type: String as PropType<Player>,
    },
    aiControls: {
      type: Array as PropType<Array<Player>>,
      default: () => ([])
    },
    showTurn: {
      type: Boolean,
      default: true
    },
    promptReset: {
      type: [Object, Boolean] as PropType<{text: string, choosePlayer?: boolean, subgraph?: string} | false>,
      default: () => ({
        text: "Play Again",
        choosePlayer: true,
        chooseStarting: true,
      })
    },
    segments: {
      type: Object as PropType<{ [id: string]: Segment }>,
      required: true
    },
    groundY: {
      type: Number,
      default: 95
    },
    //For tutorial
    scissorsOffsetY: {
      type: Number,
      default: 0
    },
    scissorsOpacity: {
      type: Number,
      default: 1
    },
    segmentsOpacity: {
      type: Number
    },
    //For outside control. Set subgraph/autoplay, then increment flush
    subgraph: {
      type: String
    },
    autoplay: {
      type: [Boolean, Number],
      default: false,
    },
    preventClick: {
      type: Boolean,
      default: false,
    },
    flush: {
      type: Number
    },
    resetScissorsOnFlush: {
      type: Boolean,
      default: true
    },
    stopAnimationOnFlush: {
      type: Boolean,
      default: true
    }
  },
  setup: (props, {emit}) => {
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

    const graph = computed(() => {
      return buildGraph(props.segments, props.groundY);
    });

    const liveIds = ref(new Set(Object.keys(graph.value.getLiveSegments())));

    const gameValue = ref<number>(graph.value.evaluate());

    const currentPlayer = ref<Player | false>(false);
    const ai = ref(props.aiControls);
    const turn = ref(0);

    const autoplayCounter = ref(0);
    const aiIsMoving = ref(false);

    const svg = ref<SVGElement>();

    const playingAgain = ref(false);

    const animations: {scissors: Set<Timeline>, segments: Set<Timeline>} = {
      scissors: new Set(),
      segments: new Set()
    }

    const scissorsRendersInitial = {
      red: {
        lastPos: {x: 80, y: 50},
        cutProgress: 0.6,
        rotation: 180,
        translateX: 0,
        translateY: 0,
        moveOffset: {x: -10, y: -5},
      },
      blue: {
        lastPos: {x: 10, y: 50},
        cutProgress: 0.6,
        moveOffset: {x: -42, y: -10},
        rotation: 0,
        translateX: 0,
        translateY: 0,
      }
    }


    const scissorsRenders = {
      red: reactive({
        ...cloneDeep(scissorsRendersInitial.red),
        ref: null,
        transform: undefined as undefined | ComputedRef,
      }),
      blue: reactive({
        ...cloneDeep(scissorsRendersInitial.blue),
        ref: null,
        transform: undefined as undefined | ComputedRef,
      }),
    }

    Object.values(scissorsRenders).forEach(scissors =>
      scissors.transform = computed(
        () => {
          const {translateX, translateY, rotation} = scissors;
          return `translateX(${translateX}px) translateY(${translateY + props.scissorsOffsetY}px) rotate(${rotation}deg)`
        }
      )
    )

    function resetScissors() {
      Object.assign(scissorsRenders.red, cloneDeep(scissorsRendersInitial.red));
      Object.assign(scissorsRenders.blue, cloneDeep(scissorsRendersInitial.blue));
      if (svg.value) {
        Object.values(scissorsRenders).forEach(scissors => {
          const {x, y} = scissors.lastPos;
          const {clientWidth, clientHeight} = svg.value!;
          scissors.translateX = x / 100 * clientWidth;
          scissors.translateY = y / 100 * clientHeight;
        });
      }
    }


    // const segmentRefs: { [id: string]: SVGPathElement} = {}
    const segmentRendersInitial = {
      offsetY: 0,
      opacity: 1,
      animating: false
    }

    // const segmentRenders = computed(() =>
    //     Object.fromEntries(Object.values(graph.value.getLiveSegments()).map(segment => {
    //     const obj = reactive({
    //       ...segmentRendersInitial,
    //       segment,
    //       live: computed(() => {
    //         return liveIds.value.has(segment.id)
    //       }),
    //       style: computed(() => (
    //           {
    //             transform: `translateY(${obj.offsetY}px)`,
    //             opacity: typeof props.segmentsOpacity == "number" ? props.segmentsOpacity : obj.opacity
    //           }
    //       )),
    //     });
    //     return [segment.id, obj];
    //   })
    // ));

    const segmentRenders = ref();


    function resetSegments() {
     segmentRenders.value = Object.fromEntries(
          Object.values(props.segments).map(segment => {
            const obj = reactive({
              ...segmentRendersInitial,
              segment,
              live: computed(() => {
                return liveIds.value.has(segment.id)
              }),
              style: computed(() => (
                  {
                    transform: `translateY(${obj.offsetY}px)`,
                    opacity: typeof props.segmentsOpacity == "number" ? props.segmentsOpacity : obj.opacity
                  }
              )),
            });
            return [segment.id, obj];
          })
      )
      // Object.values(segmentRenders.value).forEach(r => Object.assign(r, segmentRendersInitial));
    }

    function resetGame(playerInitiated = false, doResetScissors = true, startingPlayer = props.startingPlayer, subgraph = props.subgraph) {
      if (props.debugMode) {
        console.log("resetting");
      }

      turn.value = 0;

      graph.value.evaluate();
      graph.value.setSubgraph(subgraph || "all");

      playingAgain.value = playerInitiated;

      autoplayCounter.value = 0;

      if (!playerInitiated || !ai.value) {
        ai.value = props.aiControls;
      }

      gameValue.value = graph.value.evaluate();
      liveIds.value = new Set(Object.keys(graph.value.getLiveSegments()));

      if (props.stopAnimationOnFlush) {
        if (animations.scissors.size)
          [...animations.scissors, ...animations.segments].forEach(tl => {
            tl.kill();
          })
        animations.scissors.clear();
        animations.segments.clear();
      }
      if (doResetScissors) resetScissors();
      resetSegments();
      if (!startingPlayer) {
        currentPlayer.value = false;
        return;
      }

      if (svg.value) {
        nextTurn(startingPlayer);
      }
    }

    watch([toRef(props, "flush"), graph, svg], ([flush]) => {
      resetGame(false, flush == 0 || props.resetScissorsOnFlush);
    }, {immediate: true})

    function resetButtonClick() {
      const { choosePlayer, subgraph } = props.promptReset;
      if (choosePlayer) {
        currentPlayer.value = false;
      } else {
        resetGame(true, true, props.startingPlayer, subgraph || props.subgraph)
      }
    }

    function playerSelected(params: {playerControlled: Player, starting: Player}) {
      ai.value = [otherPlayer(params.playerControlled)];
      resetGame(true, true, params.starting, props.promptReset.subgraph || props.subgraph);
    }

    function animateScissors(color: Player, segment: Segment, onComplete: () => void) {
      const render = scissorsRenders[color];
      const scissorsEl = unref(render.ref)?.$el;
      if (!scissorsEl) return;

      const cutpoint = (dim: "x" | "y") => (segment.start[dim] + segment.end[dim]) / 2;

      const {clientWidth, clientHeight} = unref(svg)!;
      const moveOffset = render.moveOffset;
      const x = (cutpoint("x") / 100) * clientWidth + moveOffset.x;
      const y = (cutpoint("y") / 100) * clientHeight + moveOffset.y;
      const speed = 350; //px/seconds
      const lastPos = render.lastPos;
      const duration = Math.sqrt((lastPos.x - x) ** 2 + (lastPos.y - y) ** 2) / speed;
      lastPos.x = x;
      lastPos.y = y;

      const timeline = gsap.timeline({
        onComplete () {
          animations.scissors.delete(timeline);
          onComplete();
        }
      })

      animations.scissors.add(timeline);

      // scissors[color].cutProgress = 0.6;
      const move = timeline.to(render, {
        translateX: x,
        translateY: y,
        ease: "none",
        duration
      });

      const open = timeline.to(render, {
        cutProgress: 1,
        duration: 0.4,
      }, "-=0.4")
      const shut = timeline.to(render, {
        cutProgress: 0,
        duration: 0.3
      })

    }

    function togglePlayer() {
      if (currentPlayer.value) {
        currentPlayer.value = otherPlayer(currentPlayer.value);
      }
    }

    function removeEdge(segment: Segment) {
      const Graph = unref(graph);
      if (Graph) {
        const floatingIds = Graph.removeEdge(segment.id);
        const floatingSegments = floatingIds.map(id => segmentRenders.value[id]);
        const timeline = gsap.timeline({
          onComplete () {
            animations.segments.delete(timeline);
          }
        });
        animations.segments.add(timeline);
        const cutSegment = segmentRenders.value[segment.id];
        timeline.fromTo(cutSegment, {opacity: 0.5}, {
          duration: 0.5,
          opacity: 0,
          onStart() {
            cutSegment.animating = true;
          },
          onComplete() {
            // liveIds.value.delete(segment.id);
            cutSegment.animating = false;
            console.log("complete")
          },
        });

        if (floatingSegments.length) {
          timeline.to(floatingSegments, {
            ease: "power1.in",
            duration: 1,
            offsetY: "-=100",
            onStart() {
              floatingSegments.forEach(s => s.animating = true);
            },
            onComplete() {
              // floatingIds.forEach(id => liveIds.value.delete(id));
              floatingSegments.forEach(s => s.animating = false);
            },
          }, "<");
        }

        gameValue.value = Graph.evaluate();


        if (props.debugMode) {
          console.log("Subgraph", Graph.getCurrentSubgraph(), "Value", gameValue.value);
        }
        // emit("update:subgraph", Graph.getCurrentSubgraph());
        nextTurn();
      }
    }

    function nextTurn(firstTurnPlayer?: Player) {
      if (firstTurnPlayer) {
        currentPlayer.value = firstTurnPlayer;
      } else {
        togglePlayer();
      }
      turn.value++;

      const CurrentPlayer = unref(currentPlayer);

      if (playerWon.value) {
        emit("gameover", {winner: playerWon.value, playerDidWin: !ai.value.includes(playerWon.value), playingAgain: playingAgain.value})
        return;
      }

      if (ai.value.includes(CurrentPlayer) && autoplaying.value) {
        const aiMove = graph.value.bestMoveForColor(CurrentPlayer as Color);
        aiIsMoving.value = true;
        animateScissors(CurrentPlayer, aiMove, () => {
          autoplayCounter.value++;
          aiIsMoving.value = false;
          removeEdge(aiMove)
        })
      }
    }

    const autoplaying = computed(() => {
      if (playingAgain.value) return true;
      if (typeof props.autoplay == "number") {
        return autoplayCounter.value < props.autoplay;
      }
      return props.autoplay;
    })

    function clickable(segment: Segment): Boolean {
      if (props.pictureMode || props.preventClick) return false;
      return segment.color == "green" || segment.color == currentPlayer.value
    }

    function pieceClicked(segment: Segment) {
      if (clickable(segment)) {
        emit("segmentClicked", {segment, player: currentPlayer.value})
        removeEdge(segment);
      }
    }

    const playerWon = computed<false | Player>(() => {
      turn.value;
      const CurrentPlayer = unref(currentPlayer);
      if (!CurrentPlayer) {
        return false;
      }
      const colorsLeft = Object.values(graph.value.getLiveSegments()).map(s => s.color);
      if (!colorsLeft.includes(CurrentPlayer)) {
        return otherPlayer(CurrentPlayer);
      }
      return false;
    });

    const currentPlayerClass = computed<String | undefined>(() => {
      if (currentPlayer.value) {
        return playerDisplay[currentPlayer.value].class;
      }
    });

    const currentPlayerString = computed<String | undefined>(() => {
      if (currentPlayer.value) {
        return playerDisplay[currentPlayer.value].text;
      }
    });

    return {
      graph,
      scissorsRenders,
      segmentRenders,
      playerDisplay,
      currentPlayer,
      otherPlayer,
      turn,
      svg,
      Color,
      gameValue,
      liveIds,
      autoplayCounter,
      autoplaying,
      playerWon,
      currentPlayerClass,
      currentPlayerString,
      pieceClicked,
      clickable,
      animations,
      ai,
      resetButtonClick,
      playerSelected,
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