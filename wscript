import Options
from os.path import exists
from shutil import copy2 as copy

TARGET = 'weak'
TARGET_FILE = '%s.node' % TARGET
built = 'build/default/%s' % TARGET_FILE
dest = 'lib/deadbolt/%s' % TARGET_FILE

def set_options(opt):
  opt.tool_options("compiler_cxx")

def configure(conf):
  conf.check_tool("compiler_cxx")
  conf.check_tool("node_addon")

def build(bld):
  obj = bld.new_task_gen("cxx", "shlib", "node_addon")
  obj.cxxflags = ["-g", "-D_LARGEFILE_SOURCE", "-Wall"]
  obj.target = TARGET
  obj.source = "src/weak.cc"
  obj.includes = "src/"

def shutdown():
  if Options.commands['clean']:
      if exists(TARGET_FILE):
        unlink(TARGET_FILE)
  else:
    if exists(built):
      copy(built, dest)
