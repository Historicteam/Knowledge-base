#!/bin/sh

YEAR=$1

cat  << EOF
time_point -> time_point_$YEAR
(*
  => nrel_Gregorian_calendar_scale: ...
   (*
   <- number_of_year: [$YEAR];;
   *);;
  => nrel_main_idtf: [$YEAR год] (* <-lang_ru;;*);;
*);;
EOF
