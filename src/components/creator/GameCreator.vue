<template>
  <div>

    <Toolbar v-if="!demoMode" class="mb-1" v-model:mode="selectedMode" @exportClick="exportClicked"></Toolbar>
    <input v-show="showExport" @click="exportClicked" ref="exportInput" class="w-full" type="text" :value="exportString"/>

    <svg ref="svg" :class="{'border-2 border-gray-300 rounded-b-none rounded-2xl': !demoMode}" viewBox="0 0 100 100"
         @click="bgClick"
         @mousemove="bgMouseMove"
         @mouseup="bgMouseUp"
         @mousedown="bgMouseDown"
    >

      <Ground :y="groundY" :height="100 - groundY"></Ground>

      <g v-if="isDrawing">
        <PiecePath :segment="newSegment"></PiecePath>
      </g>

      <template v-for="segment in segmentsArray">
        <Piece :segment="segment" :demoMode="demoMode" @click="pieceClicked(segment)"></Piece>
      </template>

    </svg>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, InjectionKey, nextTick, provide, reactive, Ref, ref, unref} from "vue"
import Toolbar, {Mode} from "./subcomponents/Toolbar.vue";
import Ground from "./subcomponents/Ground.vue";
import Piece from "./subcomponents/Piece.vue"
import PiecePath from "@/components/shared/PiecePath.vue";

import {Color} from "@/model/segment-color";
import {Connection, connectionsEqual, Point, pointsEqual, Segment, Side, Sides} from "@/model/segment";
import {useGameState} from "@/components/creator/state/game-file"

const selectedModeKey: InjectionKey<Ref<Mode>> = Symbol();
const svgCoordsKey: InjectionKey<(clientX: number, clientY: number) => { x: number, y: number } | false> = Symbol();
const connectionPressedKey: InjectionKey<(svgX: number, svgY: number, connection: Connection, ctrlKey: boolean) => void> = Symbol();
const snapRadiusKey: InjectionKey<number> = Symbol();

import dogcat from "@/game-files/dogcat.json"
import {SegmentsMap} from "@/model/graph";

export const injections = {
  svgCoords: svgCoordsKey,
  connectionPressed: connectionPressedKey,
  snapRadius: snapRadiusKey,
  selectedMode: selectedModeKey
}

