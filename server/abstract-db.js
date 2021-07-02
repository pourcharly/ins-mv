const db = require('./db.json');
const fs = require('fs');

const abstractDB = {
    getConfig: () => {
        return db.get('config').value();
    },
    findUser: (searchObj) => {
        return db
            .get('users')
            .find(searchObj)
            .value();
    }
};

function newDbValue(value, onChange) {
    return value instanceof Array ?
        new DBCollection(value, onChange) : (
            typeof value === 'object' && value !== null ?
                new DBObject(value, onChange) : value
        );
}

function DbMatcher(searchObj) {
    this._search = searchObj;
    this._keys = Object.keys(searchObj);
}
DbMatcher.prototype.test = function (item) {
    return this._keys.every(key => {
        return this._search[key] === item[key];
    });
};

const DBObject = function (object, onChange) {
    this._object = object;
    this._onChange = onChange || function () {};
};
DBObject.prototype.get = function (key) {
    const value = this._object[key];
    const onChange = () => {
        this._object[key] = dbValue.value();
    };
    const dbValue = newDbValue(value, onChange);

    return dbValue;
};
DBObject.prototype.write = function () {
    root.save();

    return this;
};
DBObject.prototype.value = function () {
    return this._object;
};

const DBCollection = function (collection, onChange) {
    this._collection = collection;
    this._onChange = onChange || function () {};
};
DBCollection.prototype.find = function (searchObj) {
    const matcher = new DbMatcher(searchObj);
    const value = this._collection.find(item => matcher.test(item));
    const onChange = () => {
        const index = this._collection.findIndex(item => item === value);

        if (index >= 0) {
            this._collection[index] = dbValue.value();
        }
    };
    const dbValue = newDbValue(value, onChange);

    return dbValue;
};
DBCollection.prototype.push = function (newItem) {
    this._collection.push(newItem);
    return this;
};
DBCollection.prototype.remove = function (searchObj) {
    const matcher = new DbMatcher(searchObj);

    this._collection = this._collection.filter(item => matcher.test(item));
    this._onChange();

    return this;
};
DBCollection.prototype.write = function () {
    root.save();

    return this;
};
DBCollection.prototype.value = function () {
    return this._collection;
};

const root = new DBObject(db);

root.save = function () {
    fs.writeFile('./db.json', JSON.stringify(this.value(), null, 4));
};

module.exports = root;