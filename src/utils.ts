export function countOccurrence(text = "") {
    const array_from_text = text.split("");
    const result = new Map<string, number>();
    Array.from(new Set(array_from_text)).forEach(word => {
        const { length } = array_from_text.filter(w => w === word);
        result.set(word, length)
    });
    
    return result;
};

export function toKeyMapWithValue <T, G, H> (arr: T[], key: keyof T, value: keyof T) {
    const out = new Map<G, H>();
    arr.forEach(element => {
        out.set(element[key] as G, element[value] as H);
    });
    return out;
}