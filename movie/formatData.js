function formatData (data) {
    var infos = data.infos;
    var images = data.images;
    var title = data.html;
    var originPageUrl = data.detailPageUrl;

    var nameReg = /^.*名称.*$/;
    var sizeReg = /^.*大小.*$/;
    var fileTypeReg = /^.*格式.*$/;
    var durationReg = /^.*时间.*$/;
    var mosaicReg = /^.*有码.*$/;
    var urlReg = /^.*\:\/\/.*$/;

    var result = {
        title,
        originPageUrl,
        images,
        movieName: '',
        size: '',
        filetype: '',
        duration: '',
        isMosaic: '',
        urls: []
    };

    infos.forEach(info => {
        var arr = info.split('：');

        if (nameReg.test(arr[0])) {
            result.movieName = arr[1];
        }
        if (sizeReg.test(arr[0])) {
            result.size = arr[1];
        }
        if (fileTypeReg.test(arr[0])) {
            result.filetype = arr[1];
        }
        if (durationReg.test(arr[0])) {
            result.duration = arr[1];
        }
        if (mosaicReg.test(arr[0])) {
            result.isMosaic = arr[1];
        }
        if (urlReg.test(info)) {
            result.urls.push(info);
        }
    })

    return result;
}

module.exports = formatData;