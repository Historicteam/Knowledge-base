#!/bin/sh

YEAR=$1

cat  << EOF
time_point -> time_point_$YEAR
(*
  => nrel_translation_in_the_Gregorian_calendar: ...
  (*
    -> rrel_year: rrel_decimal: [$YEAR];;
  *);;
  => nrel_main_idtf: [$YEAR год] (* <-lang_ru;;*);;
*);;
EOF