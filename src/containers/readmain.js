const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;
const {openCorpus}=require("ksana-corpus");
const {CorpusView}=require("ksana-corpus-view");
const {ptr,def,note,link}=require("accelon2016/decorators");
const figure=require("../decorators/figure");
const kepan=require("../decorators/kepan");
const quoteCopy=require("../unit/quotecopy");
const {_updateParams}=require("../actions/params");
const {getExternalField}=require("../unit/fields");
const TOCNav=require("../components/tocnav");

const fetchArticle=function(cor,address,searchresult,cb){
	const article=cor.articleOf(address);
  if (article){
  	const articleFields=cor.meta.articleFields||[];
    cor.getArticleTextTag(article.at , articleFields, (res)=>{
    	const externalFields=getExternalField(cor,article);
    	const fields=Object.assign({},res.fields,externalFields);
  	  cb({address,article,rawlines:res.text,fields});
    });	
	}
}

const styles={
	navcontainer:{position:"relative",zIndex:200},
	nav:{position:"absolute",right:100}
}

class ReadText extends React.Component {
  constructor(props) {
  	super(props);
  	const kpos=this.getCaretKPos();
    this.state= {article:null,kpos};
  }
  fetch(){
		const cor=openCorpus(this.props.activeCorpus);
		fetchArticle(cor,this.props.params.a,this.props.searchresult,(states)=>{
			if (!this._unmounted) this.setState(states);
		})  	
  }
  componentWillReceiveProps(nextProps) {
		const cor=openCorpus(this.props.activeCorpus);
  	if(cor.articleOf(this.props.params.a)!==cor.articleOf(nextProps.params.a)) {
  		this.fetch();
  	}
  }
	componentWillMount(){
		const cor=openCorpus(this.props.activeCorpus);
		this.fetch();
	}
	componentWillUnmount(){
		this._unmounted=true;
	}
	updateArticleByAddress(address){
		const cor=openCorpus(this.props.activeCorpus);
		const addressH=cor.stringify(address);
		this.props.setA(addressH);
	}
	getCaretKPos(){
		const cor=openCorpus(this.props.activeCorpus);
		const r=cor.parseRange(this.props.params.a);
		return r.start;
	}
	onCursorActivity(cm,kpos) {		
		const cor=openCorpus(this.props.activeCorpus);
		const addressH=cor.stringify(kpos);
		this.props.setA(addressH,true);
		if (!this._unmounted) this.setState({kpos});
	}
	render(){
		if (!this.state.article) {
			return E("div",{},"loading");
		}
		const caretpos=this.state.kpos;
		const navprops={caretpos,corpus:this.props.activeCorpus,onSelectItem:this.updateArticleByAddress.bind(this)};
		return E("div",{},
			E("div",{style:styles.navcontainer},
				E("div",{style:styles.nav},E(TOCNav,navprops)))

			,E(CorpusView,{address:this.props.params.a,
			decorators:{ptr,def,note,link,figure,kepan},
			corpus:this.props.activeCorpus,
			article:this.state.article,
			rawlines:this.state.rawlines,
			onCursorActivity:this.onCursorActivity.bind(this),
			copyText:quoteCopy,
			fields:this.state.fields,
			updateArticleByAddress:this.updateArticleByAddress.bind(this),
			showPageStart:true,
			setSelection:this.props.setSelection.bind(this),
			searchresult:this.props.searchresult,
			//theme:"ambiance"
			})
		);
	}
}

module.exports=ReadText;