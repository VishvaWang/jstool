//职教云刷课脚本
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
                                    (function (c) {
                                        var cellBase = "http://zjy2.icve.com.cn/common/Directory/";
                                        if (c.stuCellPercent < 100) {//进度小于100
                                            function videopost(info,handleResult) {
                                                $.post(cellBase +//stuStudyNewlyTime等于AudioVideoLong
                                                    "stuProcessCellLog?" +
                                                    "courseOpenId=" + course.courseOpenId + "&" +
                                                    "openClassId=" + course.openClassId + "&" +
                                                    "picNum=0&" +
                                                    "studyNewlyTime=" + info.courseCell.AudioVideoLong + "&" +
                                                    "studyNewlyPicNum=0&" +
                                                    "token=" + info.guIdToken + "&" +
                                                    "cellLogId=" + info.cellLogId + "&" +
                                                    "cellId=" + info.courseCell.Id,handleResult, 'json');
                                            }
                                            function otherpost(info,handleResult) {
                                                var num = info.courseCell.PageCount;
                                                $.post(cellBase +
                                                    "stuProcessCellLog?" +
                                                    "courseOpenId=" + course.courseOpenId + "&" +
                                                    "openClassId=" + course.openClassId + "&" +
                                                    "picNum=" + num + "&" +
                                                    "studyNewlyTime=0&" +
                                                    "studyNewlyPicNum=" + num + "&" +
                                                    "token=" + info.guIdToken + "&" +
                                                    "cellLogId=" + info.cellLogId + "&" +
                                                    "cellId=" + c.Id, handleResult, 'json');
                                            }
                                            function handle(info,post) {
                                                function check (cellId,startpercent,result) {
                                                    var cellBase = "http://zjy2.icve.com.cn/common/Directory/";
                                                    $.post(cellBase +
                                                        "viewDirectory?" +
                                                        "courseOpenId=" + course.courseOpenId + "&" +
                                                        "openClassId=" + course.openClassId + "&" +
                                                        "flag=s&" +
                                                        "moduleId=" + m.id + "&" +
                                                        "cellId=" + cellId, function (i) {
                                                        if (i.cellPercent<100) {
                                                            // console.log(i.courseCell.CellName+'未能一次完成'+ ' cell id:'+i.courseCell.Id+'类型:'+i.courseCell.CategoryName+'起始进度'+startpercent+'当前进度：'+i.cellPercent+(' 本次完成：'+(i.cellPercent-startpercent)).slice(0,10))
                                                            // console.log(result.msg)
                                                            handle(i,post)
                                                        }
                                                    },'json');
                                                }

                                                post(info,function (r){
                                                    // if (r.code == 1) {
                                                    //     console.log(info.courseCell.Id+'Yes'+ Date.now().toLocaleString());
                                                    // } else {
                                                    //     console.log(info.courseCell.Id+'No'+ Date.now().toLocaleString());
                                                    // }
                                                    check(info.courseCell.Id,info.cellPercent,r);
                                                })
                                            }
                                            function handlecell(info,count) {
                                                if (count <= 3) {
                                                    if (info.code != 1) {
                                                        getInfoAndHandle(handlecell,count + 1);
                                                    } else {
                                                        var type=info.courseCell.CategoryName;
                                                        if (type == "视频") {
                                                            handle(info,videopost)
                                                        } else {
                                                            handle(info,otherpost)
                                                        }
                                                    }
                                                }
                                            }
                                            function getInfoAndHandle(handlecell,count) {
                                                $.post(cellBase +
                                                    "viewDirectory?" +
                                                    "courseOpenId=" + course.courseOpenId + "&" +
                                                    "openClassId=" + course.openClassId + "&" +
                                                    "flag=s&" +
                                                    "moduleId=" + m.id + "&" +
                                                    "cellId=" + c.Id,function (info) {
                                                        handlecell(info,count)
                                                }, 'json')
                                            }

                                            getInfoAndHandle(handlecell,0)
                                        }
                                    })(c)
                                }
                            }, 'json');
                        }
                    }, 'json');
                }
            }, 'json');
        })(course)
    }
},'json');
