import { menuArray } from './data.js'

const mainEl = document.getElementById('main')
const menuContainerEl = document.getElementById('menu-container')
const totalOrderEl = document.getElementById('total-order')
const modalEl = document.getElementById('modal')
const modalCloseBtnEl = document.getElementById('modal-close-btn')
const formEl = document.getElementById('form')

let order = []
const discount = 0.85

menuContainerEl.addEventListener('click', addItemToOrder)

function addItemToOrder(e) {
  const itemId = e.target.id.slice(-1)
  if (itemId) {
    const chosenDish = menuArray.filter(dish => dish.id === +itemId)
    const isDishInOrder = order
      .filter(dishInOrder => dishInOrder.name === chosenDish[0].name)
    if (isDishInOrder.length) {
      isDishInOrder[0].amount++
    } else {
      const newItemOrder = {
        name: chosenDish[0].name,
        price: chosenDish[0].price,
        amount: 1
      }
      order.push(newItemOrder)
    }
    createTotalOrderBlock()
  }
}

totalOrderEl.addEventListener('click', actInTotalOrder)

function actInTotalOrder(e) {
  const targetId = e.target.id
  if (targetId.includes('remove-item-btn-')) {
    const nameInOrder = targetId.slice(16)
    const correctedItem = order.filter(item => item.name === nameInOrder)[0]
    if (correctedItem.amount > 1) {
      correctedItem.amount -= 1
    } else {
      order = order.filter(item => item.name !== nameInOrder)
    }
    if (order.length) {
      createTotalOrderBlock()
    } else {
      totalOrderEl.innerHTML = ''
    }
  } else if (targetId === 'complete-order-btn') {
    modalEl.style.display = 'flex'
    modalEl.style.flexDirection = 'column'
    mainEl.style.backgroundColor = 'rgba(128, 132, 140, 0.8)'
    totalOrderEl.removeEventListener('click', actInTotalOrder)
    menuContainerEl.removeEventListener('click', addItemToOrder)
    const addDishBtnCol = document.getElementsByClassName('add-dish-btn')
    Array.from(addDishBtnCol).forEach(btn => btn.disabled = true)
    const removeBtnCol = document.getElementsByClassName('remove-item-btn')
    Array.from(removeBtnCol).forEach(btn => btn.disabled = true)
    document.getElementById('complete-order-btn').disabled = true
  }
}

function createBlockMenu(menuElement) {
  return `
    <div class="menu-block">
      <image class="dish-image" src="${menuElement.image}">
      <div class="dish-description-container">
       <h3 class="dish-name">${menuElement.name}</h3>
       <p class="dish-description">${menuElement.ingredients.join(', ')}</p>
       <h6 class="dish-price">$${menuElement.price}</h6>
      </div>
      <button
        type="button"
        class="add-dish-btn"
        id="add-dish-btn-${menuElement.id}"
      >
        +
      </button>
    </div>
`
}

menuContainerEl.innerHTML = menuArray
  .map(menuPoint => createBlockMenu(menuPoint)).join('')

function createTotalOrderBlock() {
  const isDiscont = order.length > 1
    && order.some(dish => dish.name === 'Beer')
  const totalPrice = order
    .reduce((total, item) => total + item.price * item.amount, 0)
  const priceWithDiscont = (totalPrice * discount).toFixed(2)
  totalOrderEl.innerHTML = `
    <h3 class="order-title">Your order</h3>
    <ul class="order-list">
      ${order.map(orderItem => createOrderItemEl(orderItem)).join('')}
    </ul>
    <div class="total-price-container">
      <h3 class="total-price-title">Total price:</h3>
      <h6 class="total-price">${isDiscont ? '$' + totalPrice : ''}</h6>
      <h6 class="total-price-discont">
        $${isDiscont ? priceWithDiscont : totalPrice}
      </h6>
    </div>
    <button
      class="complete-order-btn"
      id="complete-order-btn"
      type="button"
    >
      Complete order
    </button>
  `
} 

function createOrderItemEl(orderItem) {
  return `
    <li class="order-item">
      <h3 class="order-item-name">${orderItem.name}</h3>
      <button
        class="remove-item-btn"
        id="remove-item-btn-${orderItem.name}"
        type="button"
      >
        remove
      </button>
      <h6 class="order-item-amount order-item-detail">
        ${orderItem.amount}
      </h6>
      <h6 class="order-item-price order-item-detail">
        $${orderItem.price * orderItem.amount}
      </h6>
    </li>
  `
}

formEl.addEventListener('submit', function(e) {
  e.preventDefault()
  modalEl.style.display = 'none'
  mainEl.style.backgroundColor = '#fff'
  const inputName = document.querySelector('input[name="input-name"]')
  totalOrderEl.innerHTML = `
    <h2 class="thanks">
      Thanks, ${inputName.value}! Your order is on its way!
    </h2>
    <div class="rate-container">
      <p class="rate-title">Rate, please, your experience:</p>
      <div class="stars-container" id="stars-container">
        ${Array.from({ length: 5 })
          .map((el, i) => {
            return (`
              <div class="star" id="star-${i + 1}"></div>
            `)
        }).join('')}
      </div>
    </div>
    <button type="button" class="new-order-btn" id="new-order-btn">
      Make another order
    </button>
  `

  const starCol = Array.from(document.getElementsByClassName('star'))

  document.getElementById('stars-container').addEventListener('mouseover',
    (e) => addStarActiveStyle(e.target.id, starCol)
  )

  document.getElementById('new-order-btn').addEventListener('click', function() {
    window.location.reload()
  })
})

modalCloseBtnEl.addEventListener('click', function() {
  modalEl.style.display = 'none'
  mainEl.style.backgroundColor = '#fff'
  totalOrderEl.addEventListener('click', actInTotalOrder)
  menuContainerEl.addEventListener('click', addItemToOrder)
  const addDishBtnCol = document.getElementsByClassName('add-dish-btn')
  Array.from(addDishBtnCol).forEach(btn => btn.disabled = false)
  const removeBtnCol = document.getElementsByClassName('remove-item-btn')
  Array.from(removeBtnCol).forEach(btn => btn.disabled = false)
  document.getElementById('complete-order-btn').disabled = false
})

function addStarActiveStyle(targetId, starCol) {
  if (targetId !== 'stars-container') {
    const starsAmount = Number(targetId.slice(-1))
    starCol.forEach((starEl, i) => i < starsAmount
      ? starEl.classList.add('star-active')
      : starEl.classList.remove('star-active'))
  }
}
