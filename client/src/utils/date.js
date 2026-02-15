export function formatDateDMY(isoString){
    if (!isoString) return '';
    const date = new Date(isoString)
    

    return date.toLocaleDateString('en-GB',{
        day:'2-digit',
        month:'2-digit',
        year:'numeric'
    })
}