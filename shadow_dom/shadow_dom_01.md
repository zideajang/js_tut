#### Composition 和 Slot



组合是 shadow DOM 中最不为人知的特征之一，不过也是 shadow DOM 最重要的特征。

在我们的 web 开发领域中，组合是如何从 HTML 中声明式地构建 web 应用程序。不同的构件`（<div>s、<header>s、<form>s、<input>s）`组合在一起，形成应用程序。这些标签中的一些甚至可以相互配合来实现一个具有一定功能的组件。例如 `<select>、<details>、<form>`和`<video>`

- 对于`<select>`，知道如何处理其包裹的子元素，`<option>` 和 `<optgroup>` ，这些元素渲染后下拉菜单等

- `<details>`元素将`<summary>`渲染出来在 summary 文本右侧带有可控制展开或收起 `<details>`的标签内容小控件
- `<video>`也知道如何处理其 child 结点。`<source>`元素不会被渲染，视频的行为



新名词：Light DOM 与 shadow DOM

当下 Web 开发中基于一些新的原理引入了一些新的概念，如 Shadow DOM 。在深入研究之前，首先我们需要对一些术语进行标准化，只有很好理解了这些新的概念我们才能更好理解后面的内容。



#### Light DOM

你的组件的用户所定义的标签。Light DOM 位于(存在)于组件的 shadow DOM 之外的 DOM 元素。是该自定义的 DOM 的实际子元素。

```html
<better-button>
  <!-- 这里 image 和 span 是 better-button 组件 Light DOM -->
  <img src="gear.svg" slot="icon">
  <span>Settings</span>
</better-button>
```



#### Shadow DOM

shadow DOM 是组件的内部，定义了组件的内部结构、作用域内的 CSS，并封装了具体实现的细节。还可以定义如何渲染由你的组件的使用者所编写的标记。

```html
#shadow-root
  <style>...</style>
  <slot name="icon"></slot>
  <span id="wrapper">
    <slot>Button</slot>
  </span>
```

#### Flatten DOM Tree

浏览器将用户的 Light DOM 分配到你的 Shadow DOM中，渲染出最终的效果。扁平化的树是你最终在 DevTools 中看到的，也是页面上渲染的内容。

The result of the browser distributing the user's light DOM into your shadow DOM, rendering the final product. The flattened tree is what you ultimately see in the DevTools and what's rendered on the page.

```html
<better-button>
  #shadow-root
    <style>...</style>
    <slot name="icon">
      <img src="gear.svg" slot="icon">
    </slot>
    <span id="wrapper">
      <slot>
        <span>Settings</span>
      </slot>
    </span>
</better-button>
```



####  <slot> 元素

Shadow DOM composes different DOM trees together using the `<slot>` element. **Slots are placeholders inside your component that users \*can\* fill with their own markup**. By defining one or more slots, you invite outside markup to render in your component's shadow DOM. Essentially, you're saying *"Render the user's markup over here"*.

slot 概念我还是在 vue 听说的，shadow DOM 使用 `<slot>`元素将不同的 DOM 树组合在一起。Slot 是组件中的占位符，开发人员可以用他们定义的标记来填充。通过定义一个或多个 slot，可以将外部标记添加定义好组件的 shadow DOM 中上呈现。

Elements are allowed to "cross" the shadow DOM boundary when a <slot> invites them in. These elements are called distributed nodes. Conceptually, distributed nodes can seem a bit bizarre. Slots don't physically move DOM; they render it at another location inside the shadow DOM.

A component can define zero or more slots in its shadow DOM. Slots can be empty or provide fallback content. If the user doesn't provide light DOM content, the slot renders its fallback content.

当`<slot>`邀请元素进入时，元素被允许 "穿越 " shadow DOM 边界。这些元素被称为分布式节点(distributed nodes)。从概念上讲，分布式节点似乎有点奇怪。slot 在物理上并不移动 DOM, 它们在shadow DOM 内的另一个位置渲染它。

一个组件可以在其 shadow DOM 中，定义0  或 多个slot。slot 可以是空的，也可以提供回退内容。如果用户没有提供 Light DOM内容，slot 就会渲染的回退内容。



#### 虚拟DOM 和 shadow DOM