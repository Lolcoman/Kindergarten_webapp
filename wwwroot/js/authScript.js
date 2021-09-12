const userName = document.getElementById('UserName');
const password = document.getElementById('Password');
const form = document.getElementById('form');
const errorElement = document.getElementById('error');
const submit = document.getElementById('submit');

//zachycení chyby před načtením stránky a posláním na server
form.addEventListener('submit', (e)=> {
    let message = [];
    if(password.value.length <=  6)
    {
        message.push('Musí být delší než 6 znaků!');
        errorElement.style.color = "red";
    }
    if(password.value.length > 12)
    {
        message.push('Menší než 12 znaků!');
    }
    if (message.length > 0)
    {
        e.preventDefault();
        errorElement.innerHTML = message.join(', ');
    }
})