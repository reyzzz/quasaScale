import { Notify } from 'quasar'

export function useNotify(msg: string, icon: string, color = 'positive') {
  return Notify.create({
    message: msg,
    color: color,
    position: 'top-right',
    icon: icon,
    timeout: 5000,
  })
}
