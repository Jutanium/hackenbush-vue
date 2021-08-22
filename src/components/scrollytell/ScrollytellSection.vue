<template>
  <div class="w-full">
    <div class="w-1/2 h-screen"></div>
    <div class="flex flex-row justify-center">
      <div class="mx-12">
        <div v-for="(i, zeroIndexed) in numGroups" class="flex items-center"
             :ref="el => { if (el) groups[zeroIndexed] = el }"
             :style="collectStyle(zeroIndexed)">
          <div class="text-lg">
            <slot :name="'group' + i"></slot>
          </div>
        </div>
        <div class="w-2 h-screen"></div>
      </div>
      <div class="w-5/12 max-w-2xl">
        <div :style="collectStyle(0)">
          <slot name="sticky" v-bind="scrollData"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {ref, defineComponent, onBeforeUpdate, onMounted, reactive, watch, onBeforeUnmount, unref} from "vue"
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

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
    onBeforeUpdate(() => {
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

    const scrollTriggersRef = ref<any[]>([]);

    onMounted(() => {
      const scrollTriggers = unref(scrollTriggersRef);
      console.log("mounted hook", scrollTriggers.length);
      let cumulative = top;
      const _cumulativeHeights = [cumulative];
      groups.value.forEach(el => _cumulativeHeights.push(cumulative += el.scrollHeight));
      cumulativeHeights.value = _cumulativeHeights;

      groups.value.slice(1).forEach((el, i) => {
        const prev = groups.value[i];
        const prevCumulative = _cumulativeHeights[i];
        const cumulative = _cumulativeHeights[i + 1];

       scrollTriggers.push(ScrollTrigger.create({
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
        }) );
      })

      scrollTriggers.push(ScrollTrigger.create({
        trigger: groups.value[numGroups - 1],
        start: `bottom ${cumulative}px`,
        end: "bottom top",
        onEnter: ({direction}) => {
          scrollData.current = numGroups - 1;
          scrollData.direction = direction;
          emit("slideChange", scrollData);
          emit("leave");
        },
        onLeaveBack: ({direction}) => {
          scrollData.current = numGroups - 1
          scrollData.direction = direction;
          emit("slideChange", scrollData);
          emit("enterBack");
        },
        onUpdate: ({progress, direction, start, end}) => {
          scrollData.leaveProgress = progress;
          leaveOffset.value = (start - end) * progress;
        }
      }));

      scrollTriggersRef.value = scrollTriggers;
    })

    function collectStyle(index: number) {
      return {
        position: "sticky",
        top: `${cumulativeHeights.value[index] + leaveOffset.value}px`,
        marginBottom: `calc(100vh - ${cumulativeHeights.value[index]}px)`,
      }
    }
    return {
      groups,
      cumulativeHeights,
      leaveOffset,
      scrollData,
      collectStyle,
      scrollTriggersRef
    }
  },
})
</script>

<style scoped>

</style>