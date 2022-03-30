const countItems = document.querySelector(".count-items")
const filters = document.querySelectorAll(".filter")
const createButton = document.querySelector(".app__enter .enter .radio")
const enter = document.querySelector(".enter-text")
const list = document.querySelector('.list')
const clrCompleted = document.querySelector('.clr-completed')
const switchThemeBtn = document.querySelector('.btn-switch-theme')

if (!localStorage.getItem('todos')){
    localStorage.setItem('todos', "[]")
}

const listItems = document.querySelectorAll(".list__item")

let counter = 0

let LSObj = {}

let LSArr = JSON.parse(localStorage.getItem('todos')) || []

let todoArr = LSArr

filters[0].classList.add('blue')
filters.forEach(filter => {
    if (filter.textContent === 'All' && filter.classList.contains('blue')){
        for(let i = 0; i < LSArr.length; i++){
            list.insertAdjacentHTML('afterbegin',`
              <div class="list__item" data-id="${i}">
             <div class="left-part">
             <div class="radio"></div>
             <p class="name">${LSArr[i].val}</p>
             </div>
             <img class="delete" src="icon-cross.svg">
               </div>` )
        }
        countItems.textContent = LSArr.length.toString()

        listItems.forEach(item => {
            item.addEventListener('mouseenter', function (event){
                let $el = event.target
                $el.querySelector('.delete').style.display = 'block'
            })
            item.addEventListener('mouseleave', function (event){
                let $el = event.target
                $el.querySelector('.delete').style.display = 'none'
            })

        })
        for(let i in LSArr){
            const listItems = document.querySelectorAll(".list__item")
            if (LSArr[i].conf === "active"){
                listItems.forEach(item => {
                    if (item.dataset.id === i){
                        item.querySelector('.radio').classList.remove('confirm')
                        item.querySelector('.name').style.opacity = '1'
                        item.querySelector('.name').style.textDecoration= 'none'
                    }
                })
            }else if (LSArr[i].conf === "confirmed"){
                listItems.forEach(item => {
                    if (item.dataset.id === i){
                        item.querySelector('.radio').classList.add('confirm')
                        item.querySelector('.name').style.opacity = '0.5'
                        item.querySelector('.name').style.textDecoration = 'line-through'
                    }
                })

            }
        }

    }
    filter.addEventListener('click', function (event){
        let listItems = document.querySelectorAll('.list__item')
        event.preventDefault()
        filters.forEach(filter =>{
            filter.classList.remove('blue')
        })
        event.target.classList.add('blue')
        if(event.target.textContent === 'Active' && event.target.classList.contains('blue')){
            listItems.forEach(item => {
                if (item.querySelector('.radio').classList.contains('confirm')){
                    item.style.display = 'none'
                }else{
                    item.style.display = 'flex'
                }
            })
        } else if (event.target.textContent === 'All' && event.target.classList.contains('blue')){
            listItems.forEach(item =>{
                item.style.display = 'flex'
            })
        } else if (event.target.textContent === 'Completed' && event.target.classList.contains('blue')){
            listItems.forEach(item => {
                if (!item.querySelector('.radio').classList.contains('confirm')){
                    item.style.display = 'none'
                } else{
                    item.style.display = 'flex'
                }
            })
        }
    })
})


createButton.addEventListener('click', Todo)
clrCompleted.addEventListener('click', clearCompleted)
switchThemeBtn.addEventListener('click', switchTheme)

function Todo(){
    let input = enter.value
    counter = todoArr.length
    if (!input){
        enter.setAttribute('placeholder', "Enter your todo!")
        setTimeout(function (){
            enter.setAttribute('placeholder', "Create new todo...")
        },2000)

    } else{
        let item = {
            val: input,
            conf: "active"
        }
        todoArr.push(item)
        LSObj.name = todoArr[counter]
        list.insertAdjacentHTML('afterbegin',
            `
              <div class="list__item" data-id="${counter}">
             <div class="left-part">
             <div class="radio"></div>
             <p class="name">${todoArr[counter].val}</p>
             </div>
             <img class="delete" src="icon-cross.svg" >
               </div>` )
        counter++
    }
    countItems.textContent = todoArr.length.toString()
    localStorage.setItem('todos', JSON.stringify(todoArr))

    let cross = document.querySelectorAll('.delete')
    cross.forEach(del => {
        del.addEventListener('click', deleteTodo)
    })
    const confirmBtn = document.querySelectorAll('.list__item .radio')
    confirmBtn.forEach(btn => {
        btn.addEventListener('click', confirm)
    })

}
let cross = document.querySelectorAll('.delete')
cross.forEach(del => {
    del.addEventListener('click', deleteTodo)
})

