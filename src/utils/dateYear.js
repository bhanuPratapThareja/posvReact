export const isDateYearValid = dateYear => {
    const month = dateYear.substr(0,2);
    const year = dateYear.substr(3);
    let error = '';
    if(year.indexOf('_') !== -1){
        error ='Invalid date';
    }
    if(month === '00'){
        error = 'Month cannot be 00'
    
    }
    if(month > '12'){
        error = 'Month cannot be greater than 12'
    
    }
    const d = new Date;
    if(year < 1900){
        error = 'Year cannot be less than 1900'
    
    }
    if(year > d.getFullYear()){
        error = 'Year cannot be greater than current year'
    
    }
    if(year == d.getFullYear() && month > d.getMonth() + 1){
        error = 'Month cannot be greater than current month'
    
    }
    return { error };
}