/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

#include "weak.h"
#include <node.h>
#include <v8.h>

// malloc, free
#include <stdlib.h>

namespace node {
namespace weak {

using namespace v8;

void WeakCallback(Persistent<Value> proxy, void* arg) {
  HandleScope scope;

  weak_conf* conf = (weak_conf*) arg;

  Local<Value> argv[0];
  conf->callback->Call(conf->target, 0, argv);
  conf->target.Dispose();
  conf->callback.Dispose();

  free(conf);
}

Handle<Value> Weak(const Arguments &args) {
  HandleScope scope;

  if (args.Length() < 2) {
    return ThrowException(String::New("This function takes two arguments"));
  }

  weak_conf* conf = (weak_conf*) malloc(sizeof(conf));
  if (conf == NULL) {
    return ThrowException(String::New("Memory allocation failed"));
  }

  conf->target = Persistent<Object>::New(args[0]->ToObject());
  conf->callback = Persistent<Function>::New(Handle<Function>::Cast(args[1]));

  conf->target.MakeWeak(conf, WeakCallback);

  return Undefined();
}

void Initialize(Handle<Object> target) {
  NODE_SET_METHOD(target, "weak", node::weak::Weak);
}

}
}

NODE_MODULE(weak, node::weak::Initialize);
