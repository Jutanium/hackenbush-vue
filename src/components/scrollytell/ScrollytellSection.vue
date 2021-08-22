<template>
  <div class="w-full ml-3 lg:ml-12">
    <div class="w-1/2 h-screen"></div>
    <div class="flex w-full flex-row px-12">
      <div class="flex-grow">
        <div v-for="(i, zeroIndexed) in numGroups" class="w-1/2 flex items-center"
             :ref="el => { if (el) groups[zeroIndexed] = el }"
             :style="collectStyle(zeroIndexed)">
          <div class="text-lg">
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
  import {ref, defineComponent, onBeforeUpdate, onMounted, reactive, watch, onBeforeUnmount} from "vue"
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  export default defineComponent({
    emits: ["enter", "leave", "enterBack", "leaveBack", "slideChange"],
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
        direction: 0,
        leaveProgress: 0,
      })

      const leaveOffset = ref(0);

      onMounted( () => {
        let cumulative = top;
        const _cumulativeHeights = [cumulative];
        groups.value.forEach(el => _cumulativeHeights.push(cumulative += el.scrollHeight));
        cumulativeHeights.value = _cumulativeHeights;

        groups.value.slice(1).forEach((el, i) => {
          const prev = groups.value[i];
          const prevCumulative = _cumulativeHeights[i];
          const cumulative = _cumulativeHeights[i + 1];

          ScrollTrigger.create({
            trigger: prev,
            endTrigger: el,
            start: `top ${prevCumulative}px`,
            end: `top ${cumulative}px`,
            onUpdate: (instance) => {
              const {progress} = instance;
              // console.log(instance);
              scrollData.current = i;
              scrollData.progress = progress;
            },
            onEnter: ({direction}) => {
              scrollData.direction = direction;
              emit("slideChange", scrollData);
              if (i == 0) {
                emit("enter");
              }
            },
            onLeaveBack: ({direction}) => {
              scrollData.direction = direction;
              emit("slideChange", scrollData);
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
            scrollData.current = numGroups - 1;
            emit("slideChange", scrollData);
            emit("leave");
          },
          onLeaveBack: () => {
            scrollData.current = numGroups - 1
            emit("slideChange", scrollData);
            emit("enterBack");
          },
          onUpdate: ({progress, direction, start, end}) => {
            scrollData.leaveProgress = progress;
            leaveOffset.value = (start - end) * progress;
          }
        });

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