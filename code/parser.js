function getTimes(TimeConf={
}) {
    function getTime(conf) {
        let courseSum = conf.courseSum;
        let startTime = conf.startTime;
        let oneCourseTime = conf.oneCourseTime;
        let shortRestingTime = conf.shortRestingTime;

        let longRestingTimeBegin = conf.longRestingTimeBegin;
        let longRestingTime = conf.longRestingTime;
        let lunchTime = conf.lunchTime;
        let dinnerTime = conf.dinnerTime;
        let abnormalClassTime = conf.abnormalClassTime;
        let abnormalRestingTime = conf.abnormalRestingTime;

        let result = [];
        let studyOrRestTag = true;
        let timeSum = startTime.slice(-2) * 1 + startTime.slice(0, -2) * 60;

        let classTimeMap = new Map();
        let RestingTimeMap = new Map();
        if (abnormalClassTime !== undefined) abnormalClassTime.forEach(time => { classTimeMap.set(time.begin, time.time) });
        if (longRestingTimeBegin !== undefined) longRestingTimeBegin.forEach(time => RestingTimeMap.set(time, longRestingTime));
        if (lunchTime !== undefined) RestingTimeMap.set(lunchTime.begin, lunchTime.time);
        if (dinnerTime !== undefined) RestingTimeMap.set(dinnerTime.begin, dinnerTime.time);
        if (abnormalRestingTime !== undefined) abnormalRestingTime.forEach(time => { RestingTimeMap.set(time.begin, time.time) });

        for (let i = 1, j = 1; i <= courseSum * 2; i++) {
            if (studyOrRestTag) {
                let startTime = ("0" + Math.floor(timeSum / 60)).slice(-2) + ':' + ('0' + timeSum % 60).slice(-2);
                timeSum += classTimeMap.get(j) === undefined ? oneCourseTime : classTimeMap.get(j);
                let endTime = ("0" + Math.floor(timeSum / 60)).slice(-2) + ':' + ('0' + timeSum % 60).slice(-2);
                studyOrRestTag = false;
                result.push({
                    section: j++,
                    startTime: startTime,
                    endTime: endTime
                })
            }
            else {
                timeSum += RestingTimeMap.get(j - 1) === undefined ? shortRestingTime : RestingTimeMap.get(j - 1);
                studyOrRestTag = true;
            }
        }
        return result;
    }

    let ATimes = getTime(TimeConf);
    console.log("时间:\n",ATimes)
    return ATimes;
}

async function scheduleTimer() {

    let timeJson = {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: true, // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 2, // 晚间课程节数：[0, 10]之间的整数
        sections: []
    }
    let TimeConf = {
        courseSum: 10, //课程节数： 10节
        startTime: '830',  //上课时间: 8:30
        oneCourseTime: 45, //一节课的时间: 45分钟
        longRestingTime: 20,  //大课间
        shortRestingTime: 5,  //小课间
        longRestingTimeBegin: [2,6],  //大课间开始时间
        lunchTime: {begin: 4, time: 120},  //午休
        dinnerTime: {begin: 8, time: 90},  //晚休
        abnormalRestingTime: [{begin: 9, time: 0},{begin: 10, time: 10},{begin: 11, time: 0}]

    }
    timeJson.sections = getTimes(TimeConf)

    if(timeJson.sections.length==0) timeJson = {}
    return timeJson
}