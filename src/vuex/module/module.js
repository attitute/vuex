import { forEachValue } from "../util"

export default class Module {
    constructor(newModule) {
        this._raw = newModule
        this._children = {}
        this.state = newModule.state
    }
    get nameespaced() {
        return !!this._raw.namespaced
    }

    getChild(key) {
        return this._children[key]
    }

    addChild(key, module) {
        this._children[key] = module
    }

    forEachMutation (fn) {
        if (this._raw.mutations) {
            forEachValue(this._raw.mutations,fn)
        }
    }
    forEachAction (fn) {
        if (this._raw.actions) {
            forEachValue(this._raw.actions,fn)
        }
    }
    forEachGetter (fn) {
        if (this._raw.getters) {
            forEachValue(this._raw.getters,fn)
        }
    }
    forEachChild (fn) {
        console.log(this._children)
        forEachValue(this._children, fn)
    }

}
