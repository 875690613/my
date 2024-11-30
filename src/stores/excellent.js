import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useExcellentStore = defineStore('excellent', () => {
  const isExcellent = ref(false)
  const excellentInfo = ref({})
  const token = ref('')
  const staffNo = ref('')
  const hasRecord = ref(false)
  const recordInfo = ref({})

  return { isExcellent, excellentInfo, token, staffNo, recordInfo, hasRecord }
})
