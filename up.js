/**
 * Created by sawyer on 16/4/18.
 */

function AliOSS(signatureURL, type, chooseFileBtnId, progressId, func, width,showFileId) {

    this._SignatureURL = signatureURL;
    this._type = type;
    _oss = {};
    _width = width;
    _showFileId = showFileId;

    var xmlhttp = null ;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp) {

        var getUrl = this._SignatureURL + "?uploadType=" + this._type;
        xmlhttp.open("GET", getUrl, false);
        xmlhttp.send(null);

        if (xmlhttp.responseText) {

            try {

                var data = eval("(" + xmlhttp.responseText + ")");

                if (data.status == 'SUCCESS') {

                    _oss = data.data;

                } else {

                    alert('获取签名失败!');

                }

            } catch (e) {

                alert(e);

            }

        }
    }


    var uploader = new plupload.Uploader({

        browse_button: chooseFileBtnId,
        url: _oss.host,
        flash_swf_url: 'js/Moxie.swf',
        silverlight_xap_url: 'js/Moxie.xap',
        runtimes: 'html5,flash,silverlight,html4',
        filters: {
            mime_types: [
                {extensions: _oss.extensions}
            ],
            max_file_size: _oss.maxSize,
            prevent_duplicates: _oss.duplicates
        },
        init: {

            FilesAdded: function (up, files) {

                _filename = files[0].name;
                document.getElementById(_showFileId).innerHTML(_filename);
            },

            FileUploaded: function (up, file, info) {

                if (info.status == 200) {

                    if (type == 'ADVVideo') {

                        func(_oss.host + "/" + _oss.dir + "/" + _fileName);

                    } else {

                        func(_oss.imgURL + "/" + _fileName + "@" + _width + "h");

                    }

                } else {

                    alert("上传错误,请稍后尝试!");
                }
            },

            UploadProgress: function (up, file) {

                var progress = document.getElementById(progressId);
                if (progress) {

                    progress.style.width = file.percent + "%";
                }
            },

            Error: function (up, err) {
                if (err.code == -600) {

                    alert("选择的文件太大了,请重新选择!");

                }
                else if (err.code == -601) {

                    alert("选择的文件后缀不对,请重新选择!");
                }

            }
        }
    });

    uploader.init();

    this.postSubmit = function () {

        if (_filename) {

            var ext = this.getSuffix(_filename).toLowerCase();
            _fileName = this.randromName(ext);

        }

        uploader.setOption({

            'multipart_params': {

                'key': _oss.dir + "/" + _fileName,
                'policy': _oss.policy,
                'OSSAccessKeyId': _oss.accessId,
                'success_action_status': '200',
                'signature': _oss.signature

            }
        });

        uploader.start();

    };

    this.randromName = function (ext) {

        var len = 19;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var names = '';
        for (var i = 0; i < len; i++) {
            names += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return names + ext;

    };

    this.getSuffix = function (filename) {

        var pos = filename.lastIndexOf('.');

        var suffix = '';

        if (pos != -1) {
            suffix = filename.substring(pos)
        }

        return suffix;
    }

}





