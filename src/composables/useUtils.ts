export function useUtils() {
  function chopString(message: string): string {
    return (
      message.substring(0, 6) +
      '...' +
      message.substring(message.length - 4, message.length)
    )
  }
  function copyString(message: string) {
    navigator.clipboard.writeText(message)
    useNotify('Value copied to clipboard', 'check')
  }
  function arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false
    const sortedArr1 = arr1.slice().sort()
    const sortedArr2 = arr2.slice().sort()
    return sortedArr1.every((value, index) => value === sortedArr2[index])
  }

  function generateMachineKey() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return { chopString, copyString, arraysEqual, generateMachineKey }
}
