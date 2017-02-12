const {parseRoute}=require("../unit/hashtag");

const {searchq,_openCorpus,setActiveCorpus}=require("./corpus");
const {defaultCorpus}=require("../appconfig");

const execURL=function() {
	return (dispatch,getState) =>{
		var hash=window.location.hash;
		if (hash.match(/%[0-9A-Fa-f]/)) {
			hash=decodeURIComponent(hash);
		}
		const params=parseRoute(hash);
		const p=getState().params;
		const corpus=params.c;
		if (params.c!=getState().activeCorpus) {
			const setActive=true;
			_openCorpus(params.c||defaultCorpus,setActive,params,dispatch,getState);
		}
	}
}
module.exports={execURL};