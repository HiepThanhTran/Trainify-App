let colors = []
let borderColors = []
const generateRandomColor = () => {
    let r = Math.random() * 255
    let g = Math.random() * 255
    let b = Math.random() * 255
    return {
        color: `rgba(${r}, ${g}, ${b}, 0.2)`,
        borderColor: `rgba(${r}, ${g}, ${b}, 1)`
    }
}

const generateChart = (ctx, type, label, labels, data) => {
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderWidth: 1,
                backgroundColor: colors,
                borderColor: borderColors,
            }]
        },
    })
}