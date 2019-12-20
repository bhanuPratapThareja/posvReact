export const isDateYearValid = dateYear => {
    const month = dateYear.substr(0,2);
    const year = dateYear.substr(3);
    if(year.indexOf('_') !== -1){
        return {
            error: 'Invalid date'
        }
    }
    if(dateYear.length < 7){
        return {
            error: 'Invalid date'
        }
    }
    if(month === '00'){
        return {
            error: 'Month cannot be 00'
        }
    }
    if(month > '12'){
        return {
            error: 'Month cannot be greater than 12'
        }
    }
    const d = new Date;
    if(year < 1900){
        return {
            error: 'Year cannot be less than 1900'
        }
    }
    if(year > d.getFullYear()){
        return {
            error: 'Year cannot be greater than current year'
        }
    }
    if(year == d.getFullYear() && month > d.getMonth() + 1){
        return {
            error: 'Month cannot be greater than current month'
        }
    }
    return {
        error: ''
    };
}