
let shapes =[]
let labels = []
let positives = 0
let negatives = 0
let score = 0

setWelcome()

function setWelcome(){
    let dWelcome = document.createElement('div')
    let hWelcome = document.createElement('h1')
    let btnWelcome = document.createElement('button')

    document.querySelector('.intro').classList.add('welcome')
    btnWelcome.innerHTML = "OK"
    btnWelcome.classList.add('btn')
    hWelcome.innerText = "Pair Shape to Label"

    dWelcome.appendChild(hWelcome)
    dWelcome.appendChild(btnWelcome)
    dWelcome.classList.add('welcomeWindow')

    document.querySelector('.intro').appendChild(dWelcome)

    btnWelcome.addEventListener('click', () => {
        document.querySelector('.intro').classList.remove('welcome')
        document.querySelector('.intro').innerHTML= ''
        setScore(score)
        setTask()
    })
}

function setRandoms(){
    const names = ['circle','square','triangle']
    const colors = ['yellow','blue','limegreen']
    let randomNames = shuffle(names)
    let randomColors = shuffle(colors)

    for(i=0; i<3; i++){
        let shape = {
            name: randomNames[i],
            color: randomColors[i]
        }
        shapes.push(shape)
    }

    randomNames = shuffle(names)
    randomColors = shuffle(colors)

    for(i=0; i<3; i++){
        let label = {
            name: randomNames[i],
            color: randomColors[i]
        }
        labels.push(label)
    }
}

let Xs = []
let pShapes = []
let pLabels = []

function setTask(){    
    document.querySelector('.task').innerHTML=''
    document.querySelector('.texts').textContent=''
    shapes = []
    labels = []
    pShapes = []
    pLabels = []

    setRandoms()

    for(i=0; i<3;i++){
        pShapes[i] = document.createElement('p')
        pShapes[i].draggable = true
        pShapes[i].classList.add('draggable')
        pShapes[i].classList.add(shapes[i].name)
        pShapes[i].setAttribute('name',shapes[i].name)
        document.querySelector('.task').appendChild(pShapes[i])
        var c = document.querySelector(`.${shapes[i].name}`)        
        c.style.backgroundColor = shapes[i].color
       
        let boxS = pShapes[i].getBoundingClientRect()
        Xs.push(boxS.left + boxS.width/2) 
    }

    for(i=0; i<3;i++){
        pLabels[i] = document.createElement('p')
        pLabels[i].draggable = true
        pLabels[i].classList.add('draggable')
        pLabels[i].innerHTML=labels[i].name
        pLabels[i].setAttribute('name',labels[i].name)
        pLabels[i].classList.add('text')
        pLabels[i].style.color = labels[i].color
        pLabels[i].style.border = `2px solid ${labels[i].color}`
        document.querySelector('.texts').appendChild(pLabels[i])

        let boxT = pLabels[i].getBoundingClientRect()
        boxT.left = Xs[i]
    }

    const draggables = document.querySelectorAll('.draggable')

    let active = false
    let currentX
    let currentY
    let initialX
    let initialY
    let xOffset = 0
    let yOffset = 0

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart',() => {
            draggable.classList.add('dragging')
        })

        draggable.addEventListener('dragend', (e) => {
            check(e.clientX, e.clientY)
            draggable.classList.remove('dragging')
        })

        draggable.addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        /* Mobile screen */
        //let container = document.querySelector('.container')

        draggable.addEventListener('touchstart',(e) => {
            draggable.classList.add('dragging')
            draggable.style.opacity = 1
            initialX =  e.touches[0].clientX - xOffset
            initialY = e.touches[0].clientY - yOffset
            if(e.target === document.querySelector('.dragging')){active=true}
        })

        draggable.addEventListener('touchend', (e) => {

            xOffset = 0
            yOffset = 0
            check(initialX, initialY)
            initialX = 0
            initialY = 0
            active = false
            draggable.classList.remove('dragging')
        })

        draggable.addEventListener('touchmove', (e) => {
            e.preventDefault()
            currentX = e.touches[0].clientX - initialX
            currentY = e.touches[0].clientY - initialY
            xOffset=currentX
            yOffset=currentY
            setTranslate(currentX, currentY, document.querySelector('.dragging'))
        })

    })
}

function setTranslate(xPos,yPos,element){
    element.style.transform = `translate3d(${xPos}px, ${yPos}px,0)`
}

function check(xLoc, yLoc){
    let dragElement = document.querySelector('.dragging')
    let dragElementRect = dragElement.getBoundingClientRect()

    if(yLoc>=dragElementRect.bottom){
        for(i=0; i<3; i++){
        let pLx = pLabels[i].getBoundingClientRect()
            if(xLoc >= pLx.left && xLoc <= pLx.left + pLx.width){
                if(dragElement.getAttribute('name') === pLabels[i].getAttribute('name')){
                    setWon()
                    removePair(dragElement, pLabels[i], 1)
                }else{
                    setFail()
                }
                break
            }
        } 
    }

    if(yLoc<=dragElementRect.top){
        for(i=0; i<3; i++){
        let pSx = pShapes[i].getBoundingClientRect()
            if(xLoc >= pSx.left && xLoc <= pSx.left + pSx.width){
                if(dragElement.getAttribute('name') === pShapes[i].getAttribute('name')){
                    setWon()
                    removePair(dragElement, pShapes[i], -1)
                }else{
                    setFail()
                }
                break
            }
        } 
    }
}

function removePair(dragged, matched, f){
    positives++
    if(positives < 2){        
        dragged.className = ''
        matched.className = ''
        dragged.innerHTML = ''
        matched.innerHTML = ''
        dragged.style = ''
        matched.style = ''
    }else{
        positives = 0
        setTask()
    }
    score++
    setScore(score)
}

function setFail(){
    let dFail = document.createElement('div')
    dFail.classList.add('fail')
    dFail.style.opacity = 0.8
    document.querySelector('.lost').appendChild(dFail)
    setTimeout(() => document.querySelector('.lost').innerHTML='', 100)
    setTask()
    score = 0
    setScore(score)
}

function setWon(){
    let dWon = document.createElement('div')
    dWon.classList.add('point')
    dWon.style.opacity = 0.8
    document.querySelector('.won').appendChild(dWon)
    setTimeout(() => document.querySelector('.won').innerHTML='', 100)
}

function setScore(score){
    document.querySelector('.score').innerHTML = score
}

function shuffle(array){
    let currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex){
        randomIndex = Math.floor(Math.random()*currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex] 
        array[currentIndex] = array[randomIndex]
        array[randomIndex]= temporaryValue
    }
    return array
}

