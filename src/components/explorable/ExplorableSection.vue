<template>
  <div ref="root" class="w-full h-screen md:items-center flex flex-col md:flex-row justify-evenly scroll-snap">
    <div class="ml-4 md:ml-12 h-1/2 md:h-auto md:w-1/2 md:mt-8 flex flex-col gap-4">
      <div>
        <div v-for="(_, i) in numGroups"
             :ref="el => { if (el) groups[i] = el }"
             class="md:text-lg h-12 flex items-center"
             @click="scrollData.current = i"
             :style="groupStyles(i)">
          <div class="absolute w-full md:w-1/2 h-12 -left-2 z-0"
               :class="{'bg-gradient-to-r to-transparent from-blue-100': scrollData.current == i}"></div>
          <div class="relative">
            <slot :name="'group' + i" v-bind="scrollData"></slot>
          </div>
        </div>
      </div>
      <div class="self-center space-x-4">
        <div class="w-24 inline-block">
          <BaseButton class="h-10 rounded" v-show="scrollData.current > 0" @click="prevButtonClick">Prev</BaseButton>
        </div>
        <div class="w-24 inline-block">
          <BaseButton class="h-10" v-show="scrollData.current + 1 < numGroups" @click="nextButtonClick">
            Next
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-if="$slots.sticky" ref="sticky" class="md:w-1/2 md:ml-4 max-w-3xl flex-shrink">
      <div>
        <slot name="sticky" v-bind="scrollData"/>
      </div>
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
  onUnmounted, toRef
} from "vue"
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import BaseButton from "@/components/shared/BaseButton.vue";

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  components: {BaseButton},
  emits: ["slideChange"],
  props: {
    numGroups: {
      type: Number,
      required: true
    },
  },
  setup: ({numGroups}, {emit}) => {
    const groups = ref<Array<HTMLDivElement>>([]);
    const root = ref<HTMLDivElement>();
    const sticky = ref<HTMLDivElement>();

    const revealed = ref(0);

    onBeforeUpdate(() => {
      groups.value = [];
    })

    const scrollData = reactive({
      current: -1,
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
        trigger: sticky.value,
        endTrigger: root.value,
        start: "top bottom",
        end: "top top",
        onUpdate: ({progress}) => scrollData.enterProgress = progress,
        onLeave: () => {
          scrollData.current = 0
        },
        // onEnterBack: () => scrollData.current = 0
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
      const opacity = i == 0 ? scrollData.enterProgress : Number(revealed.value >= i)
      return {
        opacity
      }
    }

    function nextButtonClick() {
      if (revealed.value + 1 < numGroups) {
        revealed.value++;
        scrollData.current = revealed.value;
      }
    }

    function prevButtonClick() {
      if (scrollData.current > 0) {
        scrollData.current--;
      }
    }

    watch(toRef(scrollData, 'current'), (current, last) => emit('slideChange', Object.assign({direction: current - last}, scrollData)))

    return {
      root,
      sticky,
      groups,
      scrollData,
      scrollTriggersRef,
      groupStyles,
      prevButtonClick,
      nextButtonClick,
      revealed
    }
  },
})
</script>
<style scoped>
.scroll-snap {
  scroll-snap-align: start;
}
</style>
