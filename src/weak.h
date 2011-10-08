/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

#ifndef _SRC_NODE_WEAK_H_
#define _SRC_NODE_WEAK_H_

#include <node.h>
#include <v8.h>

namespace node {
namespace weak {

using namespace v8;

typedef struct {
  Persistent<Object> target;
  Persistent<Function> callback;
} weak_conf;

void WeakCallback(Persistent<Value> proxy, void* arg);

Handle<Value> Weak(const Arguments &args);

void Initialize(Handle<Object> target);

} // weak
} // node

#endif // _SRC_NODE_WEAK_H_
