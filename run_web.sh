#!/bin/bash
ulimit -c 0 # prevents core dump files from being created

node .output/server/index.mjs
