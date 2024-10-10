import { copyToClipboard } from 'quasar'
import { ACLConfig } from 'src/types/Database'
export function useUtils() {
  function chopString(message: string): string {
    return (
      message.substring(0, 6) +
      '...' +
      message.substring(message.length - 4, message.length)
    )
  }
  async function copyString(message: string) {
    await copyToClipboard(message)
    useNotify('Value copied to clipboard', 'check')
  }

  function generateMachineKey() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  function validateIPv4(IP: string): boolean {
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/
    return ipRegex.test(IP)
  }
  function validateIPv6(IP: string): boolean {
    //Full IPv6 | compressed | mixed
    const ipRegex =
      /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/

    return ipRegex.test(IP)
  }

  function isPatternPresentInEntity(pattern: string, string_to_check: string) {
    const regex = new RegExp(pattern, 'g')

    const matches = JSON.stringify(string_to_check).match(regex)

    return matches !== null
  }

  async function replacePatternInEntity(
    pattern: string,
    new_pattern: string,
    string_to_check: string,
  ): Promise<ACLConfig> {
    const regex = new RegExp(pattern, 'g')

    if (regex.test(string_to_check)) {
      const test = string_to_check.replace(regex, new_pattern)
      return JSON.parse(test)
    }
    return JSON.parse(string_to_check)
  }

  return {
    chopString,
    copyString,
    generateMachineKey,
    validateIPv4,
    validateIPv6,
    isPatternPresentInEntity,
    replacePatternInEntity,
  }
}
