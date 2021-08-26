<template>
  <div class="h-screen w-full flex flex-col items-center" ref="sectionOne">
    <div class="ml-6 md:ml-0 text-5xl font-bold mt-24" ref="title">
      The Most Mathematical Game
    </div>
    <div class="text-2xl font-bold mt-12 " ref="subtitle">
      An Interactive Exploration
    </div>
    <div class="mt-4 text-lg h-12" ref="taughtBy" v-show="showTaughtBy">
      Taught by Bill Shillito
    </div>
    <div class="text-lg" ref="byline">
      Developed by Dan Jutan
    </div>
    <div ref="artcredit" class="text-lg">
      With art by Steve Johnson
    </div>
    <div ref="scroll" class="text-center mt-16 mb-4">
      Scroll to Continue
    </div>
    <div class="transform -translate-y-1/2 w-64 sm:w-80 md:w-96 lg:w-1/2 max-w-xl" ref="demo">
      <GameCreator :demoMode="true"/>
    </div>
  </div>
  <div :style="{top: '100vh'}" class="absolute left-4 lg:left-24 flex flex-col items-center" ref="billmoji">
    <Billmoji class="w-48 sm:w-64 md:w-80 lg:w-96"></Billmoji>
  </div>
  <div class="h-96 w-full">
  </div>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-12 items-center">
      <div class="ml-4 lg:ml-0">
        <i>Dedicated to <b>John Horton Conway</b> (1937 - 2020), who showed us how to <b>play with mathematics</b></i>
      </div>
      <div>
        <img :src="conway" class="w-48 sm:w-64 md:w-80 lg:w-96"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Color} from "@/model/segment-color";
import {computed, onMounted, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import GamePlayer from "@/components/player/GamePlayer.vue";
import GameCreator from "@/components/creator/GameCreator.vue";
import Billmoji from "./Billmoji.vue"
import conway from "@/assets/Conway.png"

import {gsap} from "gsap"

import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;
  console.log("slideChange", current, direction);
}

const sectionOne = ref();
const title = ref();
const subtitle = ref();
const scroll = ref();
const byline = ref();
const taughtBy = ref();
const artcredit = ref();
const demo = ref();

const billmoji = ref();

const transitionUpScrub = ref(0);
const showTaughtBy = ref(true);

onMounted(() => {

  const blinker = gsap.fromTo(scroll.value, {opacity: 0}, {
        paused: true,
        opacity: 1,
        duration: 1,
        repeat: -1,
        yoyo: true
      },
      "-=0.1")

  const fadeIn = gsap.timeline({delay: 0.5});
  fadeIn.fromTo(title.value, {opacity: 0}, {opacity: 1, duration: 1.5})
  fadeIn.fromTo([demo.value], {opacity: 0}, {opacity: 1, duration: 2}, "-=1.5")
  fadeIn.fromTo([subtitle.value], {opacity: 0}, {opacity: 1, duration: 2}, "-=0.8")
  fadeIn.fromTo([byline.value, taughtBy.value], {opacity: 0}, {opacity: 1, duration: 1.2}, "-=0.8")
  fadeIn.fromTo(artcredit.value, {opacity: 0}, {
        opacity: 1, duration: 1.2,
        onComplete() {
          blinker.play(0);
          fadeIn.kill();
        }
      }
  )

  //
  // const taughtbySlide = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: billmoji.value,
  //     start: "top bottom",
  //     end: "top center+=200",
  //     scrub: 1,
  //   }
  // });
  //
  // taughtbySlide.fromTo(billmoji.value, {opacity: 0, duration: 0.3}, {
  //   opacity: 1
  // })
  //
  // taughtbySlide.to(billmoji.value, {
  //       y: "-=300", duration: 1,
  //       // ease: "slow (0.7, 1, false)"
  //     },
  //     "<")
  gsap.to(billmoji.value,
    {top: 0,
      scrollTrigger: {
        trigger: taughtBy.value,
        start: "top 200",
        end: "top -600",
        scrub: true,
      }
    })

  // gsap.to([taughtBy.value],
  //   {y: "-=400",
  //     scrollTrigger: {
  //       trigger: taughtBy.value,
  //       start: "top -200",
  //       end: "top -600",
  //       scrub: true,
  //     }
  //   })

  gsap.to(taughtBy.value,
    {y: "+=200",
      scrollTrigger: {
        trigger: taughtBy.value,
        start: "top 200",
        end: "top -600",
        scrub: true
      }
    })


  // ScrollTrigger.create({
  //   trigger: taughtBy.value,
  //   start: "top 200",
  //   end: "top -1200",
  //   onLeave: () => showTaughtBy.value = false,
  //   onEnterBack: () => showTaughtBy.value = true,
  // })



  gsap.to([demo.value, title.value, subtitle.value, byline.value, artcredit.value, scroll.value], {
    y: "-=1000", scrollTrigger: {
      trigger: sectionOne.value,
      start: "top top",
      end: "200 top",
      onUpdate({progress}) { transitionUpScrub.value = progress },
      scrub: true,
    },
  })

})
</script>

<style scoped>

</style>