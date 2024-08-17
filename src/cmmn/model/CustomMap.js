export class CustomMap {
    constructor(map = {}) {
        this.map = {};
        for (let [key, value] of Object.entries(map)) {
            this.set(key, value);
        }
    }

    delete(key) {
        delete this.map[key];
    }
    remove(key) {
        this.delete(key);
    }
    set(key, value) {
        if (key.includes("_")) {
            key = this._convertUnderscoreToCamelCase(key);
        }
        this.map[key] = value;
    }
    put(key, value) {
        this.set(key, value);
    }

    get(key) {
        return this.map[key];
    }

    getString(key, defaultValue = "") {
        if (!key) {
            throw new Error("CustomMap.getString ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            return defaultValue;
        } else if (typeof value === "string") {
            return value;
        } else if (typeof value === "number") {
            return value.toString();
        } else if (Array.isArray(value)) {
            if (value.length === 0) {
                return "Empty List";
            } else {
                return `List<${typeof value[0]}> [${value.length}]`;
            }
        } else {
            return value.toString();
        }
    }

    getInt(key, defaultValue = 0) {
        if (!key) {
            throw new Error("CustomMap.getInt ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            return defaultValue;
        } else if (typeof value === "string") {
            return parseInt(value);
        } else if (typeof value === "number") {
            return parseInt(value);
        } else {
            throw new Error(
                `CustomMap.getInt ::: value is not a valid number [${value}]`
            );
        }
    }

    getLong(key, defaultValue = 0) {
        return this.getInt(key, defaultValue);
    }

    getFloat(key, defaultValue = 0.0) {
        if (!key) {
            throw new Error("CustomMap.getFloat ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            return defaultValue;
        } else if (typeof value === "string") {
            return parseFloat(value);
        } else if (typeof value === "number") {
            return value;
        } else {
            throw new Error(
                `CustomMap.getFloat ::: value is not a valid number [${value}]`
            );
        }
    }

    getDouble(key, defaultValue = 0.0) {
        return this.getFloat(key, defaultValue);
    }

    getBoolean(key, defaultValue = false) {
        if (!key) {
            throw new Error("CustomMap.getBoolean ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            return defaultValue;
        } else if (typeof value === "string") {
            return value.toLowerCase() === "true";
        } else if (typeof value === "boolean") {
            return value;
        } else {
            throw new Error(
                `CustomMap.getBoolean ::: value is not a valid boolean [${value}]`
            );
        }
    }

    getCustomMap(key) {
        if (!key) {
            throw new Error("CustomMap.getCustomMap ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            return null;
        }

        if (!(value instanceof Object)) {
            throw new Error(
                "CustomMap.getCustomMap ::: value is not an Object"
            );
        }

        return new CustomMap(value);
    }

    getCustomMapList(key) {
        if (!key) {
            throw new Error("CustomMap.getCustomMapList ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            throw new Error("CustomMap.getCustomMapList ::: value is null");
        }

        if (!Array.isArray(value)) {
            throw new Error(
                "CustomMap.getCustomMapList ::: value is not a list"
            );
        }

        return value.map((item) => {
            if (item instanceof CustomMap) {
                return item;
            } else if (item instanceof Object) {
                return new CustomMap(item);
            } else {
                throw new Error(
                    "CustomMap.getCustomMapList ::: item of list is not map"
                );
            }
        });
    }

    getObject(key) {
        if (!key) {
            throw new Error("CustomMap.getObject ::: key is null");
        }
        return this.get(key);
    }

    getObjectList(key) {
        if (!key) {
            throw new Error("CustomMap.getObjectList ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            throw new Error("CustomMap.getObjectList ::: value is null");
        }

        if (!Array.isArray(value)) {
            throw new Error("CustomMap.getObjectList ::: value is not list");
        }

        return value;
    }

    getList(key) {
        if (!key) {
            throw new Error("CustomMap.getList ::: key is null");
        }

        const value = this.get(key);

        if (!value) {
            throw new Error("CustomMap.getList ::: value is null");
        }

        if (!Array.isArray(value)) {
            throw new Error("CustomMap.getList ::: value is not list");
        }

        return value.map((item) => {
            if (item === null) {
                return "";
            } else if (typeof item === "string") {
                return item;
            } else if (typeof item === "number") {
                return item.toString();
            } else {
                return item.toString();
            }
        });
    }

    toHashMap() {
        const hashMap = {};
        for (let [key, value] of Object.entries(this.map)) {
            if (value instanceof CustomMap) {
                hashMap[key] = value.toHashMap();
            } else if (Array.isArray(value)) {
                hashMap[key] = value.map((item) => {
                    if (item instanceof CustomMap) {
                        return item.toHashMap();
                    } else if (Array.isArray(item)) {
                        return this._convertListToHashMap(item);
                    } else {
                        return item;
                    }
                });
            } else {
                hashMap[key] = value;
            }
        }
        return hashMap;
    }

    toString() {
        const keys = Object.keys(this.map);
        const maxKeyLength = Math.max(...keys.map((key) => key.length));
        const maxValueLength = Math.max(
            ...keys.map((key) => this.getString(key).length)
        );
        const width = Math.max(80, (maxKeyLength + maxValueLength) * 2);

        let sb = "";
        sb += `\n${this._repeatString("-", width)}\n`;
        sb += `${this._centerString("[CustomMap]", width)}\n\n`;
        sb += `${this._centerString("key", width / 2)}${this._centerString(
            "value",
            width / 2
        )}\n`;
        sb += `${this._repeatString("-", width)}\n\n`;

        for (let key of keys) {
            sb += `${this._centerString(
                this._padRight(key, maxKeyLength + 1),
                width / 2
            )}${this._centerString(
                this._padRight(this.getString(key), maxValueLength + 1),
                width / 2
            )}\n`;
        }

        sb += `\n${this._repeatString("-", width)}\n`;
        return sb;
    }

    _convertUnderscoreToCamelCase(str) {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    _convertListToHashMap(list) {
        return list.map((item) => {
            if (item instanceof CustomMap) {
                return item.toHashMap();
            } else if (Array.isArray(item)) {
                return this._convertListToHashMap(item);
            } else {
                return item;
            }
        });
    }

    _padRight(str, length) {
        return str.padEnd(length);
    }

    _repeatString(str, count) {
        return str.repeat(count);
    }

    _centerString(str, width) {
        if (str.length >= width) {
            return str;
        } else {
            const leftPadding = Math.floor((width - str.length) / 2);
            const rightPadding = width - str.length - leftPadding;
            return " ".repeat(leftPadding) + str + " ".repeat(rightPadding);
        }
    }
}
