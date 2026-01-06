export function getSystem() {
  if (navigator.userAgent.includes('Mac')) {
    return 'mac'
  }

  if (navigator.userAgent.includes('Linux')) {
    return 'linux'
  }

  return 'windows'
}

const modifierMap = {
  keyevent: {
    meta: 'metaKey',
    control: 'ctrlKey',
    alt: 'altKey',
  },
  modifier: {
    meta: 'Meta',
    control: 'Control',
    alt: 'Alt',
  },
}

export function getDefaultModifier(type?: 'keyevent'): 'ctrlKey' | 'metaKey'
export function getDefaultModifier(type: 'modifier'): 'Meta' | 'Control'
export function getDefaultModifier(type: 'keyevent' | 'modifier' = 'keyevent') {
  if (getSystem() === 'mac') {
    return modifierMap[type]['meta']
  }

  return modifierMap[type]['control']
}

export function getAlternativeModifier(type?: 'keyevent'): 'ctrlKey' | 'altKey'
export function getAlternativeModifier(type: 'modifier'): 'Control' | 'Alt'
export function getAlternativeModifier(type: 'keyevent' | 'modifier' = 'keyevent') {
  if (getSystem() === 'mac') {
    return modifierMap[type]['control']
  }

  return modifierMap[type]['alt']
}
