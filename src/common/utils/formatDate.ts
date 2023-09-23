export function formatDate(timestamp?: number): string {
    if (typeof timestamp !== 'number') {
        return ''
    }

    const date = new Date(timestamp)
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = (date.getDate()).toString().padStart(2, '0')

    return `${yyyy}/${mm}/${dd}`
}

export function formatDateDisplay(timestamp?: number): string {
    if (typeof timestamp !== 'number') {
        return ''
    }

    const formatter = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeZone: 'UTC',
    })

    return formatter.format(new Date(timestamp))
}
