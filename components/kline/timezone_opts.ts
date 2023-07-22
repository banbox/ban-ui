
export function translateTimezone (timezone: string): string {
  switch (timezone) {
    case 'Etc/UTC': return 'utc'
    case 'Pacific/Honolulu': return 'honolulu'
    case 'America/Juneau': return 'juneau'
    case 'America/Los_Angeles': return 'los_angeles'
    case 'America/Chicago': return 'chicago'
    case'America/Toronto': return 'toronto'
    case 'America/Sao_Paulo': return 'sao_paulo'
    case 'Europe/London': return 'london'
    case 'Europe/Berlin': return 'berlin'
    case 'Asia/Bahrain': return 'bahrain'
    case 'Asia/Dubai': return 'dubai'
    case 'Asia/Ashkhabad': return 'ashkhabad'
    case 'Asia/Almaty': return 'almaty'
    case 'Asia/Bangkok': return 'bangkok'
    case 'Asia/Shanghai': return 'shanghai'
    case 'Asia/Tokyo': return 'tokyo'
    case 'Australia/Sydney': return 'sydney'
    case 'Pacific/Norfolk': return 'norfolk'
  }
  return timezone
}

export function getTimezoneSelectOptions () {
  return [
    { key: 'Etc/UTC', text: 'utc' },
    { key: 'Pacific/Honolulu', text: 'honolulu' },
    { key: 'America/Juneau', text: 'juneau' },
    { key: 'America/Los_Angeles', text: 'los_angeles' },
    { key: 'America/Chicago', text: 'chicago' },
    { key: 'America/Toronto', text: 'toronto' },
    { key: 'America/Sao_Paulo', text: 'sao_paulo' },
    { key: 'Europe/London', text: 'london' },
    { key: 'Europe/Berlin', text: 'berlin' },
    { key: 'Asia/Bahrain', text: 'bahrain' },
    { key: 'Asia/Dubai', text: 'dubai' },
    { key: 'Asia/Ashkhabad', text: 'ashkhabad' },
    { key: 'Asia/Almaty', text: 'almaty' },
    { key: 'Asia/Bangkok', text: 'bangkok' },
    { key: 'Asia/Shanghai', text: 'shanghai' },
    { key: 'Asia/Tokyo', text: 'tokyo' },
    { key: 'Australia/Sydney', text: 'sydney' },
    { key: 'Pacific/Norfolk', text: 'norfolk' }
  ]
}