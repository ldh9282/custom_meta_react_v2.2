export class StringUtils {
    static camel2Snake(str) {
        str = str.charAt(0).toLowerCase() + str.substr(1, str.length);
        return str
            .replace(/([A-Z])/g, (word) => "_" + word.toLowerCase())
            .toUpperCase();
    }
    static snake2Camel(str) {
        str = str.toLowerCase();
        return str.replace(/_./g, (word) => word.charAt(1).toUpperCase());
    }
    static chanegeCase(str) {
        if (str === str.toLowerCase()) {
            return str.toUpperCase();
        } else if (str === str.toUpperCase()) {
            return str.toLowerCase();
        } else {
            return str;
        }
    }
}
