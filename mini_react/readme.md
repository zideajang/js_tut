## requestIdleCallback 让你的代码避开高峰

在之前已经介绍过为什么当运行耗时 javascript 代码时，浏览器会发生卡顿现象。主要原因就是 javascript 是单线程，在主线程不但需要运行 javascript 代码还需要做许多其他任务，例如监听用户操作和渲染页面等任务。例如在用户滚动列表页面时，就发送请求远端的服务器来获取数据，用户在搜索文本框输入要查询文本时因为 javascript 代码执行，用户行为没有即时响应，就会造成用户体验不佳。



> 代码和分享参考了官方文档，不过当然融入自己对这个 API 功能和使用理解



随着越来越多复杂逻辑放置前端，所以这样问题总是靠 web 开发者经验通过小技巧来解决，可能显得力不从心。为了能够重 API 层面来解决这些问题，就有了 requestIdleCallback。就像采用 requestAnimationFrame 让我们能够容易地实现播放流程平稳的动画。requestIdleCallback 这个 API 方便我们使用每一帧的空闲时间。这样就会让 javascript 在空闲时间去执行任务，从而不会妨碍哪些优先级比较高的任务，例如用户交互。这个 API 从 Chrome 47 开始提供，不过这个 API 还是实验性的功能，规格仍在变化中，所以将来可能会有变化。而且只有部分浏览器支持，我们还需要 polyfill 来让更多运行在其他浏览器下 javascript 开发者享受这份福利。



这个 API 我第一接触到还是在了解 React 的 fiber 实现时，接触到这个 requestIdleCallback。fiber 将耗时的任务切分为一个一个小任务然后，然后这些小任务就会浏览器空闲时间去执行这些任务。



### 为什么要使用 requestIdleCallback？

能够自己有计划执行非必要的任务是比较难做到的。因为在 requestAnimationFrame 回调执行后，还有样式计算、布局、屏幕绘制和其他需要运行的浏览器的主线程上，所以无法准确计算出在该帧内还剩余多少时间。那么可能我们会想这样做，我们为用户交互每个方式，例如滚动页面、触控或者点击等事件都去附件以一个监听器，这个监听器只是为了用于判断用户是否于界面进行交互而已。除此之外我们需要考虑如何获取剩余时间，听起来就让人挠头。不过今天这一切都不在是问题，只用一个API requestIdleCallback，就能够以最有效的方式利用任何空闲时间，接下来我们就来具体看一看如何使用 requestIdleCallback



```javascript
if ('requestIdleCallback' in window) {
    // 使用 requestIdleCallback 去执行任务
    
  } else {
    // 自己实现 requestIdleCallback 功能
  }
```

如果浏览器中并不支持该 API 就可以借助 setTimeout 实现这个 API

```javascript
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  }

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
}

function aTask(deadline){
    console.log("a task")
}

window.requestIdleCallback(aTask)
```

其实使用 setTimeout 并不是很好解决方案，因为 setTime 不像 requestIdleCallback 那样知道还有多少空闲时间，但如果浏览器还不支持 requestIdleCallback 这个 API，直接调用函数，所以用这种方式进行暂时将任务交个 setTime 来异步执行你任务从而暂时抹平一些不同浏览器对这个 API 支持的差异。



### 使用 requestIdleCallback

接下来我们来介绍如何使用 requestIdleCallback 这个 API，所以默认情况下，你的浏览器是对 requestIdleCallback 是支持的。调用 requestIdleCallback 与 requestAnimationFrame 非常相似，第一个参数为一个回调函数，我们要在空闲时间执行代码就写在这里。

```javascript
requestIdleCallback(myNonEssentialWork);
```



当调用` myNonEssentialWork `调用，在回调函数会接受一个对象，这个对象中一个方法 timeRemaining 会返回在该帧还有多少时间。

```javascript
function myNonEssentialWork (deadline) {
  while (deadline.timeRemaining() > 0)
    doWorkIfNeeded();
}
```



```javascript
requestIdleCallback(myNonEssentialWork);

function myNonEssentialWork (deadline) {
    while (deadline.timeRemaining() > 0)
      doWorkIfNeeded();
}

function doWorkIfNeeded(){
    console.log("do work if needed...")
}
```



可以调用 timeRemaining 函数每次都会返回一个剩余时间。当 timeRemaining() 返回 0 时，如果你还有更多的任务要做，可以通过另一个requestIdleCallback 来执行任务。

