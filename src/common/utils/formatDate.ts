import dayjs from 'dayjs'

export function formatDate(timestamp?: number): string {
    if (typeof timestamp !== 'number') {
        return ''
    }

    return dayjs.unix(timestamp).utc().format('YYYY/MM/DD')
}

export function formatDateDisplay(timestamp?: number): string {
    if (typeof timestamp !== 'number') {
        return ''
    }

    const formatter = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeZone: 'UTC',
    } as unknown as Intl.DateTimeFormatOptions)

    return formatter.format(timestamp)
}
