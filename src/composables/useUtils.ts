import { copyToClipboard } from 'quasar'
const { acl_config } = storeToRefs(useAclsStore())
const { refreshVariables, updateACLs } = useAclsStore()
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

  function isPatternPresentInEntity(pattern: string) {
    const regex = new RegExp(
      `"${pattern}(:((\\*)|([1-9][0-9]*(,[1-9][0-9]*)*)))?"(,|])`,
      'g',
    )

    const matches = JSON.stringify(acl_config.value).match(regex)

    return matches !== null
  }

  async function replacePatternInEntity(pattern: string, new_pattern: string) {
    const regex = new RegExp(
      `"${pattern}(:((\\*)|([1-9][0-9]*(,[1-9][0-9]*)*)))?"(,|]|:)`,
      'g',
    )
    const stringify_acl_config = JSON.stringify(acl_config.value)

    if (regex.test(stringify_acl_config)) {
      const test = stringify_acl_config.replace(regex, `"${new_pattern}$1"$6`)
      acl_config.value = await JSON.parse(test)
      await updateACLs(acl_config.value)
      refreshVariables()
    }
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
