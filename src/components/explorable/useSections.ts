import {computed, reactive, readonly, Ref, ref} from "vue";

type Section = {
  title: string,
  ref: Ref<HTMLDivElement | undefined>,
  subsections: number
  currentSubsection: number,
}

const sections: Ref<Section[]> = ref([])
const titles: { [title: string]: number} = {}
const current = reactive({
  section: 0,
})

const currentSection = computed(() => sections.value[current.section]);

function registerSection(title: string, ref: Ref<HTMLDivElement | undefined>, subsections: number) {
  if (title in titles) return titles[title];

  const index = sections.value.length;
  titles[title] = index;

  sections.value.push({title, ref, subsections, currentSubsection: 0});

  return index;
}

function scrollIntoView() {
  const container = currentSection.value.ref.value;
  if (container) {
    container.scrollIntoView();
  }
}

function nextSection() {
  if (current.section + 1 < sections.value.length) {
    current.section++;
    scrollIntoView();
  }
}

function prevSection() {
  if (current.section > 0) {
    current.section--;
    scrollIntoView();
  }
}

function setSection(sectionIndex: number, subsection?: number) {
  if (sectionIndex >= 0 && sectionIndex < sections.value.length) {
    current.section = sectionIndex;
    if (typeof subsection == "number") {
      currentSection.value.currentSubsection = subsection;
    }
  }
}

export default function useSections() {
  return {
    registerSection,
    nextSection,
    prevSection,
    setSection,
    currentSection,
    sections: readonly(sections)
  }
}



