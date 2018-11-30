$.post("http://zjy2.icve.com.cn/student/learning/" +
    "getLearnningCourseList",function (p) {//获取课程列表
    var base = "http://zjy2.icve.com.cn/study/process/";//设置基础url
    for (course of p.courseList) {//遍历课程
        (function (course) {
            $.post(base +
                "getProcessList?" +
                "courseOpenId=" + course.courseOpenId + "&" +
                "openClassId=" + course.openClassId, function (p) {//获取模块列表的包装类
                for (m of p.progress.moduleList) {//遍历模块列表
                    console.log(m.name)
                    $.post(base +
                        "getTopicByModuleId?" +
                        "courseOpenId=" + course.courseOpenId + "&" +
                        "moduleId=" + m.id, function (p) {//根据模块id获取标题列表包装类
                        for (t of p.topicList) {//遍历标题列表
                            $.post(base +
                                "getCellByTopicId?" +
                                "courseOpenId=" + course.courseOpenId + "&" +
                                "openClassId=" + course.openClassId + "&" +
                                "topicId=" + t.id, function (p) {//根据标题id获取细胞列表包装类 ??? 神他妈变量名
                                for (c of p.cellList) {//遍历细胞列表
                                    var cellBase = "http://zjy2.icve.com.cn/common/Directory/";
                                    if (c.stuCellPercent < 100) {
                                        $.post(cellBase +
                                            "viewDirectory?" +
                                            "courseOpenId=" + course.courseOpenId + "&" +
                                            "openClassId=" + course.openClassId + "&" +
                                            "flag=s&" +
                                            "moduleId=" + m.id + "&" +
                                            "cellId=" + c.Id, function (i) {//i = information 根据细胞id获取更多相关信息
                                            var type = i.courseCell.CategoryName
                                            if (type == "视频") {
                                                $.post(cellBase +//stuStudyNewlyTime等于AudioVideoLong
                                                    "stuProcessCellLog?" +
                                                    "courseOpenId=" + course.courseOpenId + "&" +
                                                    "openClassId=" + course.openClassId + "&" +
                                                    "picNum=0&" +
                                                    "studyNewlyTime=" + i.courseCell.AudioVideoLong + "&" +
                                                    "studyNewlyPicNum=0&" +
                                                    "token=" + i.guIdToken + "&" +
                                                    "cellLogId=" + i.cellLogId + "&" +
                                                    "cellId=" + c.Id, function (r) {// r =result 返回执行结果
                                                }, 'json');
                                            } else {
                                                var num = i.courseCell.PageCount;
                                                $.post(cellBase +
                                                    "stuProcessCellLog?" +
                                                    "courseOpenId=" + course.courseOpenId + "&" +
                                                    "openClassId=" + course.openClassId + "&" +
                                                    "picNum=" + num + "&" +
                                                    "studyNewlyTime=0&" +
                                                    "studyNewlyPicNum=" + num + "&" +
                                                    "token=" + i.guIdToken + "&" +
                                                    "cellLogId=" + i.cellLogId + "&" +
                                                    "cellId=" + c.Id, function (r) {

                                                }, 'json');
                                            }
                                        }, 'json')
                                    }
                                }
                            }, 'json');
                        }
                    }, 'json');
                }
            }, 'json');
        })(course)
    }
},'json')
