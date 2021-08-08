<template>
  <div class="w-full ml-3 lg:ml-12">
    <div class="w-1/2 h-screen"></div>
    <div class="flex w-full flex-row px-12">
      <div class="flex-grow">
        <div v-for="(i, zeroIndexed) in numGroups" class="w-1/2 flex items-center"
             :ref="el => { if (el) groups[zeroIndexed] = el }"
             :style="collectStyle(zeroIndexed)">
          <div>
            <slot :name="'group' + i"></slot>
          </div>
        </div>
        <div class="w-1/2 h-screen"></div>
      </div>
      <div class="w-1/2">
        <div :style="collectStyle(0)">
          <slot name="sticky" v-bind="scrollData"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {ref, defineComponent, onBeforeUpdate, onMounted, reactive, watch} from "vue"
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  export default defineComponent({
    emits: ["enter", "leave", "enterBack", "leaveBack"],
    props: {
      numGroups: {
        type: Number,
        required: true
      },
      top: {
        type: Number,
        default: 100
      }
    },
    setup: ({top, numGroups}, {emit}) => {
      const groups = ref<Array<HTMLDivElement>>([]);
      onBeforeUpdate( () => {
        groups.value = [];
      })
      const cumulativeHeights = ref<Array<number>>([]);
      const scrollData = reactive({
        progress: 0,
        current: -1,
        leaveProgress: 0,
      })

      const leaveOffset = ref(0);
      onMounted( () => {
        let cumulative = top;
        const _cumulativeHeights = [];
        _cumulativeHeights.push(cumulative);

        groups.value.forEach((el, i) => {
          cumulative += el.scrollHeight;
          _cumulativeHeights.push(cumulative);
          ScrollTrigger.create({
            trigger: el,
            start: "bottom bottom",
            end: `top ${cumulative}px`,
            onUpdate: ({progress}) => scrollData.progress = progress,
            onEnter: (instance) => {
              scrollData.current = i;
              if (i == 0) {
                emit("enter");
              }
            },
            onLeaveBack: (instance) => {
              scrollData.current = i - 1;
              if (i == 0) {
                emit("leaveBack");
              }
            }
          })
        })

        ScrollTrigger.create({
          trigger: groups.value[numGroups - 1],
          start: `bottom ${cumulative}px`,
          end: "bottom top",
          onEnter: () => {
            scrollData.current = numGroups;
            emit("leave");
          },
          onLeaveBack: () => {
            scrollData.current = numGroups - 1
            emit("enterBack");
          },
          onUpdate: ({progress, direction, start, end}) => {
            scrollData.leaveProgress = progress;
            leaveOffset.value = (start - end) * progress;
          }
        });
;
        cumulativeHeights.value = _cumulativeHeights;
      })
      return {
        groups,
        cumulativeHeights,
        leaveOffset,
        scrollData
      }
    },
    methods: {
      collectStyle(index: number) {
        return {
          position: "sticky",
          top: `${this.cumulativeHeights[index] + this.leaveOffset}px`,
          marginBottom: `calc(100vh - ${this.cumulativeHeights[index]}px)`,
        }
      }
    },
  })
</script>

<style scoped>

</style>