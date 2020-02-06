export const INDENT_WIDTH = 4;
export const SPACE = ' ';

// See:
// https://en.wikipedia.org/wiki/Box_Drawing_(Unicode_block)
// http://unicode-search.net/unicode-namesearch.pl
// https://www.fileformat.info/info/unicode/font/consolas/grid.htm
// https://www.fileformat.info/info/unicode/font/source_code_pro/grid.htm

export const COLOR = {
	CHART_TOP_LEFT: '╭',
	CHART_TOP_RIGHT: '╮',
	CHART_BOTTOM_LEFT: '╰',
	CHART_BOTTOM_RIGHT: '╯',
	CHART_TOP_TICK: '┬',
	CHART_BOTTOM_TICK: '┴',
	CHART_BOTTOM_TICK_MAJOR: '┼',
	CHART_HORIZONTAL: '─',
	CHART_VERTICAL_MAJOR: '│',
	CHART_VERTICAL_MINOR: '│',

	GROUP_HEADER_FILL: '─',

	BAR_FILL: '█',
	BAR_HALF_LEFT: '▌',
	BAR_HALF_RIGHT: '▐',
	BAR_SINGLE: '┃',

	Q1_FILL: '▒',
	Q3_FILL: '▓',
	DOTS: '·•●❶',

	WHISKER_START: '┣',
	WHISKER_END: '┫',
	WHISKER_LINE: '━',
	WHISKER_SINGLE: '┃',

	ARROW_LEFT_UP: '╰─ ',
	ARROW_RIGHT_UP: ' ─╯',
	ARROW_LEFT_DOWN: '╭─ ',
	ARROW_RIGHT_DOWN: ' ─╮',
	ARROW_RIGHT: ' ──',
	ARROW_LEFT: '── '
};

export const MONOCHROME = Object.assign({}, COLOR, {
	CHART_VERTICAL_MAJOR: '│',
	CHART_VERTICAL_MINOR: '╵'
});

// ASCII - https://en.wikipedia.org/wiki/ASCII
//
//				040 (	050 2	060 <	070 F	080 P	090 Z	100 d	110 n	120 x
//				041 )	051 3	061 =	071 G	081 Q	091 [	101 e	111 o	121 y
// 032 [space]	042 *	052 4	062 >	072 H	082 R	092 \	102 f	112 p	122 z
// 033 !		043 +	053 5	063 ?	073 I	083 S	093 ]	103 g	113 q	123 {
// 034 "		044 ,	054 6	064 @	074 J	084 T	094 ^	104 h	114 r	124 |
// 035 #		045 -	055 7	065 A	075 K	085 U	095 _	105 i	115 s	125 }
// 036 $		046 .	056 8	066 B	076 L	086 V	096 `	106 j	116 t	126 ~
// 037 %		047 /	057 9	067 C	077 M	087 W	097 a	107 k	117 u
// 038 &		048 0	058 :	068 D	078 N	088 X	098 b	108 l	118 v
// 039 '		049 1	059 ;	069 E	079 O	089 Y	099 c	109 m	119 w
export const ASCII = {
	CHART_TOP_LEFT: '+',
	CHART_TOP_RIGHT: '+',
	CHART_BOTTOM_LEFT: '+',
	CHART_BOTTOM_RIGHT: '+',
	CHART_TOP_TICK: '+',
	CHART_BOTTOM_TICK: '+',
	CHART_HORIZONTAL: '-',
	CHART_VERTICAL_MAJOR: '|',
	CHART_VERTICAL_MINOR: '\'',

	GROUP_HEADER_FILL: '-',

	BAR_FILL: '%',
	BAR_HALF_LEFT: '%',
	BAR_HALF_RIGHT: '%',
	BAR_SINGLE: '%',

	Q1_FILL: 'M',
	Q3_FILL: '%',
	DOTS: '+*',

	WHISKER_START: '|',
	WHISKER_END: '|',
	WHISKER_LINE: '-',
	WHISKER_SINGLE: '|',

	ARROW_LEFT_UP: '^- ',
	ARROW_RIGHT_UP: ' -^',
	ARROW_LEFT_DOWN: ',- ',
	ARROW_RIGHT_DOWN: ' -,',
	ARROW_RIGHT: ' --',
	ARROW_LEFT: '-- '
};
