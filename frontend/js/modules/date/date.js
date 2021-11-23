const setDate = () => {
    // Info date
    const dateNumber = document.getElementById('dateNumber');
    const dateText = document.getElementById('dateText');
    const dateMonth = document.getElementById('dateMonth');
    const dateYear = document.getElementById('dateYear');

    //Update the date of the Client
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
    console.log("Works!");
};

setDate();