export default defineComponent({
  name: "GameCreator",
  components: {Piece, Toolbar, Ground, PiecePath},
  props: {
    snapRadius: {
      type: Number,
      default: 4
    },
    demoMode: {
      type: Boolean,
      default: false
    }
  },
  setup: (props) => {
    const svg = ref();

    const {state, addSegment, removeSegment, fileString} = useGameState(props.demoMode && dogcat.segments as SegmentsMap);

    const {segments, groundY} = state;

    const segmentsArray = computed( () => {
      return Object.values(segments);
    })

    const pointsArray = computed( () => {
      const points: Array<{
        connection: Connection,
        point: Point
      }> = [];
      segmentsArray.value.forEach(segment => {
        Sides.forEach(side => {
          points.push({
            connection: {
              id: segment.id,
              side,
            },
            point: segment[side]
          })
        })
      })
      return points;
    })

    const selectedMode = ref<Mode>(props.demoMode ? Mode.Moving : Mode.DrawingBlue);

    const drawingColor = computed(() => {
      const mode = unref(selectedMode);
      switch (mode) {
        case Mode.DrawingBlue:
          return Color.Blue;
        case Mode.DrawingRed:
          return Color.Red;
        case Mode.DrawingGreen:
          return Color.Green;
      }
      return undefined;
    });

    const isDrawing = ref(false);

    const _newSegment = {
      id: "",
      color: Color.Blue,
      start: {x: -1, y: -1},
      end: {x: -1, y: -1},
    };

    const newSegment = reactive<Segment>(_newSegment);

    const movingPoint = reactive({
      point: false as Point | false,
      connection: false as Connection | false,
      movingWith: [] as Connection[]
    });


    const svgCoords = (clientX: number, clientY: number) => {
      if (!svg.value) return false;
      const pt = svg.value.createSVGPoint();

      pt.x = clientX;
      pt.y = clientY;

      const {x, y} = pt.matrixTransform(svg.value.getScreenCTM().inverse());

      const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;
      return {x: round(x), y: round(y)};
    }

    const connectionPressed = (svgX: number, svgY: number, connection: Connection, ctrlKey = false) => {
      if (selectedMode.value == Mode.Moving) {
        if (connection.id == "ground") {
          return;
        }
        movingPoint.point = segments[connection.id][connection.side];
        movingPoint.connection = connection;
        if (!ctrlKey) {
          movingPoint.movingWith = pointsArray.value
            .filter(p => !connectionsEqual(p.connection, connection) && pointsEqual(p.point, movingPoint.point as Point))
            .map(p => p.connection);
        } else {
          movingPoint.movingWith = [];
        }
        return;
      }

      if (drawingColor.value) {
        isDrawing.value = true;
        newSegment.color = drawingColor.value;
        newSegment.start = {x: svgX, y: svgY};
        newSegment.end = {x: svgX, y: svgY};
        movingPoint.point = newSegment.end;
        movingPoint.movingWith = [];
      }
    }

    provide(svgCoordsKey, svgCoords);
    provide(connectionPressedKey, connectionPressed);
    provide(snapRadiusKey, props.snapRadius);
    provide(selectedModeKey, selectedMode);

    const exportInput = ref<HTMLInputElement>(null);
    const showExport = ref(false);
    const exportString = ref(fileString());

    const exportClicked = () => {
      showExport.value = true;
      exportString.value = fileString();
      nextTick(() => {
        exportInput.value.select();
        document.execCommand("copy");
      })
    }

    return {
      selectedMode,
      segments,
      segmentsArray,
      pointsArray,
      groundY,
      svg,
      svgCoords,
      newSegment,
      isDrawing,
      movingPoint,
      drawingColor,
      addSegment,
      removeSegment,
      exportClicked,
      showExport,
      exportString,
      exportInput
    }
  },
  computed: {
    snappingPoints(): Point[] {
      const points: Point[] = [];
      if (this.movingPoint.point) {
        if (this.pointsArray.length == 0) return points;
        const clonedSegments = Object.assign({}, this.segments);
        if (this.movingPoint.connection) {
          const exclude = [this.movingPoint.connection, ...this.movingPoint.movingWith];
          exclude.forEach(connection => {
            const segment = Object.assign({}, clonedSegments[connection.id]);
            delete segment[connection.side];
            clonedSegments[connection.id] = segment;
          })
        }
        Object.values(clonedSegments).forEach(s => {
          points.push(...[s.start, s.end].filter(Boolean));
        })
      }
      return points;
    }
  },
  methods: {
    moveTo (point: Point) {
      const updatePoint = (toUpdate: Point) => {
        toUpdate.x = point.x;
        toUpdate.y = point.y;
      }
      if (this.movingPoint.point) {
        updatePoint(this.movingPoint.point);
        this.movingPoint.movingWith.forEach(c => updatePoint(this.segments[c.id][c.side]));
      }
    },
    pieceClicked(segment: Segment) {
      if (this.drawingColor) {
        segment.color = this.drawingColor;
        return;
      }
      if (this.selectedMode == Mode.Deleting) {
        this.removeSegment(segment);
      }
    },
    bgClick(event: MouseEvent) {

    },

    bgMouseMove(event: MouseEvent) {
      if (this.movingPoint.point) {
        const coords = this.svgCoords(event.clientX, event.clientY);

        const distanceSquared = (point1: Point, point2: Point) => (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2;

        let closestPoint;
        let closestDistance;

        for (const point of this.snappingPoints) {
          const dist = distanceSquared(point, coords);
          if (dist > this.snapRadius ** 2) continue;
          if (!closestDistance || dist < closestDistance) {
            closestPoint = point;
            closestDistance = dist;
          }
        }

        const groundProj = {x: coords.x, y: this.groundY};
        const distToGround = distanceSquared(groundProj, coords);
        if (!closestDistance && distToGround <= this.snapRadius ** 2) {
          closestPoint = groundProj;
          closestDistance = distToGround;
        }

        if (!closestPoint || !closestDistance) {
          this.moveTo(coords);
          return;
        }
        this.moveTo(closestPoint);
      }
    },

    bgMouseUp(event: MouseEvent) {
      if (this.movingPoint.point) {
        this.movingPoint.point = false;
        this.movingPoint.connection = false;
      }

      if (this.isDrawing) {
        const {start, end} = this.newSegment
        const xDiff = end.x - start.x;
        const yDiff = end.y - start.y;
        const id = "segment" + Date.now() % 100 + this.counter++;

        this.addSegment(Object.assign({}, this.newSegment, {
          id,
          color: this.drawingColor,
          curveControlStart: {
            x: start.x + xDiff / 3,
            y: start.y + yDiff / 3
          },
          curveControlEnd: {
            x: end.x - xDiff / 3,
            y: end.y - yDiff / 3
          },
        }));


        this.isDrawing = false;
      }

    },

    bgMouseDown(event: MouseEvent) {

    }
  },
  data() {
    return {
      counter: 0,
    }
  }
})
</script>

<style scoped>
</style>