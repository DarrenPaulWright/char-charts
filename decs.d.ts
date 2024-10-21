declare module 'textdiff-create' {
	type diffDelete = [-1, number];
	type diffEqual = [0, number];
	type diffAdd = [1, string];

	export default function createDiff(string1: string, string2: string): Array<diffDelete | diffEqual | diffAdd>;
}
