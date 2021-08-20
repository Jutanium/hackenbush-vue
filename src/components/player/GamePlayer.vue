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
    </div>

    <div v-if="debugMode" class="mt-12">
      <div v-if="gameValue != undefined">
        Game value: {{gameValue}}
      </div>
      <div v-if="subgraph">{{subgraph}}</div>
    </div>

    <g>
      <Scissors  v-for="color in ai"
                :is-red="color === Color.Red"
                :ref="el => scissorsRenders[color].ref = el"
                :animation-progress="scissorsRenders[color].cutProgress"
                :style="{transform: scissorsRenders[color].transform, opacity: scissorsOpacity}"
      ></Scissors>
    </g>

    <svg ref="svg" viewBox="0 0 100 100">

      <rect class="drawnGround"
            :width="100" :height="5" :y="95" fill="green">
      </rect>

      <template v-for=" ([id, {segment, style, live, animating}]) in Object.entries(segmentRenders)">
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
import {computed, ComputedRef, defineComponent, onMounted, PropType, reactive, ref, toRef, unref, watch, watchEffect} from "vue"
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
  emits: ['update:subgraph'],
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
    //For outside control. Set these together
    subgraph: {
      type: String
    },
    autoplay: {
      type: [Boolean, Number],
      default: false,
    },

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

    const graph = computed( () => {
      return buildGraph(props.segments, props.groundY);
    });

    const liveIds = ref(Object.keys(graph.value.getLiveSegments()));

    const gameValue = ref<number>(graph.value.evaluate());

    watchEffect(() => {
      if (props.subgraph) {
        graph.value.setSubgraph(props.subgraph);
        gameValue.value = graph.value.evaluate();
        liveIds.value = Object.keys(graph.value.getLiveSegments());
      }
    });

    const otherPlayer = (player: Player) => player == Color.Red ? Color.Blue : Color.Red;

    const svg = ref<SVGElement>();
    // const segmentRefs: { [id: string]: SVGPathElement} = {}
    const segmentRenders = reactive(
        Object.fromEntries(
            Object.values(props.segments).map(segment => {
              const obj = reactive({
                segment,
                offsetY: 0,
                opacity: 1,
                live: computed( () => {
                  return liveIds.value.includes(segment.id)
                }),
                animating: false,
                style: computed( () => (
                    {
                      transform: `translateY(${obj.offsetY}px)`,
                      opacity: typeof props.segmentsOpacity == "number" ? props.segmentsOpacity : obj.opacity
                    }
                  )),
              });
              return [segment.id, obj];
            })
        )
    );

    const scissorsRenders = {
      red: reactive({
        ref: null,
        lastPos: {x: 80, y: 50},
        cutProgress: 0.6,
        rotation: 180,
        translateX: 0,
        translateY: 0,
        moveOffset: {x: -10, y: -5},
        transform: undefined as undefined | ComputedRef,
      }),
      blue: reactive({
        ref: null,
        lastPos: {x: 10, y: 50},
        cutProgress: 0.6,
        moveOffset: {x: -42, y: -10},
        rotation: 0,
        translateX: 0,
        translateY: 0,
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

    onMounted(() => {
      Object.values(scissorsRenders).forEach(scissors => {
        const {x, y} = scissors.lastPos;
        const {clientWidth, clientHeight} = svg.value!;
        scissors.translateX = x / 100 * clientWidth;
        scissors.translateY = y / 100 * clientHeight;
      });
    })

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
        onComplete
      })

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

    const currentPlayer = ref<Player | false>(false);
    const turn = ref(0);

    const autoplayCounter = ref();
    const aiIsMoving = ref(false);

    onMounted(() => {
      if (props.startingPlayer) {
        nextTurn(props.startingPlayer);
      }
    })

    function togglePlayer() {
      if (currentPlayer.value) {
        currentPlayer.value = otherPlayer(currentPlayer.value);
      }
    }

    function removeEdge(segment: Segment) {
      const Graph = unref(graph);
      if (Graph) {
        const floatingIds = Graph.removeEdge(segment.id);
        const floatingSegments = floatingIds.map(id => segmentRenders[id]);
        const timeline = gsap.timeline();
        const cutSegment = segmentRenders[segment.id];
        timeline.fromTo(cutSegment, {opacity: 0.5}, {
          duration: 0.5,
          opacity: 0,
          onStart () {
            cutSegment.animating = true;
          },
          onComplete () {
            cutSegment.animating = false;
          }
        });

        if (floatingSegments.length) {
          timeline.to(floatingSegments, {
            ease: "power1.in",
            duration: 1,
            offsetY: "-=100",
            onStart () {
              floatingSegments.forEach(s => s.animating = true);
            },
            onComplete () {
              floatingSegments.forEach(s => s.animating = false);
            }
          }, "<");
        }
        gameValue.value = Graph.evaluate();
        emit("update:subgraph", Graph.getCurrentSubgraph());
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
      if (props.ai.includes(CurrentPlayer) && autoplaying.value && !playerWon.value) {
        const aiMove = graph.value.bestMoveForColor(CurrentPlayer as Color);
        aiIsMoving.value = true;
        animateScissors(CurrentPlayer, aiMove, () => {
          removeEdge(aiMove)
          autoplayCounter.value--;
          aiIsMoving.value = false;
        })
      }
    }

    watch(toRef(props, 'autoplay'), () => {
      if (typeof props.autoplay == "number") {
        autoplayCounter.value = props.autoplay;
        if (!aiIsMoving.value) {
          nextTurn();
        }
      }
    }, {immediate: true})


    const autoplaying = computed(() => {
      if (typeof props.autoplay == "number") {
        return autoplayCounter.value > 0;
      }
      return props.autoplay;
    })

    function clickable(segment: Segment): Boolean {
      if (props.pictureMode) return false;
      return segment.color == "green" || segment.color == currentPlayer.value
    }

    function pieceClicked(segment: Segment) {
      if (clickable(segment)) {
        removeEdge(segment);
      }
    }

    const playerWon = computed<false | Player>( () => {
      const CurrentPlayer = unref(currentPlayer);
      if (!CurrentPlayer) {
        return false;
      }
      const colorsLeft = liveIds.value.map(id => props.segments[id].color);
      if (!colorsLeft.includes(CurrentPlayer)) {
        return otherPlayer(CurrentPlayer);
      }
      return false;
    });

    const currentPlayerClass = computed<String | undefined>( () => {
      if (currentPlayer.value) {
        return playerDisplay[currentPlayer.value].class;
      }
    });

    const currentPlayerString = computed<String | undefined>( () => {
      if (currentPlayer.value) {
        return playerDisplay[currentPlayer.value].text;
      }
    });

    return {
      graph,
      scissorsRenders,
      segmentRenders,
      playerDisplay,
      otherPlayer,
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
      clickable
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