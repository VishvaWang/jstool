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
                                    (function (c,check) {
                                        var cellBase = "http://zjy2.icve.com.cn/common/Directory/";
                                        if (c.stuCellPercent < 100) {//进度小于100
                                            function forvideo(info) {
                                                for (viewtime = info.stuCellViewTime; viewtime < info.courseCell.AudioVideoLong; viewtime += 5) {//浏览时长需大于视频时长
                                                    console.log(info.courseCell.CellName+viewtime)
                                                    $.post(cellBase +//stuStudyNewlyTime等于AudioVideoLong
                                                     "stuProcessCellLog?" +
                                                     "courseOpenId=" + course.courseOpenId + "&" +
                                                     "openClassId=" + course.openClassId + "&" +
                                                     "picNum=0&" +
                                                     "studyNewlyTime=" + info.courseCell.AudioVideoLong + "&" +
                                                     "studyNewlyPicNum=0&" +
                                                     "token=" + info.guIdToken + "&" +
                                                     "cellLogId=" + info.cellLogId + "&" +
                                                     "cellId=" + info.courseCell.Id, function (r) {// r =result 返回执行结果
                                                 }, 'json');
                                            }
                                                check(c.Id,info.cellPercent);
                                            }
                                            function forother(info) {
                                                $.post(cellBase +
                                                    "stuProcessCellLog?" +
                                                    "courseOpenId=" + course.courseOpenId + "&" +
                                                    "openClassId=" + course.openClassId + "&" +
                                                    "picNum=" + num + "&" +
                                                    "studyNewlyTime=0&" +
                                                    "studyNewlyPicNum=" + num + "&" +
                                                    "token=" + info.guIdToken + "&" +
                                                    "cellLogId=" + info.cellLogId + "&" +
                                                    "cellId=" + c.Id, function (r) {
                                                    check(c.Id,info.cellPercent)
                                                }, 'json');
                                            }
                                            function handlecell(info) {
                                                var type=info.courseCell.CategoryName
                                                if (type == "视频") {
                                                    (function (i) {
                                                        for (viewtime = i.stuCellViewTime; viewtime < i.courseCell.AudioVideoLong; viewtime += 5) {//浏览时长需大于视频时长
                                                            console.log(i.courseCell.CellName+viewtime)
                                                            $.post(cellBase +//stuStudyNewlyTime等于AudioVideoLong
                                                                "stuProcessCellLog?" +
                                                                "courseOpenId=" + course.courseOpenId + "&" +
                                                                "openClassId=" + course.openClassId + "&" +
                                                                "picNum=0&" +
                                                                "studyNewlyTime=" + i.courseCell.AudioVideoLong + "&" +
                                                                "studyNewlyPicNum=0&" +
                                                                "token=" + i.guIdToken + "&" +
                                                                "cellLogId=" + i.cellLogId + "&" +
                                                                "cellId=" + i.courseCell.Id, function (r) {// r =result 返回执行结果
                                                            }, 'json');
                                                        }
                                                        check(c.Id,i.cellPercent);
                                                    })(info)
                                                } else {
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
                                                        "cellId=" + c.Id, function (r) {
                                                        check(c.Id,info.cellPercent)
                                                    }, 'json');
                                                }
                                            }

                                            $.post(cellBase +
                                                "viewDirectory?" +
                                                "courseOpenId=" + course.courseOpenId + "&" +
                                                "openClassId=" + course.openClassId + "&" +
                                                "flag=s&" +
                                                "moduleId=" + m.id + "&" +
                                                "cellId=" + c.Id, function (info) {//info = information 根据获取的细胞信息处理

                                                if (info.code == 1) {
                                                    handlecell(info)
                                                } else {
                                                    // console.log(c.cellName+'获取cell信息出错,尝试重新获取'+' cell id:'+c.Id)
                                                    $.post(cellBase +
                                                        "viewDirectory?" +
                                                        "courseOpenId=" + course.courseOpenId + "&" +
                                                        "openClassId=" + course.openClassId + "&" +
                                                        "flag=s&" +
                                                        "moduleId=" + m.id + "&" +
                                                        "cellId=" + c.Id, function (info) {//info = information 根据细胞id获取更多相关信息
                                                        if (info.code == 1) {
                                                            // console.log(c.cellName+'第二次获取cell信息成功'+' cell id:'+c.Id)
                                                            handlecell(info)
                                                        } else {
                                                            // console.log(c.cellName+' 第二次获取cell信息仍然出错,跳过该cell'+' cell id:'+c.Id)
                                                        }
                                                    }, 'json')
                                                }
                                            }, 'json')
                                        }
                                    })(c,function (cellId,startpercent) {
                                        var cellBase = "http://zjy2.icve.com.cn/common/Directory/";
                                        $.post(cellBase +
                                            "viewDirectory?" +
                                            "courseOpenId=" + course.courseOpenId + "&" +
                                            "openClassId=" + course.openClassId + "&" +
                                            "flag=s&" +
                                            "moduleId=" + m.id + "&" +
                                            "cellId=" + cellId, function (i) {
                                            if (i.cellPercent<100) {
                                                // console.log(i.cellName+'未能一次完成')
                                                console.log(i.courseCell.CellName+'未能一次完成'+ ' cell id:'+i.courseCell.Id+'类型:'+i.courseCell.CategoryName+'起始进度'+startpercent+'当前进度：'+i.cellPercent+(' 本次完成：'+(i.cellPercent-startpercent)).slice(0,10))
                                            }
                                        },'json');
                                    })
                                }
                            }, 'json');
                        }
                    }, 'json');
                }
            }, 'json');
        })(course)
    }
},'json');
