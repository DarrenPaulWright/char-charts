export const INDENT_WIDTH = 4;

export const SPACE = ' ';

// Vertical dashes - ╵╷╎┆┊    ╹╻╏┇┋   ︴

// See:
// https://en.wikipedia.org/wiki/Box_Drawing_(Unicode_block)
// http://unicode-search.net/unicode-namesearch.pl
// https://www.fileformat.info/info/unicode/font/consolas/grid.htm
// https://www.fileformat.info/info/unicode/font/source_code_pro/grid.htm

export const ROUNDED_STYLE = {
	CHART_TOP_LEFT: '╭',
	CHART_TOP_RIGHT: '╮',
	CHART_BOTTOM_LEFT: '╰',
	CHART_BOTTOM_RIGHT: '╯',
	CHART_TOP_TICK: '┬',
	CHART_BOTTOM_TICK: '┴',
	CHART_BOTTOM_TICK_MAJOR: '┼',
	CHART_HORIZONTAL: '─',
	CHART_VERTICAL_MAJOR: '│',
	CHART_VERTICAL_MINOR: '╵',

	GROUP_HEADER_FILL: '─',

	BAR_FILL: '█▒░',
	BAR_HALF_LEFT: '▌',
	BAR_HALF_RIGHT: '▐',
	BAR_SINGLE: '┃',

	Q1_FILL: '░',
	Q3_FILL: '▓',
	DOTS: '·•●',

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

export const SQUARED_STYLE = {
	...ROUNDED_STYLE,
	CHART_TOP_LEFT: '┌',
	CHART_TOP_RIGHT: '┐',
	CHART_BOTTOM_LEFT: '└',
	CHART_BOTTOM_RIGHT: '┘',
	CHART_TOP_TICK: '┬',
	CHART_BOTTOM_TICK: '┴',
	CHART_BOTTOM_TICK_MAJOR: '┼',
	CHART_HORIZONTAL: '─',
	CHART_VERTICAL_MAJOR: '│',
	CHART_VERTICAL_MINOR: '╵',

	ARROW_LEFT_UP: '└─ ',
	ARROW_RIGHT_UP: ' ─┘',
	ARROW_LEFT_DOWN: '┌─ ',
	ARROW_RIGHT_DOWN: ' ─┐',
	ARROW_RIGHT: ' ──',
	ARROW_LEFT: '── '
};

export const DOUBLED_STYLE = {
	...SQUARED_STYLE,
	CHART_TOP_LEFT: '╒',
	CHART_TOP_RIGHT: '╕',
	CHART_BOTTOM_LEFT: '╘',
	CHART_BOTTOM_RIGHT: '╛',
	CHART_TOP_TICK: '╤',
	CHART_BOTTOM_TICK: '╧',
	CHART_BOTTOM_TICK_MAJOR: '╪',
	CHART_HORIZONTAL: '═',
	CHART_VERTICAL_MAJOR: '│',
	CHART_VERTICAL_MINOR: '╎'
};

/*
ASCII - https://en.wikipedia.org/wiki/ASCII


032 [space]
033 !
034 "
035 #
036 $
037 %
038 &
039 '
040 (
041 )
042 *
043 +
044 ,
045 -
046 .
047 /

048 - 057 0 - 9

058 :
059 ;
060 <
061 =
062 >
063 ?
064 @

065 - 090 A - Z

091 [
092 \
093 ]
094 ^
095 _
096 `

097 - 122 a - z

123 {
124 |
125 }
126 ~
*/
export const ASCII_STYLE: typeof ROUNDED_STYLE = {
	CHART_TOP_LEFT: '+',
	CHART_TOP_RIGHT: '+',
	CHART_BOTTOM_LEFT: '+',
	CHART_BOTTOM_RIGHT: '+',
	CHART_TOP_TICK: ',',
	CHART_BOTTOM_TICK: '\'',
	CHART_BOTTOM_TICK_MAJOR: '+',
	CHART_HORIZONTAL: '-',
	CHART_VERTICAL_MAJOR: '|',
	CHART_VERTICAL_MINOR: '\'',

	GROUP_HEADER_FILL: '-',

	BAR_FILL: '%#@',
	BAR_HALF_LEFT: '%',
	BAR_HALF_RIGHT: '%',
	BAR_SINGLE: '%',

	Q1_FILL: '#',
	Q3_FILL: '%',
	DOTS: '+*@',

	WHISKER_START: '|',
	WHISKER_END: '|',
	WHISKER_LINE: '~',
	WHISKER_SINGLE: '|',

	ARROW_LEFT_UP: '^- ',
	ARROW_RIGHT_UP: ' -^',
	ARROW_LEFT_DOWN: ',- ',
	ARROW_RIGHT_DOWN: ' -,',
	ARROW_RIGHT: ' --',
	ARROW_LEFT: '-- '
};
