const {UPDATE_EXCLUDE,INCLUDE_ALL,EXCLUDE}=require("../actions/filter");
const {UPDATE_HITS}=require("../actions/grouping");

module.exports=function articlegroup(state = {} , action = {}) {
	const A=action;
	var newstate=state;
	if (A.corpus && !state[A.corpus]) {
		newstate=Object.assign({},state,{[A.corpus]:{hits:[],exclude:[]}});
	}
	
	if (UPDATE_HITS===A.type)  {
		const exclude=state[A.corpus].exclude;
		const hits=A.hits;
		newstate=Object.assign({},newstate,{[A.corpus]:{hits,exclude}});
	} else if (UPDATE_EXCLUDE===A.type) {
		const exclude=state[A.corpus].exclude.slice();
		exclude[A.group]=A.value;
		const hits=state[A.corpus].hits;
		newstate=Object.assign({},newstate,{[A.corpus]:{hits,exclude}});		
	} else if (INCLUDE_ALL===A.type) {
		const hits=state[A.corpus].hits;
		newstate=Object.assign({},newstate,{[A.corpus]:{hits,exclude:[]}});
	} else if (EXCLUDE===A.type) {
		const hits=state[A.corpus].hits;
		const exclude=A.groups;
		newstate=Object.assign({},newstate,{[A.corpus]:{hits,exclude}});
	}

	return newstate;
}
