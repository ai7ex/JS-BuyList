const DEFAULT_ITEMS = [
    { id: 1, name: 'Помідори', quantity: 2, isBought: true },
    { id: 2, name: 'Печиво', quantity: 2, isBought: false },
    { id: 3, name: 'Сир', quantity: 1, isBought: false }
];

let cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || DEFAULT_ITEMS;


const inputElement = document.getElementById('new-item-input');
const btnAdd = document.getElementById('add-btn');
const itemsContainer = document.getElementById('items-container');
const unboughtTagsContainer = document.getElementById('unbought-tags-container');
const boughtTagsContainer = document.getElementById('bought-tags-container');


function renderCart() {
    itemsContainer.innerHTML = '';
    unboughtTagsContainer.innerHTML = '';
    boughtTagsContainer.innerHTML = '';

    cartItems.forEach(item => {
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `item ${item.isBought ? 'bought' : ''}`;
        
        itemDiv.dataset.id = item.id; 

        itemDiv.innerHTML = `
            <span class="item-name" data-tooltip="${item.isBought ? '' : 'Клікніть, щоб редагувати назву'}">${item.name}</span>
            
            <div class="controls">
                ${!item.isBought ? `
                    <button class="btn-circle btn-minus" ${item.quantity <= 1 ? 'disabled' : ''} data-tooltip="Зменшити кількість">-</button>
                ` : ''}
                
                <span class="quantity">${item.quantity}</span>
                
                ${!item.isBought ? `
                    <button class="btn-circle btn-plus" data-tooltip="Збільшити кількість">+</button>
                ` : ''}
            </div>
            
            <div class="actions">
                <button class="btn-status" data-tooltip="${item.isBought ? 'Повернути до списку покупок' : 'Позначити товар як куплений'}">
                    ${item.isBought ? 'Не куплено' : 'Куплено'}
                </button>
                ${!item.isBought ? `
                    <button class="btn-delete" data-tooltip="Видалити товар">×</button>
                ` : ''}
            </div>
        `;
        
        itemsContainer.appendChild(itemDiv);

        const tagHTML = `
            <span class="tag ${item.isBought ? 'bought-tag' : ''}">
                ${item.name} <span class="tag-qty">${item.quantity}</span>
            </span>
        `;
        
        if (item.isBought) {
            boughtTagsContainer.innerHTML += tagHTML;
        } else {
            unboughtTagsContainer.innerHTML += tagHTML;
        }
    });

    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
}


function addNewItem() {
    const itemName = inputElement.value.trim(); 
    
    if (itemName !== '') {
        cartItems.push({
            id: Date.now(), 
            name: itemName,
            quantity: 1,
            isBought: false
        });
        
        inputElement.value = ''; 
        inputElement.focus();    
        renderCart();            
    }
}

btnAdd.addEventListener('click', addNewItem);

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewItem();
    }
});


itemsContainer.addEventListener('click', (event) => {
    const target = event.target;
    
    const itemElement = target.closest('.item');
    if (!itemElement) return; 

    const itemId = Number(itemElement.dataset.id);
    const itemObj = cartItems.find(item => item.id === itemId);

    if (target.classList.contains('btn-plus')) {
        itemObj.quantity += 1;
        renderCart();
    }
    
    else if (target.classList.contains('btn-minus')) {
        if (itemObj.quantity > 1) {
            itemObj.quantity -= 1;
            renderCart();
        }
    }
    
    else if (target.classList.contains('btn-delete')) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        renderCart();
    }
    
    else if (target.classList.contains('btn-status')) {
        itemObj.isBought = !itemObj.isBought; 
        renderCart();
    }

    else if (target.classList.contains('item-name') && !itemObj.isBought) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = itemObj.name;
        editInput.className = 'edit-name-input';
        
        target.replaceWith(editInput);
        editInput.focus();

        const saveNewName = () => {
            const newName = editInput.value.trim();
            if (newName !== '') {
                itemObj.name = newName;
            }
            renderCart(); 
        };

        editInput.addEventListener('blur', saveNewName);
        
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveNewName();
            }
        });
    }
});

renderCart();