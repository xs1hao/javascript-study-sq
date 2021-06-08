const compileUtil = {
	getVaule(expr, vm) {
		// 处理 v-text="person.name" 这种情况；
		return expr.split('.').reduce((data, currentValue) => {
			return data[currentValue]
		}, vm.$data)
	},
    getContent(expr, vm) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getVaule(args[1], vm);
        })
    },
	/**
	 * expr: msg
	 * **/
	text(node, expr, vm) {
		let value;
		if (expr.indexOf('{{') !== -1) {
			value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                new watcher(vm,args[1], (newVal) => {
                    this.updater.textUpdater(node, this.getContent(expr,vm));
                })
				return this.getVaule(args[1], vm);
			})
		} else {
            new watcher(vm,expr,(newVal) => {
                this.updater.textUpdater(node, newVal);
            })
            value = this.getVaule(expr, vm);
        }
		this.updater.textUpdater(node, value);
	},
	html(node, expr, vm) {
		const value = this.getVaule(expr, vm);
        new watcher(vm,expr,(newVal) => {
            this.updater.htmlUpdater(node, newVal);
        })
		this.updater.htmlUpdater(node, value);
	},
	model(node, expr, vm) {
		const value = this.getVaule(expr, vm);
        new watcher(vm,expr,(newVal) => {
            this.updater.modelUpdater(node, newVal);
        })
		this.updater.modelUpdater(node, value);
	},
	on(node, expr, vm, eventName) {
        let fn = vm.$options.methods && vm.$options.methods[expr];
        node.addEventListener(eventName,fn.bind(vm),false);
    },
    bind(node, expr, vm, attrName) {

    },
	// 更新的函数
	updater: {
		modelUpdater(node, value) {
			node.value = value;
		},
		htmlUpdater(node, value) {
			node.innerHtml = value;
		},
		textUpdater(node, value) {
			node.textContent = value;
		},
	},
}

class Compile {
	constructor(el, vm) {
		this.el = this.isElementNode(el) ? el : document.querySelector(el)
		this.vm = vm
		// 1. 拿到子节点，替换数据，会存在多次的回流和重绘，避免不必要的性能消耗；
		// 获取文档碎片对象，放入内存中，减少页面的回流和重绘；
		const fragment = this.node2Fragment(this.el)

		// 2. 编译模板
		this.compile(fragment)

		// 3.追加子元素到根元素；
		this.el.appendChild(fragment)
	}

	compile(fragment) {
		// 1. 获取子节点
		const childNodes = fragment.childNodes;
		[...childNodes].forEach((child) => {
			if (this.isElementNode(child)) {
				// 元素节点
				this.compileElement(child)
			} else {
				// 文本节点 （同样也需要编译文本节点）
				this.compileText(child)
			}
			// 递归处理子节点；
			if (child.childNodes && child.childNodes.length > 0) {
				this.compile(child)
			}
		})
	}

	/**
	 * 编译元素节点
	 * **/
	compileElement(node) {
		const attributes = node.attributes; // 拿到每一个节点上的 attribute
		[...attributes].forEach((attr) => {
			const { name, value } = attr // v-text="msg"
			if (this.isDirective(name)) {
				// 是不是一个指令 v-text v-model v-on:click
				const directive = name.split('-')[1]
				const [dirName, eventName] = directive.split(':') // dirName: text html model
				// 数据驱动视图；
				compileUtil[dirName](node, value, this.vm, eventName)
				// 删除有指令的标签上的属性；
				node.removeAttribute('v-' + directive)
			} else if (this.isEventName(name)) { // @click="handle"
                let [,eventName] = name.split('@');
                compileUtil['on'](node, value, this.vm, eventName)
            }
		})
	}

	/**
	 * 编译文本节点 即编译 {{}}
	 * **/
	compileText(node) {
        const content = node.textContent;
        if (/\{\{(.+?)\}\}/.test(content)) {
            compileUtil['text'](node,content,this.vm);
        }
    }

	/**
	 * @params el 根元素；
	 *
	 * **/
	node2Fragment(el) {
		// 创建文档碎片
		const f = document.createDocumentFragment();
		// let firstChild = el.firstChild
		// while (firstChild) {
		// 	f.appendChild(firstChild);
		// 	firstChild = firstChild.nextSibling
		// }
        let firstChild;
        while(firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
		return f;
	}

	isElementNode(node) {
		return node.nodeType === 1
	}

	// 是不是一个指令
	isDirective(attrName) {
		return attrName.startsWith('v-')
	}

    isEventName(attrName) {
        return attrName.startsWith('@')
    }
}

class MVue {
	constructor(options) {
		this.$el = options.el
		this.$data = options.data
		this.$options = options

		if (this.$el) {
			// 1.实现一个数据观察者
            new Observer(this.$data);
			// 2.实现一个指令解析器
			new Compile(this.$el, this)
		}
	}
}
