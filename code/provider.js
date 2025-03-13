function request(tag, url, data) {
    let ss = ''
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        console.log(xhr.readyState + ' ' + xhr.status)
        if ((xhr.readyState === 4 && xhr.status === 200) || xhr.status === 304) {
            ss = xhr.responseText
        }
    }
    xhr.open(tag, url, false)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(data)
    return ss
}

function scheduleHtmlProvider(
    dom = document
) {
    let html = ''
    let tag = true
    try {
        let ifs = document.getElementsByTagName('iframe')
        for (let index = 0; index < ifs.length; index++) {
            const doms = ifs[index]
            if (doms.src && doms.src.search('/jsxsd/xskb/xskb_list.do') != -1) {
                const currDom = doms.contentDocument
                html = currDom.getElementById('kbtable')
                    ? currDom.getElementById('kbtable').outerHTML
                    : currDom.getElementsByClassName('content_box')[0].outerHTML
                tag = false
            }
        }
        if (tag) {
            html = dom.getElementById('kbtable').outerHTML
        }
        return html
    } catch (e) {
        console.error(e)

        let html = request('get', '/jsxsd/xskb/xskb_list.do', null)
        dom = new DOMParser().parseFromString(html, 'text/html')
        return dom.getElementById('kbtable')
            ? dom.getElementById('kbtable').outerHTML
            : dom.getElementsByClassName('content_box')[0].outerHTML
    }
}
