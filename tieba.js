(function (doneCount) {
    for (user of Array.from(document.getElementsByClassName('user'))){
        $.post("http://tieba.baidu.com/i/commit", {
            cmd: "add_black_list",
            portrait: user.attributes.portrait.value,
            tbs: PageData.tbs,
            ie: "utf-8"
        },function(){
            doneCount++;
            if (doneCount==20){
                $('#search_list').load(document.URL +  ' #search_list');
                 arguments.callee.celler(0);
            }
        })
    }
})(0);
