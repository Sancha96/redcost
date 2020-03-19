class functions {
    static numberWithSpaces(x) {
        return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;
    }

    static getHref() {
        return window.location.origin + '/'
    }

    static getAxiosHeaders() {
        return {
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            }
        }
    }
}

export default functions