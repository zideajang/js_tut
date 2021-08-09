// requestIdleCallback(myNonEssentialWork);

// const tasks = [
//     ()=>{
//         console.log("task one");
//     },
//     ()=>{
//         console.log("task two");
//     },
//     ()=>{
//         console.log("task three");
//     }
// ]

// function myNonEssentialWork (deadline) {
//     while (deadline.timeRemaining() > 0 && tasks.length > 0)
//         doWorkIfNeeded();

//     if (tasks.length > 0)
//         requestIdleCallback(myNonEssentialWork);
// }

// function doWorkIfNeeded(){
//     tasks.shift()()
// }

var isRequestIdleCallbackScheduled  = false;

var eventsToSend = [];

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

    isRequestIdleCallbackScheduled = false;
  
    //如果没有 deadline 对象，就手动创建一个并且返回剩余时间足够多
    if (typeof deadline === 'undefined')
      deadline = { timeRemaining: function () { return Number.MAX_VALUE } };
  
    // Go for as long as there is time remaining and work to do.
    
    while (deadline.timeRemaining() > 0 && eventsToSend.length > 0) {
      var evt = eventsToSend.pop();
        
      doSomeTask(evt.task);
    }
  
    // Check if there are more events still to send.
    //查看是否还有存在没有执行任务，如果存在就是继续交给 schedulePendingEvents 处理
    if (eventsToSend.length > 0)
      schedulePendingEvents();
  }