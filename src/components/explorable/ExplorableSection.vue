<template>
  <div ref="root"
       class="w-full h-screen py-32 md:pt-0 md:items-center flex flex-col justify-evenly lg:scroll-snap"
       :class="reverse ? 'md:flex-row-reverse md:-ml-16' : 'md:flex-row'"
       :style="{opacity: scrollData.enterProgress}">
    <div class="ml-4 md:ml-12 h-1/2 min-height-half md:w-1/2 md:mt-8 flex flex-col gap-4">
      <div class="h-full min-h-full overflow-y-auto" ref="scroller">
        <div v-for="(_, i) in numGroups"
             :ref="el => { if (el) groups[i] = el }"
             class="md:text-lg flex items-center my-4"
             :class="{'bg-gradient-to-r to-transparent from-blue-100': scrollData.current == i}"
             @click="groupClick(i)"
             v-show="revealed >= i"
             :style="groupStyles(i)">
          <div class="relative">
            <slot :name="'group' + i" v-bind="scrollData"></slot>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-between md:justify-center space-x-4 relative z-20">
        <div class="w-24 inline-block" @click="prevButtonClick">
          <BaseButton class="h-10 rounded" v-show="scrollData.current > 0">Prev</BaseButton>
        </div>
        <div class="w-24 inline-block" @click="nextButtonClick">
          <BaseButton class="h-10" v-show="scrollData.current + 1 < numGroups">
            Next
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-if="$slots.sticky" ref="sticky" class="md:w-1/2 md:ml-4 max-w-3xl flex-shrink p-10">
        <slot name="sticky" v-bind="scrollData"/>
    </div>

  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  reactive,
  watch,
  onBeforeUnmount,
  unref,
  onUnmounted, toRef, nextTick, PropType
} from "vue"
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import BaseButton from "@/components/shared/BaseButton.vue";
import useBreakpoints from "@/components/shared/useBreakpoints";
import useSections from "@/components/explorable/useSections";

const {registerSection, setSection} = useSections();

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  components: {BaseButton},
  emits: ["slideChange"],
  props: {
    title: {
      type: String,
      required: true
    },
    numGroups: {
      type: Number,
      required: true
    },
    reverse: {
      type: Boolean,
      default: false
    },
    divisions: {
      //Divide after these slides
      type: Array as PropType<number[]>
    }
  },
  setup: ({numGroups, title, divisions}, {emit}) => {
    const groups = ref<Array<HTMLDivElement>>([]);
    const root = ref<HTMLDivElement>();
    const sticky = ref<HTMLDivElement>();
    const scroller = ref<HTMLDivElement>();

    const sectionIndex = registerSection(title, root, numGroups);

    const {isMobile} = useBreakpoints();

    const revealed = ref(0);

    const inView = ref(false);
    watch(inView, () => {
      console.log(inView, sectionIndex)
    })

    onBeforeUpdate(() => {
      groups.value = [];
    })

    const scrollData = reactive({
      current: 0,
      enterProgress: 0,
      leaveProgress: 0,
    })

    const scrollTriggersRef = ref([ScrollTrigger.create({})]);

    function killScrollTriggers() {
      if (scrollTriggersRef.value.length) {
        scrollTriggersRef.value.forEach(st => st.kill());
        scrollTriggersRef.value = [];
      }
    }

    function registerScrollTriggers() {
      // let scrollTriggers = unref(scrollTriggersRef);
      scrollTriggersRef.value.push(ScrollTrigger.create({
        trigger: root.value,
        start: "top bottom",
        end: "top 200",
        onUpdate: ({progress}) => scrollData.enterProgress = progress,
        // onEnterBack: () => scrollData.current = 0
      }))

      scrollTriggersRef.value.push(ScrollTrigger.create({
        trigger: root.value,
        start: "top 200",
        end: "bottom top",
        onUpdate: ({progress}) => scrollData.leaveProgress = progress,
        // onEnterBack: () => scrollData.current = 0
      }))
      scrollTriggersRef.value.push(ScrollTrigger.create({
        trigger: root.value,
        start: "top top",
        end: "bottom bottom+=50",
        onToggle: ({isActive}) => inView.value = isActive,
        onEnter: () => setSection(sectionIndex),
        onEnterBack: () => setSection(sectionIndex),
        onLeaveBack: () => setSection(sectionIndex - 1),
      }))

    }


    onMounted(() => {
      killScrollTriggers();
      registerScrollTriggers();
    })

    onUnmounted(() => {
      killScrollTriggers();
    })

    const groupStyles = (i: number) => {

      // const opacity = i == 0 ? scrollData.enterProgress : Number(revealed.value >= i)
      if (divisions?.length) {
        if (revealed.value >= i) {
          const currentDivision = divisions.sort( (a,b) => b - a).find(num => scrollData.current > num);
          if (i <= currentDivision) {
            return {
              opacity: 0.2
            }
          }
        }
      }

      const opacity = Number(revealed.value >= i)
      return {
        opacity
      }
    }

    function nextButtonClick() {
      if (scrollData.current < revealed.value) {
        scrollData.current++;
        return;
      }
      if (revealed.value + 1 < numGroups) {
        revealed.value++;
        scrollData.current = revealed.value;
        nextTick(() => {
          scroller.value!.scrollTop = scroller.value!.scrollHeight;
        })
      }
    }

    function prevButtonClick() {
      if (scrollData.current > 0) {
        scrollData.current--;
      }
    }

    function groupClick(i) {
      if (revealed.value >= i) {
        scrollData.current = i;
      }
    }

    watch(toRef(scrollData, 'current'), (current, last) => {
      emit('slideChange', Object.assign({direction: current - last}, scrollData));
      setSection(sectionIndex, current);
    })

    return {
      root,
      sticky,
      groups,
      scrollData,
      scrollTriggersRef,
      scroller,
      groupStyles,
      groupClick,
      prevButtonClick,
      nextButtonClick,
      inView,
      revealed
    }
  },
})
</script>
<style scoped>
.min-height-half {
  min-height: 50%;
}
</style>