```javascript
requestIdleCallback(myNonEssentialWork);



const tasks = [
    ()=>{
        console.log("task one");
    },
    ()=>{
        console.log("task two");
    },
    ()=>{
        console.log("task three");
    }
]

function myNonEssentialWork (deadline) {
    while (deadline.timeRemaining() > 0 && tasks.length > 0)
        doWorkIfNeeded();

    if (tasks.length > 0)
        requestIdleCallback(myNonEssentialWork);
}

function doWorkIfNeeded(){
    tasks.shift()()
}
```



### 如何确保回调函数被执行

想一想如果浏览器的主线程一直处于繁忙的状态，没有任何空闲时间，那么回调函数可能一直不会被执行。尽管 requestIdleCallback 与 requestAnimationFrame 相似，他们也有不同之处，就在于 requestIdleCallback 处理接受一个回调函数作为第一个参数，还提供了一个可选的第二个参数，让用户设定超时执行时间(单位是毫秒)。如果设置了这个超时时间，当超过这个时间时，浏览器就不会考虑是否存在空闲时间，而主动去执行回调。



```javascript
// 等待 2 秒后就会主动执行 processPendingAnalyticsEvents
requestIdleCallback(processPendingAnalyticsEvents, { timeout: 2000 });
```



一旦回调函数因为触发超时而而被执行，会注意到两件事:

- timeRemaining() 将返回 0 
- 最后期限对象的 didTimeout 属性将为 True。当 didTimeout 为 True，表示已经超时，这是也可以运行想要运行的任务

```js
function myNonEssentialWork (deadline) {

 // 条件当有剩余时间或者已经超时， deadline.didTimeout 通过这个值来判断是否超时，如果超时即便没有剩余时间也会执行这个任务
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) &&
         tasks.length > 0)
    doWorkIfNeeded();

  if (tasks.length > 0)
    requestIdleCallback(myNonEssentialWork);
}
```



因为设置了超时时间，当超过这个时间时，就会主动执行该回调函数，这样就会又回到上面问题，可能会影响用户体验，所以在设置这个参数时要多想一想。如果可以的话，还是浏览器决定何时调用回调。





### 使用 requestIdleCallback 来发送数据到服务端



这里服务端用 flask 起了一个简单服务，没有什么具体含义仅为说明代码如下，

```python
from flask import Flask
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

import time

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

tasks = {
    "one":"task one",
    "two":"task two",
    "three":"task three",
}

class TodoSimple(Resource):
    def get(self, task):
        time.sleep(1)
        return {task: tasks[task]}

   

api.add_resource(TodoSimple, '/<string:task>')


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
```



接下来通过一个例子来让我们来看看如何使用 requestIdleCallback 来发送分析数据。在这种情况下，我们可能想跟踪一个事件，比如说--点击一个导航菜单。然而，由于它们通常是以动画形式出现在屏幕上，我们将希望避免立即将该事件发送到Google Analytics。我们将创建一个要发送的事件数组，并要求它们在未来的某个时间点被发送。

```js

var isRequestIdleCallbackScheduled  = false;

var eventsToSend = [];

//用于模拟触发一个请求事件，然后将事件发送到 eventsToSend 数组
function triggerCollectIamge (name) {
  eventsToSend.push(
    {
      task:name
    });

  schedulePendingEvents();
}

triggerCollectIamge("one");
triggerCollectIamge("one");
triggerCollectIamge("two");
triggerCollectIamge("one");
triggerCollectIamge("one");
triggerCollectIamge("three");
triggerCollectIamge("two");
triggerCollectIamge("two");

//进行以网络耗时工作
function doSomeTask(name){
    fetch("http://10.1.0.67:5000/"+name)
    .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
      });
}

function schedulePendingEvents() {

    
    if (isRequestIdleCallbackScheduled)
      return;
  
    isRequestIdleCallbackScheduled = true;
  
    if ('requestIdleCallback' in window) {
      // 设置超时事件为 2 秒
      requestIdleCallback(processPendingAnalyticsEvents, { timeout: 2000 });
    } else {
      processPendingAnalyticsEvents();
    }
  }

  function processPendingAnalyticsEvents (deadline) {

   
    // 重置该参数
    isRequestIdleCallbackScheduled = false;
  
  
    // 如果没有 deadline 对象，就手动创建一个并且返回剩余时间足够多
    if (typeof deadline === 'undefined')
      deadline = { timeRemaining: function () { return Number.MAX_VALUE } };
  
    
    // 只要有空闲时间并且还有未执行任务就去执行
    while (deadline.timeRemaining() > 0 && eventsToSend.length > 0) {
      var evt = eventsToSend.pop();
      doSomeTask(evt.task);
    }
  
    //查看是否还有存在没有执行任务，如果存在就是继续交给 schedulePendingEvents 处理
    if (eventsToSend.length > 0)
      schedulePendingEvents();
  }
```



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <button onclick="console.log('clicking one btn')">click</button>
    <!-- <script src="index.js"></script> -->
    <script src="requestIdelCB_demo.js"></script>
