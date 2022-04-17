export const passwordValidator = (passwd) => {
    if(!passwd) return false;
    return (passwd.length >= 8);
}

export const textValidator = (text, params) => {
    if(!text) return false;
    if(!params) return true;
    if(params.length_min) return (text.length >= params.length_min);
    if(params.length_max) return (text.length <= params.length_max);
}