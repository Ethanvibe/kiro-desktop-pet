#!/bin/sh

set -u

parent_pid=$1
script_path=$2
business_image=$3
casual_image=$4
state_path=$5
installed_json=$6
pid_path=$7
child_pid=

cleanup() {
  if [ -n "${child_pid}" ] && /bin/kill -0 "${child_pid}" 2>/dev/null; then
    /bin/kill -TERM "${child_pid}" 2>/dev/null || true
    wait "${child_pid}" 2>/dev/null || true
  fi
  /bin/rm -f "${pid_path}"
}

trap cleanup EXIT HUP INT TERM

/usr/bin/osascript -l JavaScript \
  "${script_path}" \
  "${business_image}" \
  "${casual_image}" \
  "${state_path}" &
child_pid=$!

while /bin/kill -0 "${parent_pid}" 2>/dev/null; do
  if [ -f "${installed_json}" ] && \
    ! /usr/bin/grep -Eq '"enabled"[[:space:]]*:[[:space:]]*true' "${installed_json}"; then
    exit 0
  fi
  if ! /bin/kill -0 "${child_pid}" 2>/dev/null; then
    wait "${child_pid}"
    exit $?
  fi
  /bin/sleep 2
done
