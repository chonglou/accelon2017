const createFigure=function({cm,cor,start,end,id,tabid,target,actions,fields}){
	const dom=document.createElement("span");
	dom.innerHTML=target;
	dom.className="inlinesvg";
	const ch=cm.getLine(end.line).length;
	return cm.markText(start,{line:end.line,ch},{replacedWith:dom,handleMouseEvents:true});
}
module.exports=createFigure;