function deleteTodo(event){
    let listItem = event.target.closest('.list__item')
    listItem.remove()
    let name = listItem.querySelector('.name').textContent
    LSArr.splice(LSArr.indexOf(name), 1)
    localStorage.setItem('todos', `${JSON.stringify(LSArr)}`)
    countItems.textContent = LSArr.length.toString()

}
const confirmBtn = document.querySelectorAll('.list__item .radio')
confirmBtn.forEach(btn => {
    btn.addEventListener('click', confirm)
})
function confirm(event){
    let id = event.target.closest(".list__item").dataset.id
    let arr = JSON.parse(localStorage.getItem('todos'))
    let name = event.target.closest('.list__item').querySelector('.name')
    if(event.target.classList.contains('confirm')){
        event.target.classList.remove('confirm')
        name.style.opacity = '1'
        name.style.textDecoration = 'none'
        arr[id].conf = "active"
        localStorage.setItem('todos', JSON.stringify(arr))
    } else{
        event.target.classList.add('confirm')
        name.style.textDecoration = 'line-through'
        name.style.opacity = '0.5'
        arr[id].conf = 'confirmed'
        localStorage.setItem('todos', JSON.stringify(arr))
    }
}
function clearCompleted(){
    let LSArr = JSON.parse(localStorage.getItem('todos'))
    let listItems = document.querySelectorAll('.list__item')
    listItems.forEach(item => {
        if (item.querySelector('.radio').classList.contains('confirm')){
            let name = item.querySelector('.name')
            LSArr.splice(LSArr.indexOf(name), 1)
            item.remove()
            localStorage.setItem('todos', JSON.stringify(LSArr))
        }
    })

}
function switchTheme(event){
    if (event.target.getAttribute('src') === 'icon-sun.svg'){
        event.target.setAttribute('src', 'icon-moon.svg')
        document.body.style.cssText = `
        background: white url(bg-desktop-light.jpg) no-repeat ;
        background-size: 100% 350px;
        `
        document.querySelector('.app__list').style.cssText =`
        background-color: white ;
        color:  hsl(233, 14%, 35%);
        border-radius: 5px;
        box-shadow: 4px 4px 34px 17px rgba(34, 60, 80, 0.2);
        `
        document.querySelectorAll('.name').forEach(n => {
            n.style.color = 'hsl(235, 24%, 19%)'
        })
        document.querySelectorAll('.list__item').forEach(i => {
            i.style.borderBottom = '1px solid hsl(236, 33%, 92%)'
        })
        document.querySelectorAll('.radio').forEach(r => {
            r.style.border = '2px solid hsl(236, 33%, 92%)'
        })
        document.querySelector('.app__enter').style.backgroundColor = 'white'
        document.querySelector('.enter-text').style.setProperty('--placeholder', 'hsl(233, 11%, 84%)')
        document.querySelectorAll('.radio').forEach(r => {
            r.style.setProperty('--background', 'linear-gradient(hsl(0, 100%, 100%),hsl(0, 100%, 100%) ) , linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%))')
        })
    } else{
        event.target.setAttribute('src', 'icon-sun.svg')
        document.body.style.cssText = `
        background: hsl(235, 21%, 11%) url(bg-desktop-dark.jpg) no-repeat ; 
        background-size: 100% 350px;
        `
        document.querySelector('.app__list').style.cssText =`
        background-color: hsl(235, 24%, 19%) ;
        color:  hsl(233, 14%, 35%);
        border-radius: 5px;
        `
        document.querySelectorAll('.name').forEach(n => {
            n.style.color = 'hsl(234, 39%, 85%)'
        })
        document.querySelectorAll('.list__item').forEach(i => {
            i.style.borderBottom = '1px solid hsl(233, 14%, 35%)'
        })
        document.querySelectorAll('.radio').forEach(r => {
            r.style.border = '2px solid hsl(233, 14%, 35%)'
        })
        document.querySelector('.app__enter').style.backgroundColor = 'hsl(235, 24%, 19%)'
        document.querySelector('.enter-text').style.setProperty('--placeholder', 'hsl(233, 14%, 35%)')
        document.querySelectorAll('.radio').forEach(r => {
            r.style.setProperty('--background', 'linear-gradient(hsl(235, 24%, 19%),hsl(235, 24%, 19%) ) , linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%))')
        })
    }

}




