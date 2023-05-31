export const isUserAdult = (dateString: string| number) => {
    const currentDate = new Date()
    const inputDate = new Date(dateString)
    const adultAgeDate = new Date(
        currentDate.getFullYear() - 18,
        currentDate.getMonth(),
        currentDate.getDate()
    )

    return adultAgeDate >= inputDate
}
