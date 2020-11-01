import { forEachValue } from "../util";
import Module from "./module";


// 把module里面所有的module 全部放在一个完整的树上
export default class ModuleCollection {
    constructor(options) {
        this.register([], options); // stack 栈储存父子关系 深度优先查找
    }
    getNamespaced(path) {
        let root = this.root // 从根模块找起来

        return path.reduce((str, key)=>{
            root = root.getChild(key) // 不停的去找当前的模块
            return str + (root.nameespaced? key + '/': '')
        },'')

    }
    register(path, rootModule) {
        let newModule = new Module(rootModule)

        if (path.length === 0){
            // 根模块
            this.root = newModule 
        } else {
            // 第一个子模块不参与 [a]/[]   [a,c]/[a]   [a,c,d]/[a,c] 
            let parent = path.slice(0, -1).reduce((memo,current)=>{
                return memo.getChild(current) // 改变了this.root 返回给parent 到[a,c]时 = this.root._childern[a]
            },this.root)
            // 子模块
            parent.addChild(path[path.length-1], newModule)
        }

        if (rootModule.modules) {
            // 循环模块
            forEachValue(rootModule.modules,(module,moduleName)=>{
                this.register(path.concat(moduleName), module) 
            }) 
        }
    }

}










/**
 * this.root = {
 *  _raw: '根模块',
 *  _children: {
 *      a: {
 *          _raw: "a模块",
 *          _children: {
 *              c: {
 *                  _raw: "c模块",
 *                  _children: {},
 *                  state: 'c得状态'
 *              }
 *          },
 *          state: 'a得状态'
 *      },
 *      b: {
 *          _raw: "b模块",
 *          _children: {},
 *          state: 'b得状态'
 *      },
 *  }
 * }
 * 
 */