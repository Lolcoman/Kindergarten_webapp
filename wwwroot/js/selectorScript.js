let options;
window.localStorage.clear(); //vymaže storage po načtení stranky, zpět

function selecting(select) //funkce pro výběr obtížnosti
{
    switch (select) {
        case "1":
            options = 1;
            localStorage.setItem("myValue", options);
            break;
        case "2":
            options = 2;
            localStorage.setItem("myValue", options);
            break;
        case "3":
            options = 3;
            localStorage.setItem("myValue", options);
            break;
        default:
            break;
    }
}