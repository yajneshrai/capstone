export const unescapeHTML = (str) => {
    let textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
}

export const shuffleArray = (array = []) => {
    for (let idx = 0; idx < array.length; idx++) {
        let temp = Math.floor(Math.random() * (array.length));
        [ array[temp], array[idx] ] = [ array[idx], array[temp] ];
    }
    return array;
}

export const getCurrentDate = () => {
    let today = new Date();
    return today.toISOString().split('T')[0];
}