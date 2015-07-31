/**
 *  �w���ς��� Web �T�[�r�X
 *  �w���p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2013-09-13
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiStationInfo = function (pObject, config) {
    /*
    * Web�T�[�r�X�̐ݒ�
    */
    var apiURL = "http://api.ekispert.com/";

    /*
    * GET�p�����[�^����L�[�̐ݒ�
    */
    var key;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        imagePath = s.src.substring(0, s.src.indexOf("expGuiStationInfo\.js"));
        if (s.src && s.src.match(/expGuiStationInfo\.js(\?.*)?/)) {
            var params = s.src.replace(/.+\?/, '');
            params = params.split("&");
            for (var i = 0; i < params.length; i++) {
                var tmp = params[i].split("=");
                if (tmp[0] == "key") {
                    key = unescape(tmp[1]);
                }
            }
            break;
        }
    }

    /*
    * �ϐ��S
    */
    var stationList;
    var railInformationList;
    var nearrailInformationList;
    var exitInformationList;
    var welfareInformationList;
    var httpObj;
    var tmpUrl;
    var limit = 100; //��x�Ɏ擾����f�[�^�̏��
    // �ݒ�
    var corporationBind;
    var type;
    var prefectureCode;
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�

    /*
    * �w�̌���
    */
    function searchStation(lati, longi, gcs, param1, param2) {
        var url = apiURL + "v1/json/geo/station?key=" + key;
        if (typeof type != 'undefined') {
            url += "&type=" + type;
        }
        if (typeof corporationBind != 'undefined') {
            url += "&corporationBind=" + corporationBind;
        }
        // �ܓx�o�x
        var geoPoint = lati + "," + longi;
        // ���n�n
        geoPoint += "," + gcs;
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                callbackFunction = param1;
            } else {
                geoPoint += "," + param1;
                callbackFunction = undefined;
            }
        } else {
            // ���a
            geoPoint += "," + param1;
            callbackFunction = param2;
        }
        url += "&geoPoint=" + geoPoint;
        stationList = new Array();
        tmpUrl = url;
        // �ʐM
        request(url);
    }

    /*
    * �w�̌���
    */
    function getStation(station, callback) {
        var url = apiURL + "v1/json/station?key=" + key;
        if (isNaN(station)) {
            // �w��
            url += "&name=" + encodeURIComponent(station);
            if (typeof type != 'undefined') {
                url += "&type=" + type;
            }
            if (typeof corporationBind != 'undefined') {
                url += "&corporationBind=" + corporationBind;
            }
            if (typeof prefectureCode != 'undefined') {
                url += "&prefectureCode=" + prefectureCode;
            }
        } else {
            // �w�R�[�h
            url += "&code=" + station;
        }
        callbackFunction = callback;
        stationList = new Array();
        tmpUrl = url;
        // �ʐM
        request(url);
    }

    /*
    * ���w�̌���
    */
    function getStationOldName(oldName, callback) {
        var url = apiURL + "v1/json/station?key=" + key;
        // �w��
        url += "&oldName=" + encodeURIComponent(oldName);
        callbackFunction = callback;
        stationList = new Array();
        tmpUrl = url;
        // �ʐM
        request(url);
    }

    /*
    * �w�̑S�擾
    */
    function getAllStation(callback) {
        var url = apiURL + "v1/json/station?key=" + key;
        if (typeof type != 'undefined') {
            url += "&type=" + type;
        }
        if (typeof corporationBind != 'undefined') {
            url += "&corporationBind=" + corporationBind;
        }
        if (typeof prefectureCode != 'undefined') {
            url += "&prefectureCode=" + prefectureCode;
        }
        callbackFunction = callback;
        stationList = new Array();
        tmpUrl = url;
        // �ʐM
        request(url);
    }

    /*
    * �w�肳�ꂽURL���R�[������֐�
    */
    function request(url) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        // �ʐM
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setStationList(JSON_object);
            };
            httpObj.onerror = function () {
                // �G���[���̏���
                if (typeof callbackFunction == 'function') {
                    callbackFunction(false);
                }
            };
        } else {
            httpObj = new XMLHttpRequest();
            httpObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (httpObj.readyState == done && httpObj.status == ok) {
                    JSON_object = JSON.parse(httpObj.responseText);
                    setStationList(JSON_object);
                } else if (httpObj.readyState == done && httpObj.status != ok) {
                    // �G���[���̏���
                    if (typeof callbackFunction == 'function') {
                        callbackFunction(false);
                    }
                }
            };
        }
        httpObj.open("GET", url, true);
        httpObj.send(null);
    }

    /*
    * �w�ꗗ�̉��
    */
    function setStationList(json) {
        var tmp_stationList = json;
        if (typeof tmp_stationList.ResultSet.Point == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else if (typeof tmp_stationList.ResultSet.Point.length == 'undefined') {
            stationList.push(setStationObject(tmp_stationList.ResultSet.Point));
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        } else {
            for (var i = 0; i < tmp_stationList.ResultSet.Point.length; i++) {
                stationList.push(setStationObject(tmp_stationList.ResultSet.Point[i]));
            }
            if (typeof tmp_stationList.ResultSet.max != 'undefined' && typeof tmp_stationList.ResultSet.offset != 'undefined') {
                // �I����Ă��Ȃ��ꍇ�̓��[�v����
                if (parseInt(tmp_stationList.ResultSet.max) > (parseInt(tmp_stationList.ResultSet.offset) + tmp_stationList.ResultSet.Point.length)) {
                    var offset = parseInt(tmp_stationList.ResultSet.offset) + limit;
                    request(tmpUrl + "&offset=" + offset);
                } else {
                    // ����
                    if (typeof callbackFunction == 'function') {
                        callbackFunction(true);
                    }
                }
            } else {
                // ����
                if (typeof callbackFunction == 'function') {
                    callbackFunction(true);
                }
            }
        }
    }

    /*
    * �n�_�I�u�W�F�N�g�̍쐬
    */
    function setStationObject(stationObj) {
        var tmp_station = new Object();
        tmp_station.name = stationObj.Station.Name;
        tmp_station.code = stationObj.Station.code;
        tmp_station.yomi = stationObj.Station.Yomi;
        if (typeof stationObj.Station.Type.text != 'undefined') {
            tmp_station.type = stationObj.Station.Type.text;
            if (typeof stationObj.Station.Type.detail != 'undefined') {
                tmp_station.type_detail = stationObj.Station.Type.text + "." + stationObj.Station.Type.detail;
            }
        } else {
            tmp_station.type = stationObj.Station.Type;
        }
        if (typeof stationObj.GeoPoint != 'undefined') {
            // �ܓx
            tmp_station.lati = stationObj.GeoPoint.lati;
            tmp_station.lati_d = stationObj.GeoPoint.lati_d;
            // �o�x
            tmp_station.longi = stationObj.GeoPoint.longi;
            tmp_station.longi_d = stationObj.GeoPoint.longi_d;
            // gcs
            tmp_station.gcs = stationObj.GeoPoint.gcs;
        }
        //���R�[�h
        if (typeof stationObj.Prefecture != 'undefined') {
            tmp_station.kenCode = parseInt(stationObj.Prefecture.code);
        }
        //����
        if (typeof stationObj.Distance != 'undefined') {
            tmp_station.distance = parseInt(stationObj.Distance);
        }
        return tmp_station;
    }

    /*
    * �w���̎擾
    */
    function getPointObject(station) {
        // �I�u�W�F�N�g�R�s�[�p�C�����C���֐�
        function clone(obj) {
            var f = function () { };
            f.prototype = obj;
            return new f;
        }
        for (var i = 0; i < stationList.length; i++) {
            if (isNaN(station)) {
                if (stationList[i].name == station) {
                    return clone(stationList[i]);
                } else if (stationList[i].code == station) {
                    return clone(stationList[i]);
                }
            }
        }
    }

    /*
    * �w���X�g�̎擾
    */
    function getStationList() {
        if (typeof stationList != 'undefined') {
            var tmpStationList = new Array();
            for (var i = 0; i < stationList.length; i++) {
                tmpStationList.push(stationList[i].name);
            }
            return tmpStationList.join(",");
        } else {
            return;
        }
    }

    /*
    * �w�̕t�����擾
    */
    function getStationInfo(code, callback) {
        var url = apiURL + "v1/json/station/info?key=" + key;
        url += "&code=" + code;
        url += "&type=rail:nearrail:exit:welfare";
        callbackFunction = callback;
        railInformationList = new Array();
        nearrailInformationList = new Array();
        exitInformationList = new Array();
        welfareInformationList = new Array();
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        // �ʐM
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setInformationList(JSON_object);
            };
            httpObj.onerror = function () {
                // �G���[���̏���
                if (typeof callbackFunction == 'function') {
                    callbackFunction(false);
                }
            };
        } else {
            httpObj = new XMLHttpRequest();
            httpObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (httpObj.readyState == done && httpObj.status == ok) {
                    JSON_object = JSON.parse(httpObj.responseText);
                    setInformationList(JSON_object);
                } else if (httpObj.readyState == done && httpObj.status != ok) {
                    // �G���[���̏���
                    if (typeof callbackFunction == 'function') {
                        callbackFunction(false);
                    }
                }
            };
        }
        httpObj.open("GET", url, true);
        httpObj.send(null);
    }

    /*
    * �w�t�����̉��
    */
    function setInformationList(json) {
        var tmp_infoList = json;
        if (typeof tmp_infoList.ResultSet.Information == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else {
            for (var i = 0; i < tmp_infoList.ResultSet.Information.length; i++) {
                // ��Ж��̃��X�g�쐬
                var tmp_corporationList = new Array();
                if (typeof tmp_infoList.ResultSet.Information[i].Corporation != 'undefined') {
                    if (typeof tmp_infoList.ResultSet.Information[i].Corporation.length == 'undefined') {
                        // 1����
                        tmp_corporationList.push(tmp_infoList.ResultSet.Information[i].Corporation.Name);
                    } else {
                        // ��������
                        for (var j = 0; j < tmp_infoList.ResultSet.Information[i].Corporation.length; j++) {
                            tmp_corporationList.push(tmp_infoList.ResultSet.Information[i].Corporation[j].Name);
                        }
                    }
                }
                if (tmp_infoList.ResultSet.Information[i].Type == "rail") {
                    // ������H��
                    if (typeof tmp_infoList.ResultSet.Information[i].Line != 'undefined') {
                        if (typeof tmp_infoList.ResultSet.Information[i].Line.length == 'undefined') {
                            // 1����
                            railInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].Line, tmp_corporationList[parseInt(tmp_infoList.ResultSet.Information[i].Line.corporationIndex) - 1]));
                        } else {
                            // ��������
                            for (var j = 0; j < tmp_infoList.ResultSet.Information[i].Line.length; j++) {
                                railInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].Line[j], tmp_corporationList[parseInt(tmp_infoList.ResultSet.Information[i].Line[j].corporationIndex) - 1]));
                            }
                        }
                    }
                } else if (tmp_infoList.ResultSet.Information[i].Type == "nearrail") {
                    // �Ŋ�H��
                    if (typeof tmp_infoList.ResultSet.Information[i].Line != 'undefined') {
                        if (typeof tmp_infoList.ResultSet.Information[i].Line.length == 'undefined') {
                            // 1����
                            nearrailInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].Line, tmp_corporationList[parseInt(tmp_infoList.ResultSet.Information[i].Line.corporationIndex) - 1]));
                        } else {
                            // ��������
                            for (var j = 0; j < tmp_infoList.ResultSet.Information[i].Line.length; j++) {
                                nearrailInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].Line[j], tmp_corporationList[parseInt(tmp_infoList.ResultSet.Information[i].Line[j].corporationIndex) - 1]));
                            }
                        }
                    }
                } else if (tmp_infoList.ResultSet.Information[i].Type == "exit") {
                    // �o��
                    if (typeof tmp_infoList.ResultSet.Information[i].Exit != 'undefined') {
                        if (typeof tmp_infoList.ResultSet.Information[i].Exit.length == 'undefined') {
                            // 1����
                            exitInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].Exit));
                        } else {
                            // ��������
                            for (var j = 0; j < tmp_infoList.ResultSet.Information[i].Exit.length; j++) {
                                exitInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].Exit[j]));
                            }
                        }
                    }
                } else if (tmp_infoList.ResultSet.Information[i].Type == "welfare") {
                    // �����ݔ�
                    if (typeof tmp_infoList.ResultSet.Information[i].WelfareFacilities != 'undefined') {
                        if (typeof tmp_infoList.ResultSet.Information[i].WelfareFacilities.length == 'undefined') {
                            // 1����
                            welfareInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].WelfareFacilities));
                        } else {
                            // ��������
                            for (var j = 0; j < tmp_infoList.ResultSet.Information[i].WelfareFacilities.length; j++) {
                                welfareInformationList.push(setInformationObject(tmp_infoList.ResultSet.Information[i].WelfareFacilities[j]));
                            }
                        }
                    }
                }
            }
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * �w�f�[�^�I�u�W�F�N�g�̍쐬
    */
    function setInformationObject(infoObj, corporation) {
        var tmp_info = new Object();
        tmp_info.name = infoObj.Name;
        if (typeof infoObj.Type != 'undefined') {
            if (typeof infoObj.Type.text != 'undefined') {
                tmp_info.type = infoObj.Type.text;
                if (typeof infoObj.Type.detail != 'undefined') {
                    tmp_info.type_detail = infoObj.Type.text + "." + infoObj.Type.detail;
                }
            } else {
                tmp_info.type = infoObj.Type;
            }
        }
        if (typeof infoObj.Color != 'undefined') {
            tmp_info.color = infoObj.Color;
        }
        if (typeof corporation != 'undefined') {
            tmp_info.corporation = corporation;
        }
        if (typeof infoObj.Comment != 'undefined') {
            tmp_info.comment = infoObj.Comment;
        }
        return tmp_info;
    }

    /*
    * �w�t�����̎擾
    */
    function getInformationList(type) {
        var tmpInformationList = new Array();
        if (type == "rail") {
            for (var i = 0; i < railInformationList.length; i++) {
                tmpInformationList.push(railInformationList[i].name);
            }
        } else if (type == "nearrail") {
            for (var i = 0; i < nearrailInformationList.length; i++) {
                tmpInformationList.push(nearrailInformationList[i].name);
            }
        } else if (type == "exit") {
            for (var i = 0; i < exitInformationList.length; i++) {
                tmpInformationList.push(exitInformationList[i].name);
            }
        } else if (type == "welfare") {
            for (var i = 0; i < welfareInformationList.length; i++) {
                tmpInformationList.push(welfareInformationList[i].name);
            }
        }
        return tmpInformationList.join(",");
    }

    /*
    * �w�t�����I�u�W�F�N�g�̎擾
    */
    function getInformationObject(name, type) {
        // �I�u�W�F�N�g�R�s�[�p�C�����C���֐�
        function clone(obj) {
            var f = function () { };
            f.prototype = obj;
            return new f;
        }
        if (type == "rail") {
            for (var i = 0; i < railInformationList.length; i++) {
                if (railInformationList[i].name == name) {
                    return clone(railInformationList[i]);
                }
            }
        } else if (type == "nearrail") {
            for (var i = 0; i < nearrailInformationList.length; i++) {
                if (nearrailInformationList[i].name == name) {
                    return clone(nearrailInformationList[i]);
                }
            }
        } else if (type == "exit") {
            for (var i = 0; i < exitInformationList.length; i++) {
                if (exitInformationList[i].name == name) {
                    return clone(exitInformationList[i]);
                }
            }
        } else if (type == "welfare") {
            for (var i = 0; i < welfareInformationList.length; i++) {
                if (welfareInformationList[i].name == name) {
                    return clone(welfareInformationList[i]);
                }
            }
        }
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name == "corporationBind") {
            if (typeof value == "object") {
                corporationBind = value.join(":");
            } else {
                corporationBind = value;
            }
        } else if (name == "type") {
            if (typeof value == "object") {
                type = value.join(":");
            } else {
                type = value;
            }
        } else if (name == "prefectureCode") {
            if (typeof value == "object") {
                prefectureCode = value.join(":");
            } else {
                prefectureCode = value;
            }
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.searchStation = searchStation;
    this.getStation = getStation;
    this.getStationOldName = getStationOldName;
    this.getAllStation = getAllStation;
    this.getStationList = getStationList;
    this.getPointObject = getPointObject;
    this.getStationInfo = getStationInfo;
    this.getInformationList = getInformationList;
    this.getInformationObject = getInformationObject;
    this.setConfigure = setConfigure;

    /*
    * �萔���X�g
    */
    this.DIRECTION_UP = "up";
    this.DIRECTION_DOWN = "down";
    this.DIRECTION_NONE = "none";
    this.TYPE_TRAIN = "train";
    this.TYPE_PLANE = "plane";
    this.TYPE_SHIP = "ship";
    this.TYPE_BUS = "bus";
    this.TYPE_WALK = "walk";
    this.TYPE_STRANGE = "strange";
    this.TYPE_BUS_LOCAL = "bus.local";
    this.TYPE_BUS_CONNECTION = "bus.connection";
    this.TYPE_BUS_HIGHWAY = "bus.highway";
    this.TYPE_BUS_MIDNIGHT = "bus.midnight";
    this.TYPE_TRAIN_LIMITEDEXPRESS = "train.limitedExpress";
    this.TYPE_TRAIN_SHINKANSEN = "train.shinkansen";
    this.TYPE_TRAIN_SLEEPERTRAIN = "train.sleeperTrain";
    this.TYPE_TRAIN_LINER = "train.liner";
    this.TDFK_HOKKAIDO = 1;
    this.TDFK_AOMORI = 2;
    this.TDFK_IWATE = 3;
    this.TDFK_MIYAGI = 4;
    this.TDFK_AKITA = 5;
    this.TDFK_YAMAGATA = 6;
    this.TDFK_FUKUSHIMA = 7;
    this.TDFK_IBARAKI = 8;
    this.TDFK_TOCHIGI = 9;
    this.TDFK_GUNMA = 10;
    this.TDFK_SAITAMA = 11;
    this.TDFK_CHIBA = 12;
    this.TDFK_TOKYO = 13;
    this.TDFK_KANAGAWA = 14;
    this.TDFK_NIIGATA = 15;
    this.TDFK_TOYAMA = 16;
    this.TDFK_ISHIKAWA = 17;
    this.TDFK_FUKUI = 18;
    this.TDFK_YAMANASHI = 19;
    this.TDFK_NAGANO = 20;
    this.TDFK_GIFU = 21;
    this.TDFK_SHIZUOKA = 22;
    this.TDFK_AICHI = 23;
    this.TDFK_MIE = 24;
    this.TDFK_SHIGA = 25;
    this.TDFK_KYOTO = 26;
    this.TDFK_OSAKA = 27;
    this.TDFK_HYOGO = 28;
    this.TDFK_NARA = 29;
    this.TDFK_WAKAYAMA = 30;
    this.TDFK_TOTTORI = 31;
    this.TDFK_SHIMANE = 32;
    this.TDFK_OKAYAMA = 33;
    this.TDFK_HIROSHIMA = 34;
    this.TDFK_YAMAGUCHI = 35;
    this.TDFK_TOKUSHIMA = 36;
    this.TDFK_KAGAWA = 37;
    this.TDFK_EHIME = 38;
    this.TDFK_KOCHI = 39;
    this.TDFK_FUKUOKA = 40;
    this.TDFK_SAGA = 41;
    this.TDFK_NAGASAKI = 42;
    this.TDFK_KUMAMOTO = 43;
    this.TDFK_OITA = 44;
    this.TDFK_MIYAZAKI = 45;
    this.TDFK_KAGOSHIMA = 46;
    this.TDFK_OKINAWA = 47;
    this.TYPE_RAIL = "rail";
    this.TYPE_NEARRAIL = "nearrail";
    this.TYPE_EXIT = "exit";
    this.TYPE_WELFARE = "welfare";
};