</body>
</html>
```



### 使用 requestIdleCallback 更新 DOM 存在的问题以及解决方案

接下来聊一聊 requestIdleCallback 能够真正帮助提高性能的另一种场景，当更新 DOM 优先级不是很高情况，例如将条目添加到一个不断增长的、懒于加载的列表的尾部时。这时 requestIdleCallback 。



浏览器可能会因为太忙而无法在某一帧中运行任何回调，所以不应该对一帧结束时都有足够的空闲时间来做任何更多的其他的任务抱有期望。这一点与 setImmediate 有所不同不同，setImmediate 是按帧运行的。





因为回调中的任务是在每帧结束时才被执行，这意味着样式变化将，布局计算等操作已经完成。如果这时在空闲回调中对 DOM 进行了修改，这些布局计算也就是无效了。在下一帧中，某种形式的来获取布局，例如 getBoundingClientRect、clientWidth 等，浏览器将不得不执行强制同步布局，这是一个潜在的性能瓶颈。



不在空闲回调中对 DOM 进行任何操作的另一个原因，是操作 DOM 的时间影响是不可预测的，很容易超过浏览器提供的 deadline。



好的方案是只在 requestAnimationFrame 回调中进行对 DOM 更新，因为浏览器分配的时候就考虑到了这种类型的任务。这意味着我们的代码将需要使用一个文档片段( document fragment)，然后可以在下一个 requestAnimationFrame 回调中追加。对于使用的是VDOM 库，会使用 requestIdleCallback 来进行更新 VDOM，而会在下一个 requestAnimationFrame 回调中，将更新对应的 DOM ，而不是在idle 回调来操作 VDOM。



### 同步模式(Concurrent Mode)

一旦我们开始渲染，就不会停止，直到将整个 DOM 渲染完成。如果 DOM 元素树很大，因为 js 引擎和 DOM 引擎都运行在主线程上，可能会阻塞主线程太长时间。这样就会影响到浏览器去处理一些高优先级的事情，比如处理用户输入或保持动画的流畅性，将不得不都等到渲染结束。

可以要把工作分成几个小任务单元，在完成每个任务单元后，还有什么需要做的，会让浏览器中断渲染。

使用 requestIdleCallback 来做一个循环。暂时简单地把 requestIdleCallback 看作是 setTimeout，不同的是我们不需要告诉requestIdleCallback何时运行，浏览器在主线程空闲时会自动运行 requestIdleCallback 回调。

现在 React 不再使用 requestIdleCallback了。现在使用调度器包，但对于这个用例来说，仅是为了说明一些概念，所以为了简化就暂时还采用 requestIdleCallback。

requestIdleCallback 为回调函数提供了一个 deadline 参数。可以用 deadline 这个参数来检查在浏览器剩余空闲时间还有多少。

截至 2019 年 11 月，并发模式在 React 中还不稳定。稳定版本的循环看起来更像这样。

要开始使用这个循环，我们需要设置第一个工作单位，然后写一个 performUnitOfWork 函数，不仅要执行工作，还要返回下一个工作单位。

### fiber

为了组织工作单位，我们将需要一个数据结构：fiber tree。

我们将为每个元素设置一个纤维，每个纤维将是一个工作单位。

让我用一个告诉你


```js
function workLoop(deadline){
    //
    let shouldYield = false
    // 循环条件是还有要执行的任务并且空闲时间不为 0 
    while( nextUnitOfWork && !shouldYield){
        // 执行任务单元后，并返回一个任务单元
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        // 如果没有剩余时间则将 shouldYield = true 就将推出循环
        shouldYield = deadline.timeRemaining() < 1
    }
    // 
    requestIdleCallback(workLoop)

    
}
```
```js
requestIdleCallback(workLoop)
function performUnitOfWork(nextUnitOfWork){
        //TODO
}
```

```js
function createDom(fiber){
    const dom = element.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);

    const isProperty = key => key != "children"
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        })
}

function render(element, container){
    //TODO set next unit of work
}
```

```js
function render(element, container){
    //TODO set next unit of work
    nextUnitOfWork = {
        dom:container,
        props:{
            children: [element]
        },
    }
}
```