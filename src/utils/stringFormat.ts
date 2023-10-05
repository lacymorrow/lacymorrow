function stringFormat(str: string, ..._rest: any[] ): string {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

export default stringFormat;
