var patterns={
 bold:/\{([^k]+?)\}/g,
 kai:/\{k[\s\S]+?k\}/g,
 taisho:/@t(\d+p\d+[a-c\-0-9]*)/g,
 taisho_full:/@t(\d+p\d+[a-c][0-9]+)/g,
 yinshun_note:/@y([A-Z][0-9]+)#([0-9]+)/g,
 taisho_app:/@a(\d+p.+)/g,
 svg:/\{svg\|(.+?),([\s\S]+?)\|svg\}/g
}
const markLine=function(doc,i,visitlink){
	if (i>doc.lineCount())return;
	var line=doc.getLine(i);

	line.replace(patterns.taisho,function(m,taisho,idx){
		const link=document.createElement("span");
		var target=taisho;
		if (!m.match(patterns.taisho_full)){
			target+="a01";//page without line number
		}
		link.innerHTML="大正"+taisho;
		link.className="link"
		link.onclick=visitlink;
		link.dataset.target=target;
		doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},{replacedWith:link});
	})

	line.replace(patterns.taisho_app,function(m,taisho,idx){
		const link=document.createElement("span");
		var target=taisho;
		link.innerHTML=taisho;
		link.className="taisho_app";
		link.dataset.target=target;
		doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length+1},{replacedWith:link});
	})

	line.replace(patterns.yinshun_note,function(m,filename,pg,idx){
		const link=document.createElement("span");
		link.innerHTML="《印順導師大智度論筆記》"+filename;
		link.className="link"
		link.onclick=visitlink;
		link.dataset.target="http://ya.ksana.tw/mpps_yinshun_note_img/"+filename.charAt(0)+"/"+filename+".jpg";
		doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length+1},{replacedWith:link});
	})

	line.replace(patterns.bold,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+1},{line:i,ch:idx+m.length-1},
			{className:"bold"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+1},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-1},{line:i,ch:idx+m.length},{className:"hide"});
	});


}

var markNoteLines=function(doc,from,to,openLink,cor){
	const visitlink=function(e){
		const url=e.target.dataset.target;
		if (url.substr(0,7)==="http://") {
			window.open(url);
		} else {
			openLink("taisho@"+url);
		}
	}

	var M=doc.findMarks({line:from,ch:0},{line:to,ch:65536});
	M.forEach(function(m){m.clear()});

	for (var i=from;i<to+1;i++) {
		markLine(doc, i, visitlink);
	}

	const footnotetext=doc.getValue();
	footnotetext.replace(patterns.kai,function(m,idx,self){
		const start=doc.posFromIndex(idx);
		const end=doc.posFromIndex(idx+m.length);
		var marker=doc.markText({line:start.line,ch:start.ch+2},{line:end.line,ch:end.ch-2},
			{className:"kai"});

		//hide control code
		doc.markText({line:start.line,ch:start.ch},{line:start.line,ch:start.ch+2},{className:"hide"});
		doc.markText({line:end.line,ch:end.ch-2},{line:end.line,ch:end.ch},{className:"hide"});
	});

	const replacesvg=function(from,to,svgcontent){
		const replacedWith=document.createElement("div");
		replacedWith.innerHTML=svgcontent;
		const start=doc.posFromIndex(from);
		const end=doc.posFromIndex(to);
		doc.markText(start,end,{replacedWith});
	}
	footnotetext.replace(patterns.svg,function(mm,fn,text,idx){
		const m=fn.match(/M(\d+)\.(\d+)/);
		if (!m)return;
		const juan=parseInt(m[1],10),seq=m[2];
		cor.getArticleField(juan,"footnotesvg",function(field){
			const svgs=field[0].value;
			for(var i=0;i<svgs.length;i++) {
				if (svgs[i].indexOf(fn)>-1) {
					replacesvg(idx,idx+mm.length,svgs[i]);
					break;
				}
			}
		});
	}.bind(this));
}
module.exports={markNoteLines};