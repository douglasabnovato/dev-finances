const Modal = {
    open(){
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close(){
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
} 

const Transaction = {
    
    all: [
        {
            description: 'Cemig',
            amount: -50020,
            date: '01/10/2021',
        },
        {
            description: 'Website Top',
            amount: 10075,
            date: '10/10/2021',
        },
        {
            description: 'Internet Vero',
            amount: 16041,
            date: '06/10/2021',
        }, 
        {
            description: 'Website Nubank',
            amount: 10575,
            date: '14/10/2021',
        },
        {
            description: 'App Uber Negócios',
            amount: 52041,
            date: '23/10/2021',
        },
    ], 

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()//atualizar aplicação 
    },

    remove(index){
        Transaction.all.splice(index,1)
        App.reload()
    },

    incomes(){
        let income = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0){
                income += transaction.amount;
            }
        })
        return income
    },

    expenses(){
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        })
        return expense   
    },

    total(){
        //remover das entradas o valor das saídas
        return (Transaction.incomes() + Transaction.expenses()) 
    },
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) 
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr) 
    },

    innerHTMLTransaction(transaction, index) {
        const CssClass = transaction.amount > 0 ? 'income' : 'expense' 
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CssClass}">${amount}</td>
            <td class="date">${transaction.date}</td> 
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação."></td>
        ` 
        return html
    },

    updateBalance(){
        document
            .getElementById('income-display')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expense-display')
            .innerHTML = Utils.formatCurrency(Transaction.expenses()) 
        document
            .getElementById('total-display')
            .innerHTML = Utils.formatCurrency(Transaction.total()) 
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        return value
    },

    formatDate(date){ 
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "" 
        value = String(value).replace(/\D/g, "") 
        value = Number(value) / 100 
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }) 
       return signal + value
    }
}

const Form = {

    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues(){
        return{
            description: Form.description.value,    
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){//validar informações foram preenchidas
        const { description, amount, date } = Form.getValues()  
        if(description.trim() === "" || amount.trim() === ""  || date.trim() === "" ){
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    formatData(){//formatar dados para salvar
        let { description, amount, date } = Form.getValues()  
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date) 
        return {
            description,
            amount,
            date,
        }
    },

    saveTransaction(transaction){//salvar dados do formulário
        Transaction.add(transaction)
    },

    clearFields(){//limpar dados para o próximo preenchimento
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){  
        event.preventDefault() 
        try{ 
            Form.validateFields()  
            const transaction = Form.formatData() 
            Form.saveTransaction(transaction)  
            Form.clearFields()
            Modal.close()//fechar modal 
        }catch(error){
            alert(error.message)
        }
    }
}

const App = {
    init(){
        Transaction.all.forEach( DOM.addTransaction )
        DOM.updateBalance() 
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init() 
 