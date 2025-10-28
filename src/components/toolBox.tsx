// regroupement de fonctions pratiques, par exemple pour le formattage des dates

export function dateFormatDDMMYYYY (datestr: string | Date) {
    const date: Date = new Date(datestr);
    let dateClean: string = "";
    const month:number = date.getMonth()+1;

    if (date.getDate().toString().length <= 1) dateClean += "0";
    dateClean += date.getDate() + "/" // rajoute le jour DD

    if (month.toString().length <= 1) dateClean += "0";
    dateClean += month + "/" // rajoute le mois MM

    dateClean += date.getFullYear(); // rajoute l'année YYYY

    return dateClean;
}

export function timeFormatHHMM (datestr: string | Date) {
    const date: Date = new Date(datestr);
    let timeClean: string = "";

    if (date.getHours().toString().length <= 1) timeClean += "0"; 
    timeClean += date.getHours().toString() + ":"; // rajoute l'heure HH

    if (date.getMinutes().toString().length <= 1) timeClean += "0";
    timeClean += date.getMinutes().toString() + " Heures"; // rajoute les minutes MM

    return timeClean;
}