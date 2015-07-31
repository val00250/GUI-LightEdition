/**
 *  �w���ς��� Web �T�[�r�X
 *  ���t���̓p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2013-09-13
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiDateTime = function (pObject, config) {
    /*
    * �h�L�������g�̃I�u�W�F�N�g���i�[
    */
    var documentObject = pObject;
    var baseId = pObject.id;

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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiDateTime\.js"));
        if (s.src && s.src.match(/expGuiDateTime\.js(\?.*)?/)) {
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
    * AGENT�̃`�F�b�N
    */
    var agent = 1;
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
    var isAndroid_phone = (navigator.userAgent.match(/Android/i) != null && navigator.userAgent.match(/Mobile/i) != null);
    var isAndroid_tablet = (navigator.userAgent.match(/Android/i) != null && navigator.userAgent.match(/Mobile/i) == null);
    if (isiPhone || isAndroid_phone) { agent = 2; }
    if (isiPad || isAndroid_tablet) { agent = 3; }

    /*
    * �C�x���g�̐ݒ�(IE�Ή���)
    */
    function addEvent(element, eventName, func) {
        if (element) {
            if (typeof eventName == 'string' && typeof func == 'function') {
                if (element.addEventListener) {
                    element.addEventListener(eventName, func, false);
                } else if (element.attachEvent) {
                    element.attachEvent("on" + eventName, func);
                }
            }
        }
    }

    /*
    * �ϐ��S
    */
    // �J�����_�[�A�g�p�ϐ�
    var c_year;
    var c_month;
    var c_date;

    /*
    * �������͂̐ݒu
    */
    function dispDateTime(type) {
        // �T�������E���t�E���Ԑݒ�̃e�[�u��
        var buffer = "";
        if (agent == 1) {
            buffer += '<div class="expGuiDateTime expGuiDateTimePc">';
            buffer += '<input type="hidden" id="' + baseId + ':searchType">';
            buffer += '<div id="' + baseId + ':searchTypeList" class="exp_searchTypeList exp_clearfix">';
            buffer += '<div id="' + baseId + ':searchType:dia">';
            buffer += '<div class="exp_searchTypeDepartureOn" id="' + baseId + ':searchType:' + String(1) + ':active"><span class="exp_text">�o��</span></div>';
            buffer += '<div class="exp_searchTypeDepartureOff" id="' + baseId + ':searchType:' + String(1) + ':none">';
            buffer += '<a class="exp_searchTypeButton" id="' + baseId + ':searchType:' + String(1) + '" href="javascript:void(0);"><span class="exp_text">�o��</span></a>';
            buffer += '</div>';
            buffer += '<div class="exp_searchTypeArrivalOn" id="' + baseId + ':searchType:' + String(2) + ':active"><span class="exp_text">����</span></div>';
            buffer += '<div class="exp_searchTypeArrivalOff" id="' + baseId + ':searchType:' + String(2) + ':none">';
            buffer += '<a class="exp_searchTypeButton" id="' + baseId + ':searchType:' + String(2) + '" href="javascript:void(0);"><span class="exp_text">����</span></a>';
            buffer += '</div>';
            buffer += '<div class="exp_searchTypeFirstTrainOn" id="' + baseId + ':searchType:' + String(3) + ':active"><span class="exp_text">�n��</span></div>';
            buffer += '<div class="exp_searchTypeFirstTrainOff" id="' + baseId + ':searchType:' + String(3) + ':none">';
            buffer += '<a class="exp_searchTypeButton" id="' + baseId + ':searchType:' + String(3) + '" href="javascript:void(0);"><span class="exp_text">�n��</span></a>';
            buffer += '</div>';
            buffer += '<div class="exp_searchTypeLastTrainOn" id="' + baseId + ':searchType:' + String(4) + ':active"><span class="exp_text">�I�d</span></div>';
            buffer += '<div class="exp_searchTypeLastTrainOff" id="' + baseId + ':searchType:' + String(4) + ':none">';
            buffer += '<a class="exp_searchTypeButton" id="' + baseId + ':searchType:' + String(4) + '" href="javascript:void(0);"><span class="exp_text">�I�d</span></a>';
            buffer += '</div>';
            buffer += '</div>';
            buffer += '<div id="' + baseId + ':searchType:average">';
            buffer += '<div class="exp_searchTypePlainOn" id="' + baseId + ':searchType:' + String(5) + ':active"><span class="exp_text">����</span></div>';
            buffer += '<div class="exp_searchTypePlainOff" id="' + baseId + ':searchType:' + String(5) + ':none">';
            buffer += '<a class="exp_searchTypeButton" id="' + baseId + ':searchType:' + String(5) + '" href="javascript:void(0);"><span class="exp_text">����</span></a>';
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        } else if (agent == 2 || agent == 3) {
            if (agent == 2) {
                buffer += '<div class="expGuiDateTime expGuiDateTimePhone">';
            } else if (agent == 3) {
                buffer += '<div class="expGuiDateTime expGuiDateTimeTablet">';
            }
            buffer += '<div id="' + baseId + ':searchTypeList" class="exp_searchType exp_clearfix">';
            buffer += '<span id="' + baseId + ':searchType:dia">';
            buffer += '<span class="exp_departure"><input type="radio" id="' + baseId + ':searchType:1" name="' + baseId + ':searchType" value="departure" id="' + baseId + ':searchType:1"><label for="' + baseId + ':searchType:1" id="' + baseId + ':searchType:1:text">�o��</label></span>';
            buffer += '<span class="exp_arrival"><input type="radio" id="' + baseId + ':searchType:2" name="' + baseId + ':searchType" value="arrival" id="' + baseId + ':searchType:2"><label for="' + baseId + ':searchType:2" id="' + baseId + ':searchType:2:text">����</label></span>';
            buffer += '<span class="exp_firstTrain"><input type="radio" id="' + baseId + ':searchType:3" name="' + baseId + ':searchType" value="firstTrain" id="' + baseId + ':searchType:3"><label for="' + baseId + ':searchType:3" id="' + baseId + ':searchType:3:text">�n��</label></span>';
            buffer += '<span class="exp_lastTrain"><input type="radio" id="' + baseId + ':searchType:4" name="' + baseId + ':searchType" value="lastTrain" id="' + baseId + ':searchType:4"><label for="' + baseId + ':searchType:4" id="' + baseId + ':searchType:4:text">�I�d</span></span>';
            buffer += '</span>';
            buffer += '<span id="' + baseId + ':searchType:average">';
            buffer += '<span class="exp_plain"><input type="radio" id="' + baseId + ':searchType:5" name="' + baseId + ':searchType" value="plain" id="' + baseId + ':searchType:5"><label for="' + baseId + ':searchType:5" id="' + baseId + ':searchType:5:text">����</label></span>';
            buffer += '</span>';
            buffer += '</div>';
        }
        buffer += '<div class="exp_dateTime exp_clearfix">';
        buffer += '<div id="' + baseId + ':calendar" style="display:none;"></div>';
        if (agent == 1) {
            buffer += '<select id="' + baseId + ':date:mm" class="exp_date"></select>';
            buffer += '<select id="' + baseId + ':date:dd" class="exp_date"></select>';
        } else if (agent == 2 || agent == 3) {
            buffer += '<select id="' + baseId + ':date" class="exp_date"></select>';
        }
        buffer += '<a class="exp_cal_open" id="' + baseId + ':cal_open" href="javascript:void(0);"></a>';
        buffer += '<div id="' + baseId + ':time">';
        // ���s
        if (agent == 2) {
            buffer += '<div class="exp_separate"></div>';
        }
        buffer += '<select class="exp_time" id="' + baseId + ':timeHH">';
        for (var i = 0; i <= 23; i++) {
            buffer += '<option value="' + i + '">' + String(i) + '��</option>';
        }
        buffer += '</select>';
        buffer += '<select class="exp_time" id="' + baseId + ':timeMM">';
        for (var i = 0; i <= 59; i++) {
            buffer += '<option value="' + i + '">' + String(((i <= 9) ? '0' : '') + i) + '��</option>';
        }
        buffer += '</select>';
        buffer += '<a class="exp_setNow" id="' + baseId + ':setNow" href="javascript:void(0);"></a>';
        buffer += '</div>';
        buffer += '</div>';
        buffer += '</div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;

        // �f�t�H���g�ݒ�
        setSearchType("departure");

        // �\���ݒ�
        if (typeof type != 'undefined') {
            if (type == "dia") {
                //���E�g�p�̐ݒ�
                document.getElementById(baseId + ":searchType:average").style.display = "none";
            } else if (type == "plain") {
                document.getElementById(baseId + ":searchTypeList").style.display = "none";
                document.getElementById(baseId + ":time").style.display = "none";
                setSearchType("plain");
            }
        }

        // �C�x���g�̐ݒ�
        addEvent(document.getElementById(baseId + ":searchType:1"), "click", function () { setSearchType("departure"); });
        addEvent(document.getElementById(baseId + ":searchType:2"), "click", function () { setSearchType("arrival"); });
        addEvent(document.getElementById(baseId + ":searchType:3"), "click", function () { setSearchType("firstTrain"); });
        addEvent(document.getElementById(baseId + ":searchType:4"), "click", function () { setSearchType("lastTrain"); });
        addEvent(document.getElementById(baseId + ":searchType:5"), "click", function () { setSearchType("plain"); });
        addEvent(document.getElementById(baseId + ":cal_open"), "click", function () { changeCalendar(); });
        if (agent == 1) {
            addEvent(document.getElementById(baseId + ":date:mm"), "change", function () { changeDate(); });
        }
        addEvent(document.getElementById(baseId + ":setNow"), "click", function () { setNow(); });

        // �f�t�H���g�̓����ݒ�
        setNow();
    }

    /*
    * ���ݓ������t�H�[���ɐݒ�
    */
    function setNow() {
        // ���ݓ����̐ݒ�
        var now = new Date();
        setDate(now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate());
        document.getElementById(baseId + ':timeHH').selectedIndex = now.getHours();
        document.getElementById(baseId + ':timeMM').selectedIndex = now.getMinutes();
    }

    /*
    * �N����ύX����
    */
    function changeDate() {
        var tmp_date = document.getElementById(baseId + ':date:mm').value.split("/");
        tmp_date.push(document.getElementById(baseId + ':date:dd').value);
        setDateList(tmp_date[0], tmp_date[1]);
        setDate(tmp_date.join("/"));
    }

    /*
    * ���t�ݒ���擾����
    */
    function getDate() {
        var tmp_date = new Array();
        if (agent == 1) {
            tmp_date = document.getElementById(baseId + ':date:mm').value.split("/");
            tmp_date.push(document.getElementById(baseId + ':date:dd').value);
        } else if (agent == 2 || agent == 3) {
            tmp_date = document.getElementById(baseId + ':date').value.split("/");
        }
        // ���t�ݒ�
        var buffer = "";
        buffer += tmp_date[0];
        if (parseInt(tmp_date[1], 10) >= 10) {
            buffer += parseInt(tmp_date[1], 10);
        } else {
            buffer += "0" + parseInt(tmp_date[1], 10);
        }
        if (parseInt(tmp_date[2], 10) >= 10) {
            buffer += parseInt(tmp_date[2], 10);
        } else {
            buffer += "0" + parseInt(tmp_date[2], 10);
        }
        return buffer;
    }

    /*
    * ���Ԑݒ���擾����
    */
    function getTime() {
        var hh;
        var mi;
        if (document.getElementById(baseId + ':timeHH').selectedIndex < 10) {
            hh = "0" + String(document.getElementById(baseId + ':timeHH').selectedIndex);
        } else {
            hh = String(document.getElementById(baseId + ':timeHH').selectedIndex);
        }
        if (document.getElementById(baseId + ':timeMM').selectedIndex < 10) {
            mi = "0" + String(document.getElementById(baseId + ':timeMM').selectedIndex);
        } else {
            mi = String(document.getElementById(baseId + ':timeMM').selectedIndex);
        }
        return String(hh) + String(mi);
    }

    /*
    * ���t�̐������`�F�b�N
    */
    function checkDate() {
        var tmp_date = new Array();
        if (agent == 1) {
            tmp_date = document.getElementById(baseId + ':date:mm').value.split("/");
            tmp_date.push(document.getElementById(baseId + ':date:dd').value);
        } else if (agent == 2 || agent == 3) {
            tmp_date = document.getElementById(baseId + ':date').value.split("/");
        }
        if (tmp_date.length != 3) {
            return false;
        } else if (isNaN(parseInt(tmp_date[0], 10)) || isNaN(parseInt(tmp_date[1], 10)) || isNaN(parseInt(tmp_date[2], 10))) {
            return false;
        }
        return true;
    }

    /*
    * �T����ʂ��擾
    */
    function getSearchType() {
        if (agent == 1) {
            return document.getElementById(baseId + ':searchType').value;
        } else if (agent == 2 || agent == 3) {
            for (var i = 0; i < document.getElementsByName(baseId + ':searchType').length; i++) {
                if (document.getElementsByName(baseId + ':searchType')[i].checked == true) {
                    return document.getElementsByName(baseId + ':searchType')[i].value;
                }
            }
        }
        return;
    }

    /*
    * �T����ʂɂ���Ď��Ԏw��̗L����ݒ�
    */
    function changeSearchType() {
        if (getSearchType() == "departure" || getSearchType() == "arrival") {
            document.getElementById(baseId + ':timeHH').disabled = false;
            document.getElementById(baseId + ':timeMM').disabled = false;
        } else {
            document.getElementById(baseId + ':timeHH').disabled = true;
            document.getElementById(baseId + ':timeMM').disabled = true;
        }
    }

    /*
    * �J�����_�[�Ŗ{����ݒ�
    */
    function today() {
        var now = new Date();
        setDate(now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate());
        document.getElementById(baseId + ':calendar').innerHTML = "";
        document.getElementById(baseId + ':calendar').style.display = "none";
    }

    /*
    * �J�����_�[�̌���ύX����
    */
    function changeMonth(type) {
        if (type == 'prev') {
            c_month--;
            if (c_month == 0) {
                c_year--;
                c_month = 12;
            }
        } else if (type == 'next') {
            c_month++;
            if (c_month == 13) {
                c_year++;
                c_month = 1;
            }
        }
        document.getElementById(baseId + ':c_table').innerHTML = getCalendarTable(c_year, c_month, c_date);
        document.getElementById(baseId + ':calendar').style.display = "block";

        setFunction();
    }

    /*
    * �J�����_�[�{�^�������������̓���
    */
    function changeCalendar() {
        if (document.getElementById(baseId + ':calendar').innerHTML == "") {
            openCalendar();
        } else {
            closeCalendar();
        }
    }

    /*
    * �J�����_�[�����
    */
    function closeCalendar() {
        document.getElementById(baseId + ':calendar').innerHTML = "";
        document.getElementById(baseId + ':calendar').style.display = "none";
    }

    /*
    * �J�����_�[��\������
    */
    function openCalendar() {
        var tmp_date = new Array();
        if (agent == 1) {
            tmp_date = document.getElementById(baseId + ':date:mm').value.split("/");
            tmp_date.push(document.getElementById(baseId + ':date:dd').value);
        } else if (agent == 2 || agent == 3) {
            tmp_date = document.getElementById(baseId + ':date').value.split("/");
        }
        var date;
        if (tmp_date.length != 3) {
            date = new Date();
        } else {
            try {
                date = new Date(parseInt(tmp_date[0], 10), parseInt(tmp_date[1], 10) - 1, parseInt(tmp_date[2], 10));
            } catch (e) {
                date = new Date();
            }
        }
        var buffer = '';
        // �J�����_�[�{��
        buffer += '<div class="exp_calendar" id="' + baseId + ':c_table">';
        buffer += getCalendarTable(date.getFullYear(), (date.getMonth() + 1), date.getDate());
        buffer += '</div>';
        // �f�t�H���g�̓��t�ݒ�
        c_year = date.getFullYear();
        c_month = (date.getMonth() + 1);
        c_date = date.getDate();
        // �J�����_�[�o��
        document.getElementById(baseId + ':calendar').innerHTML = buffer;
        document.getElementById(baseId + ':calendar').style.display = "block";
        // �J�����_�[�̃{�^����ݒ�
        setFunction();
    }

    /*
    * �J�����_�[�̊e�C�x���g��ݒ�
    */
    function setFunction() {
        // �{���{�^���̃C�x���g�ݒ�
        //  addEvent(document.getElementById(baseId+":cal_today"), "click", function(){today();});
        // �O��̌��̃C�x���g�ݒ�
        addEvent(document.getElementById(baseId + ":header_prev"), "click", function () { changeMonth('prev'); });
        addEvent(document.getElementById(baseId + ":header_next"), "click", function () { changeMonth('next'); });

        // ���t�I���̃C�x���g�ݒ�
        // �O��
        for (var i = 23; i <= 31; i++) {
            addEvent(document.getElementById(baseId + ":prev:" + String(i)), "click", onEvent);
        }
        // ����
        for (var i = 1; i <= 31; i++) {
            addEvent(document.getElementById(baseId + ":this:" + String(i)), "click", onEvent);
        }
        // ����
        for (var i = 1; i <= 14; i++) {
            addEvent(document.getElementById(baseId + ":next:" + String(i)), "click", onEvent);
        }
    }

    /*
    * �C�x���g�̐U�蕪�����s��
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length == 3) {
            if (eventIdList[1] == "prev") {
                // �O���̎w��
                selectDate(-parseInt(eventIdList[2]));
            } else if (eventIdList[1] == "this") {
                // �����̎w��
                selectDate(parseInt(eventIdList[2]));
            } else if (eventIdList[1] == "next") {
                // �����̎w��
                selectDate(parseInt(eventIdList[2]) + 50);
            }
        }
    }

    /*
    * �J�����_�[�œ��t��I�񂾎��̓���
    */
    function selectDate(dd) {
        var tmp_year = c_year;
        var tmp_month = c_month;
        var tmp_day;
        // �U�蕪��
        if (dd < 0) {
            // �O�̌�
            tmp_month--;
            if (tmp_month < 1) {
                tmp_year--;
                tmp_month = 12;
            }
            tmp_day = Math.abs(dd);
        } else if (dd > 50) {
            // ����
            tmp_month++;
            if (tmp_month > 12) {
                tmp_year++;
                tmp_month = 1;
            }
            tmp_day = dd - 50;
        } else {
            tmp_day = dd;
        }
        setDate(tmp_year + "/" + tmp_month + "/" + tmp_day);
        document.getElementById(baseId + ':calendar').innerHTML = "";
        document.getElementById(baseId + ':calendar').style.display = "none";
    }

    /*
    * ���̍ŏI���𔻒肵�A�J�����_�[�ɔ��f����
    */
    function getLastDate(yyyy, mm) {
        if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
            return 30;
        } else if (mm == 2) {
            if (yyyy % 4 == 0 && (yyyy % 100 != 0 || yyyy % 400 == 0)) {
                return 29;
            } else {
                return 28;
            }
        } else {
            return 31;
        }
    }

    /*
    * �J�����_�[���e�[�u���Ƃ��Ď擾
    */
    function getCalendarTable(yyyy, mm, dd) {
        // �j���`�F�b�N�p�̕ϐ�������
        moncnt = 0;
        furi = 0;
        ck = 0;
        // ���ݓ�
        var date;
        var today = new Date();
        try {
            date = new Date(yyyy, mm - 1, dd);
        } catch (e) {
            date = new Date();
        }
        // �j���̐F�ݒ�
        var week = new Array('<span class="exp_header_sunday">��</span>', '<span class="exp_header_week">��</span>', '<span class="exp_header_week">��</span>', '<span class="exp_header_week">��</span>', '<span class="exp_header_week">��</span>', '<span class="exp_header_week">��</span>', '<span class="exp_header_saturday">�y</span>');
        var weekLineClass = new Array("calFirstWeek", "calSecWeek", "calThirWeek", "calFourWeek", "calFifWeek", "calSixWeek");
        // �J�����_�[�o�͐ݒ�
        var doc = "";
        doc += '<table>';
        doc += '<tr>';
        doc += '<td colspan="7">';
        doc += '<div class="exp_cal_header">';
        doc += '<div class="exp_prev"><a class="exp_header_prev" href="javascript:void(0);" id="' + baseId + ':header_prev"></a></div>';
        doc += '<div class="exp_title"><span class="exp_header_month">' + date.getFullYear() + "�N" + (date.getMonth() + 1) + "��" + '</span></div>';
        doc += '<div class="exp_next"><a class="exp_header_next" href="javascript:void(0);" id="' + baseId + ':header_next"></a></div>';
        doc += '</td>';
        doc += '</tr>';
        doc += '</div>';
        // �j���ݒ�
        doc += '<tr class="exp_calWeek">';
        for (var i = 0; i < week.length; i++) {
            doc += '<td>' + week[i] + '</td>';
        }
        doc += '</tr>';
        // �j���̌v�Z
        var dayOfWeek = 0;
        // �\������i
        var viewRows = 0;
        // �J�n���t�܂Ői�߂�
        var prevYear = date.getFullYear();
        var prevMonth = (date.getMonth() + 1) - 1;
        if (prevMonth == 0) {
            prevYear--;
            prevMonth = 12;
        }
        doc += '<tr class="exp_' + weekLineClass[viewRows] + '">';
        var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        for (var i = -firstDate.getDay(); i < 0; i++) {
            doc += '<td class="exp_otherday">';
            doc += '<a href="javascript:void(0);" id="' + baseId + ':prev:' + String(getLastDate(prevYear, prevMonth) + i + 1) + '">' + (getLastDate(prevYear, prevMonth) + i + 1) + '</a>';
            doc += '</td>';
            dayOfWeek++;
        }
        // ����ݒ�
        for (var i = 1; i <= getLastDate(date.getFullYear(), date.getMonth() + 1); i++) {
            // �����ɐF��t����
            if (today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == i) {
                doc += '<td class="exp_today">';
            } else {
                doc += '<td class="exp_days">';
            }
            doc += '<a class="exp_' + getDateColor(yyyy, mm, i, dayOfWeek) + '" href="javascript:void(0);" id="' + baseId + ':this:' + String(i) + '">' + String(i) + '</a>';
            doc += '</td>';
            dayOfWeek++;
            if (dayOfWeek == 7 && i != getLastDate(date.getFullYear(), date.getMonth() + 1)) {
                dayOfWeek = 0;
                viewRows++;
                doc += '</tr>';
                doc += '<tr class="exp_' + weekLineClass[viewRows] + '">';
            }
        }
        // �c��̋󔒂��Z�b�g
        var startWeek = dayOfWeek;
        var n = 1;
        var endDay = (6 - viewRows) * 7;
        for (var i = startWeek; i < endDay; i++) {
            if (dayOfWeek == 7) {
                dayOfWeek = 0;
                viewRows++;
                doc += '</tr>';
                doc += '<tr class="exp_' + weekLineClass[viewRows] + '">';
            }
            doc += '<td class="exp_otherday">';
            doc += '<a href="javascript:void(0);" id="' + baseId + ':next:' + String(n) + '">' + String(n) + '</a>';
            doc += '</td>';
            dayOfWeek++;
            n++;
        }
        doc += '</tr>';
        // �{���{�^��
        /*
        doc+='<tr>';
        doc+='<td colspan="7">';
        doc+='<a class="exp_cal_today" id="'+ baseId +':cal_today" href="javascript:void(0);"></a>';
        doc+='</td>';
        doc+='</tr>';
        */
        doc += '</table>';
        return doc;
    }

    /*
    * �J�����_�[���̕����̐F���擾
    */
    function getDateColor(yyyy, mm, i, dayOfWeek) {
        if (getNationalHoliday(yyyy, mm, i, dayOfWeek) != '') {
            return "holiday";
        } else if (dayOfWeek == 0) {
            return "sunday";
        } else if (dayOfWeek == 6) {
            return "saturday";
        } else {
            return "weekday";
        }
    }

    /*
    * �Փ��̎擾
    */
    var moncnt = 0;
    var furi = 0;
    var ck = 0;
    var Syunbunpar1 = new Array(19.8277, 20.8357, 20.8431, 21.8510);  // �t���E�H���̓��t�v�Z�p1980-2099
    var Syunbunpar2 = new Array(22.2588, 23.2588, 23.2488, 24.2488);  // �t���E�H���̓��t�v�Z�p1980-2099
    function getNationalHoliday(year, month, day, week) {
        // �ϐ��̏�����
        syuku = '';
        if (day == 1 && moncnt > 0 && !ck) moncnt = 0;

        // �n�b�s�[�}���f�[�ƐU�֋x��
        if (week == 1) {
            if (!ck) ++moncnt;
            // �U�֋x��
            // (2006�N�܂�)�u�����̏j���v�����j���ɂ�����Ƃ��́A���̗������x���Ƃ���B
            if (furi == 1 && year <= 2006) {
                syuku = '�U�֋x��';   // �U�փt���O�������Ă�����x��
                furi = 0;
            }
            // ��2���j
            if (moncnt == 2) {
                if (month == 1) { syuku = '���l�̓�'; }    // 1��
                if (month == 10) { syuku = '�̈�̓�'; }    // 10��
            }
            // ��3���j
            if (moncnt == 3) {
                if (year >= 2003 && month == 7) { syuku = '�C�̓�'; }   // 7��(2003�`)
                if (year >= 2003 && month == 9) { syuku = '�h�V�̓�'; } // 9��(2003�`)
            }
        }

        // �t���̓��E�H���̓�
        var i, tyear;
        if ((year >= 1851) && (year <= 1899)) i = 0;
        else if ((year >= 1900) && (year <= 1979)) i = 1;
        else if ((year >= 1980) && (year <= 2099)) i = 2;
        else if ((year >= 2100) && (year <= 2150)) i = 3;
        else i = 4;   // �͈͊O
        if (i < 4) {
            if (i < 2) tyear = 1983; else tyear = 1980;
            tyear = (year - tyear);
            if (month == 3) {      // �t���̓�
                if (day == Math.floor(Syunbunpar1[i] + 0.242194 * tyear - Math.floor((tyear + 0.1) / 4))) syuku = '�t���̓�';
            } else if (month == 9) { // �H���̓�
                if (day == Math.floor(Syunbunpar2[i] + 0.242194 * tyear - Math.floor((tyear + 0.1) / 4))) syuku = '�H���̓�';
            }
        }

        // ���̑��̏j��
        if (month == 1 && day == 1) { syuku = '����'; }            //  1�� 1��
        if (month == 2 && day == 11) { syuku = '�����L�O�̓�'; }    //  2��11��
        if (month == 4 && day == 29 && year <= 2006) { syuku = '�݂ǂ�̓�'; }      //  4��29��(2006�N�܂�)
        if (month == 4 && day == 29 && year >= 2007) { syuku = '���a�̓�'; }        //  4��29��(2007�N����)
        if (month == 5 && day == 3) { syuku = '���@�L�O��'; }      //  5�� 3��
        if (month == 5 && day == 4 && year >= 2007) { syuku = '�݂ǂ�̓�'; }      //  5�� 4��(2007�N����)
        if (month == 5 && day == 5) { syuku = '���ǂ��̓�'; }      //  5�� 5��
        if (month == 11 && day == 3) { syuku = '�����̓�'; }       // 11�� 3��
        if (month == 11 && day == 23) { syuku = '�ΘJ���ӂ̓�'; }   // 11��23��
        if (month == 12 && day == 23) { syuku = '�V�c�a����'; }     // 12��23��
        if (year < 2003 && month == 7 && day == 20) { syuku = '�C�̓�'; }   // 7��20��(�`2002)
        if (year < 2003 && month == 9 && day == 15) { syuku = '�h�V�̓�'; } //  9��15��(�`2002)

        // �U�֋x��
        // (2007�N����)�u�����̏j���v�����j���ɓ�����Ƃ��́A���̓���ɂ����Ă��̓��ɍł��߂��u�����̏j���v�łȂ������x���Ƃ���B
        if (furi == 1 && syuku == '' && year >= 2007) {
            syuku = '�U�֋x��';   // �U�փt���O�������Ă�����x��
            furi = 0;
        } else if (furi == 1 && syuku != '' && year >= 2007) {
            furi = 1;             // �U�փt���O�������Ă��ďj���̏ꍇ�͐U�փt���O�𗧂Ă�
        } else if (week == 0 && syuku != '') {
            furi = 1;             // ���j�ŏj���̏ꍇ�͐U�փt���O�𗧂Ă�
        } else {
            furi = 0;
        }

        // �����̋x��(�j���ɋ��܂ꂽ����)
        // (2006�N�܂�)���̑O���y�ї������u�����̏j���v�ł�����i���j���ɂ�������y�ёO���ɋK�肷��x���ɂ�������������B�j�́A�x���Ƃ���B
        // (2007�N����)���̑O���y�ї������u�����̏j���v�ł�����i�u�����̏j���v�łȂ����Ɍ���B�j�́A�x���Ƃ���B
        if ((week > 0 && syuku == '' && !ck && year <= 2006) || (syuku == '' && !ck && syuku != '�U�֋x��' && year >= 2007)) {
            ck = 1;  // �ċA�Ăяo���ł�����ʂ�Ȃ��悤�ɂ���
            // �O���Ǝ������j�����m�F
            // �P���Ɩ������j���̏ꍇ�͂Ȃ��̂œ��ɂ��͒P���ɂP�𑝌�����
            // �j���̐ݒ�
            bweek = week - 1; if (bweek < 0) bweek = 6;
            aweek = week + 1; if (bweek > 6) bweek = 0;
            if (getNationalHoliday(year, month, day - 1, bweek) && getNationalHoliday(year, month, day + 1, aweek)) {
                syuku = '�����̋x��';
            }
            ck = 0;  // �t���O�̏�����
        }

        return syuku;
    }

    /*
    * �T����ʂ��O�����琧��
    */
    function setSearchType(str) {
        if (agent == 1) {
            for (var i = 0; i < 5; i++) {
                document.getElementById(baseId + ':searchType:' + String(i + 1) + ':active').style.display = 'none';
                document.getElementById(baseId + ':searchType:' + String(i + 1) + ':none').style.display = 'block';
            }
            document.getElementById(baseId + ':searchType').value = str;
            if (str == "departure") {
                document.getElementById(baseId + ':searchType:' + String(1) + ':active').style.display = 'block';
                document.getElementById(baseId + ':searchType:' + String(1) + ':none').style.display = 'none';
            } else if (str == "arrival") {
                document.getElementById(baseId + ':searchType:' + String(2) + ':active').style.display = 'block';
                document.getElementById(baseId + ':searchType:' + String(2) + ':none').style.display = 'none';
            } else if (str == "firstTrain") {
                document.getElementById(baseId + ':searchType:' + String(3) + ':active').style.display = 'block';
                document.getElementById(baseId + ':searchType:' + String(3) + ':none').style.display = 'none';
            } else if (str == "lastTrain") {
                document.getElementById(baseId + ':searchType:' + String(4) + ':active').style.display = 'block';
                document.getElementById(baseId + ':searchType:' + String(4) + ':none').style.display = 'none';
            } else if (str == "plain") {
                document.getElementById(baseId + ':searchType:' + String(5) + ':active').style.display = 'block';
                document.getElementById(baseId + ':searchType:' + String(5) + ':none').style.display = 'none';
            }
        } else if (agent == 2 || agent == 3) {
            if (str == "departure") {
                document.getElementsByName(baseId + ':searchType')[0].checked = true;
            } else if (str == "arrival") {
                document.getElementsByName(baseId + ':searchType')[1].checked = true;
            } else if (str == "firstTrain") {
                document.getElementsByName(baseId + ':searchType')[2].checked = true;
            } else if (str == "lastTrain") {
                document.getElementsByName(baseId + ':searchType')[3].checked = true;
            } else if (str == "plain") {
                document.getElementsByName(baseId + ':searchType')[4].checked = true;
            }
        }
        changeSearchType();
    }

    /*
    * ���t���O������ݒ�
    */
    function setDate(date) {
        var yyyy, mm, dd;
        if (date.length == 8 && !isNaN(date)) {
            yyyy = date.substr(0, 4).replace(new RegExp('^0+'), '');
            mm = date.substr(4, 2).replace(new RegExp('^0+'), '');
            dd = date.substr(6, 2).replace(new RegExp('^0+'), '');
        } else if (date.split("/").length == 3) {
            yyyy = date.split("/")[0].replace(new RegExp('^0+'), '');
            mm = date.split("/")[1].replace(new RegExp('^0+'), '');
            dd = date.split("/")[2].replace(new RegExp('^0+'), '');
            if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
                // ���t�͐��l�Ŏw�肵�Ă��������B
                return false;
            }
        } else {
            // ���t��yyyy/mm/dd�`���Ŏw�肵�Ă��������B
            return false;
        }
        if (yyyy < 1900 || yyyy > 2099) {
            // �N�̎w�肪�Ԉ���Ă��܂��B\n�N�͐���Ŏw�肵�Ă��������B
            return false;
        } else if (mm < 1 || mm > 12) {
            // ���̎w�肪�Ԉ���Ă��܂��B\n1���`12���̊ԂŎw�肵�Ă��������B
            return false;
        } else {
            if (dd < 1) {
                // ���̎w�肪�Ԉ���Ă��܂��B
                return false;
            }
            /*
            if(mm == 4 || mm == 6 || mm == 9 || mm == 11){
            if(dd<1 || dd>30){
            // ���̎w�肪�Ԉ���Ă��܂��B\n"+mm+"����1���`30���̊ԂŎw�肵�Ă��������B
            return false;
            }
            }else if(mm == 2){
            if(yyyy%4 == 0 && (yyyy%100 != 0 || yyyy%400 == 0)){
            if(dd<1 || dd>29){
            // ���̎w�肪�Ԉ���Ă��܂��B\n"+yyyy+"�N"+mm+"����1���`29���̊ԂŎw�肵�Ă��������B
            return false;
            }
            }else{
            if(dd<1 || dd>28){
            // ���̎w�肪�Ԉ���Ă��܂��B\n"+yyyy+"�N"+mm+"����1���`28���̊ԂŎw�肵�Ă��������B
            return false;
            }
            }
            }else{
            if(dd<1 || dd>31){
            // ���̎w�肪�Ԉ���Ă��܂��B\n"+mm+"����1���`31���̊ԂŎw�肵�Ă��������B
            return false;
            }
            }
            */
        }
        // ���X�g����I��
        if (agent == 1) {
            // �N��+���̏ꍇ
            if (document.getElementById(baseId + ':date:mm').options.length == 0) {
                // �܂��͔N����ݒ�
                var now = new Date();
                for (var i = now.getFullYear() - 1; i <= now.getFullYear() + 1; i++) {
                    for (var j = 1; j <= 12; j++) {
                        var tmp_option = document.createElement('option');
                        tmp_option.text = String(i) + '�N' + String(j) + '��';
                        tmp_option.value = String(i) + '/' + String(j);
                        document.getElementById(baseId + ':date:mm').add(tmp_option);
                    }
                }
            }
            var refrech = false;
            var check = false; ;
            for (var i = 0; i < document.getElementById(baseId + ':date:mm').options.length; i++) {
                if (document.getElementById(baseId + ':date:mm').options.item(i).value == String(yyyy) + "/" + String(mm)) {
                    check = true;
                    if (document.getElementById(baseId + ':date:mm').selectedIndex != i) {
                        document.getElementById(baseId + ':date:mm').selectedIndex = i;
                        refrech = true;
                    }
                }
            }
            if (!check) {
                // �ΏۊO�̓��t
                return false;
            }
            // �J�����_�[���Đݒ�
            if (refrech) {
                setDateList(yyyy, mm);
            }
            for (var i = 0; i < document.getElementById(baseId + ':date:dd').options.length; i++) {
                if (document.getElementById(baseId + ':date:dd').options.item(i).value == String(dd)) {
                    document.getElementById(baseId + ':date:dd').selectedIndex = i;
                    return true;
                }
            }
            // ���݂��Ȃ����t�̏ꍇ�́A�ŏI����ݒ�
            document.getElementById(baseId + ':date:dd').selectedIndex = document.getElementById(baseId + ':date:dd').options.length - 1;
        } else if (agent == 2 || agent == 3) {
            // �����̏ꍇ
            for (var i = 0; i < document.getElementById(baseId + ':date').options.length; i++) {
                if (document.getElementById(baseId + ':date').options.item(i).value == String(yyyy) + "/" + String(mm) + "/" + String(dd)) {
                    document.getElementById(baseId + ':date').selectedIndex = i;
                    return true;
                }
            }
            // ���X�g���Ȃ��̂ŁA�J�����_�[���Đݒ�
            while (document.getElementById(baseId + ':date').lastChild) {
                document.getElementById(baseId + ':date').removeChild(document.getElementById(baseId + ':date').lastChild);
            }
            // ���X�g��ݒ�
            var calender_limit = 1;
            var week = new Array("��", "��", "��", "��", "��", "��", "�y");
            var tmp_month = mm - calender_limit;
            if (tmp_month < 1) { yyyy--; tmp_month += 12; }
            for (var i = 0; i < (calender_limit * 2) + 1; i++) {
                for (var j = 1; j <= getLastDate(yyyy, tmp_month); j++) {
                    var tmp_option = document.createElement('option');
                    tmp_option.text = String(tmp_month) + '��' + String(j) + '��(' + week[new Date(yyyy, tmp_month - 1, j).getDay()] + ')';
                    tmp_option.value = String(yyyy) + '/' + String(tmp_month) + '/' + String(j);
                    document.getElementById(baseId + ':date').appendChild(tmp_option);
                }
                tmp_month++;
                if (tmp_month > 12) { yyyy++; tmp_month = 1; }
            }
            for (var i = 0; i < document.getElementById(baseId + ':date').options.length; i++) {
                if (document.getElementById(baseId + ':date').options.item(i).value == String(yyyy) + "/" + String(mm) + "/" + String(dd)) {
                    document.getElementById(baseId + ':date').selectedIndex = i;
                    return true;
                }
            }
        }
    }

    /*
    * ���t�̃��X�g���C��
    */
    function setDateList(yyyy, mm) {
        while (document.getElementById(baseId + ':date:dd').lastChild) {
            document.getElementById(baseId + ':date:dd').removeChild(document.getElementById(baseId + ':date:dd').lastChild);
        }
        // ���X�g��ݒ�
        var calender_limit = 1;
        var week = new Array("��", "��", "��", "��", "��", "��", "�y");
        for (var j = 1; j <= getLastDate(yyyy, mm); j++) {
            var tmp_option = document.createElement('option');
            tmp_option.text = String(j) + '��(' + week[new Date(yyyy, mm - 1, j).getDay()] + ')';
            tmp_option.value = String(j);
            document.getElementById(baseId + ':date:dd').add(tmp_option);
        }
    }

    /*
    * ���Ԃ��O������ݒ�
    */
    function setTime(time) {
        if (time.length == 4 && time.indexOf(":") == -1) {
            document.getElementById(baseId + ':timeHH').selectedIndex = parseInt(time.substr(0, 2), 10);
            document.getElementById(baseId + ':timeMM').selectedIndex = parseInt(time.substr(2, 2), 10);
        } else if (time.indexOf(":") != -1) {
            var timeList = time.split(":");
            if (timeList.length == 2) {
                document.getElementById(baseId + ':timeHH').selectedIndex = parseInt(timeList[0], 10);
                document.getElementById(baseId + ':timeMM').selectedIndex = parseInt(timeList[1], 10);
            }
        }
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == String("agent").toLowerCase()) {
            agent = value;
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.dispDateTime = dispDateTime;
    this.checkDate = checkDate;
    this.getDate = getDate;
    this.getTime = getTime;
    this.getSearchType = getSearchType;
    this.setSearchType = setSearchType;
    this.setDate = setDate;
    this.setTime = setTime;
    this.openCalendar = openCalendar;
    this.closeCalendar = closeCalendar;
    this.setConfigure = setConfigure;

    /*
    * �萔���X�g
    */
    this.SEARCHTYPE_DEPARTURE = "departure";
    this.SEARCHTYPE_ARRIVAL = "arrival";
    this.SEARCHTYPE_FIRSTTRAIN = "firstTrain";
    this.SEARCHTYPE_LASTTRAIN = "lastTrain";
    this.SEARCHTYPE_PLAIN = "plain";
    this.SEARCHTYPE_DIA = "dia";

    // �[������
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
