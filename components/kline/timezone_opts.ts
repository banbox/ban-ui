import i18n from "~/composables/i18n";
let t = i18n.global.t

export function translateTimezone (timezone: string): string {
  switch (timezone) {
    case 'Etc/UTC': return t('utc')
    case 'Pacific/Honolulu': return t('honolulu')
    case 'America/Juneau': return t('juneau')
    case 'America/Los_Angeles': return t('los_angeles')
    case 'America/Chicago': return t('chicago')
    case'America/Toronto': return t('toronto')
    case 'America/Sao_Paulo': return t('sao_paulo')
    case 'Europe/London': return t('london')
    case 'Europe/Berlin': return t('berlin')
    case 'Asia/Bahrain': return t('bahrain')
    case 'Asia/Dubai': return t('dubai')
    case 'Asia/Ashkhabad': return t('ashkhabad')
    case 'Asia/Almaty': return t('almaty')
    case 'Asia/Bangkok': return t('bangkok')
    case 'Asia/Shanghai': return t('shanghai')
    case 'Asia/Tokyo': return t('tokyo')
    case 'Australia/Sydney': return t('sydney')
    case 'Pacific/Norfolk': return t('norfolk')
  }
  return timezone
}

export function getTimezoneSelectOptions () {
  return [
    { key: 'Etc/UTC', text: t('utc') },
    { key: 'Pacific/Honolulu', text: t('honolulu') },
    { key: 'America/Juneau', text: t('juneau') },
    { key: 'America/Los_Angeles', text: t('los_angeles') },
    { key: 'America/Chicago', text: t('chicago') },
    { key: 'America/Toronto', text: t('toronto') },
    { key: 'America/Sao_Paulo', text: t('sao_paulo') },
    { key: 'Europe/London', text: t('london') },
    { key: 'Europe/Berlin', text: t('berlin') },
    { key: 'Asia/Bahrain', text: t('bahrain') },
    { key: 'Asia/Dubai', text: t('dubai') },
    { key: 'Asia/Ashkhabad', text: t('ashkhabad') },
    { key: 'Asia/Almaty', text: t('almaty') },
    { key: 'Asia/Bangkok', text: t('bangkok') },
    { key: 'Asia/Shanghai', text: t('shanghai') },
    { key: 'Asia/Tokyo', text: t('tokyo') },
    { key: 'Australia/Sydney', text: t('sydney') },
    { key: 'Pacific/Norfolk', text: t('norfolk') }
  ]
}