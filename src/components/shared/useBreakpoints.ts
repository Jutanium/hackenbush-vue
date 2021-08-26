import { computed, onMounted, onUnmounted, ref } from "vue"

export default function () {
  let windowWidth = ref(window.innerWidth)

  const onWidthChange = () => windowWidth.value = window.innerWidth
  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const type = computed(() => {
    if (windowWidth.value < 640) return 'mobile'
    if (windowWidth.value < 768) return 'sm'
    if (windowWidth.value < 1024) return 'md'
    if (windowWidth.value < 1280) return 'lg';
    if (windowWidth.value < 1536) return 'xl';
    return '2xl';
  })

  const width = computed(() => windowWidth.value)

  const isMobile = computed(() => {
    if (windowWidth.value < 768) return true;
    return false;
  })
  return { width, isMobile }
}
