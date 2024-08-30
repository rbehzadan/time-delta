async function observeOnce(A, B) {
    const t0 = Date.now()
    const response = await fetch("/time")
    const t3 = Date.now()
    const t12 = parseInt(await response.text())
    const theta = Math.round((t3 - t0) / 2)
    const delta = t12 - t0 - theta
    // return {theta, delta}
    A.push(theta)
    B.push(delta)
    // console.log("OBSERVER:", JSON.stringify({A, B}))
}

function stat(A) {
    const n = A.length
    // console.log({A, n})
    const mean = A.reduce((a, b) => a + b) / n
    const std =  Math.sqrt(A.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    return {mean, std}
}

function calculate(A, B) {
    const a = stat(A)
    const b = stat(B)
    return {
        theta: Math.round(a.mean * 100) / 100,
        theta_std: Math.round(a.std * 100) / 100,
        delta: Math.round(b.mean * 100) / 100,
        delta_std: Math.round(b.std * 100) / 100,
    }
}

async function b1Clicked() {
    $("#btnStart").prop('disabled', true)
    const A = []
    const B = []
    const count = parseInt($("#count").val())
    const delay = parseInt($("#delay").val())
    var i, r

    i = 0
    while (true) {
        i++
        $("#status").text(`Measuring ... ${i}`)
        await observeOnce(A, B)
        // console.log(JSON.stringify({A, B}))
        r = calculate(A, B)
        // console.log(JSON.stringify({r}))
        $("#theta").text(`Theta = ${r.theta} ± ${r.theta_std}`)
        $("#delta").text(`Delta = ${r.delta} ± ${r.delta_std}`)
        if (i == count) {
            if (r != null) {
                break
            }
            i--
        }
        await sleep(delay)
    }

    $("#status").text("Done!")
    $("#btnStart").prop('disabled', false)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
