#include <node.h>
#include <string>

#include <uv.h>

#include "main.h"
#include "Fibonacci.h"

using namespace v8;

struct WorkRequest {
    UniquePersistent<Function> callback;
    bool error;
    std::string error_message;

    int arg;
    int result;
};

// This function cannot have any v8 code.
void fib(uv_work_t* req)
{
    WorkRequest* workRequest = static_cast<WorkRequest*>(req->data);
    auto inputVal = workRequest->arg;

    workRequest->error = false;

    Fibonacci fibonacci;

    workRequest->result = fibonacci.GetNthNumber(inputVal);
}

void after_fib(uv_work_t *req, int status)
{
    WorkRequest* workRequest = static_cast<WorkRequest*>(req->data);

    auto callback = Local<Function>::New(v8::Isolate::GetCurrent(), workRequest->callback);

    Local<Value>* argv = new Local<Value>[1];
    argv[0] = Local<Value>::New(v8::Isolate::GetCurrent(), v8::Int32::New(v8::Isolate::GetCurrent(), workRequest->result));

    callback->Call(Null(v8::Isolate::GetCurrent()), 1, argv);

    delete workRequest;
    delete req;
}

void GetNthFibonacciNumber(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    
    auto cb = Local<Function>::Cast(args[1]);
    
    WorkRequest* workRequest = new WorkRequest();
    workRequest->arg = args[0]->ToInt32()->Int32Value();
    workRequest->error = false;
    workRequest->callback.Reset(isolate, UniquePersistent<Function>(isolate, cb));

    uv_work_t* req = new uv_work_t();
    req->data = workRequest;

    int status = uv_queue_work(uv_default_loop(), req, fib, after_fib);

    assert(status == 0);
}

void init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "get_nth_fibonacci_number", GetNthFibonacciNumber);
}

NODE_MODULE(main_node, init)
