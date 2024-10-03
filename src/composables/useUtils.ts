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
  function validatedIPv4(IP: string): boolean {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
    return ipRegex.test(IP)
  }
  function validatedIPv6(IP: string): boolean {
    //Full IPv6 | compressed | mixed
    const ipRegex =
      /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/

    return ipRegex.test(IP)
  }
  return {
    chopString,
    copyString,
    arraysEqual,
    generateMachineKey,
    validatedIPv4,
    validatedIPv6,
  }
}
