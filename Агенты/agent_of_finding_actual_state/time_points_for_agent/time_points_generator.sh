#!/bin/sh

counter=1
while true; do
  if [[ "$counter" -gt 2016 ]]; then
       echo "Counter: $counter times reached; Exiting loop!"
       exit 0
  else
      ./time_point_generator.sh $counter > "time_point_$counter.scs"
      echo "$counter"
       counter=$((counter+1))
  fi
done