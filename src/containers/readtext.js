const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;
const {openCorpus}=require("ksana-corpus");
const {CorpusView}=require("ksana-corpus-view");
const {ptr,def,note,link}=require("accelon2016/decorators");
const quoteCopy=require("../unit/quotecopy");
const fetchArticle=function(cor,address,cb){
	const article=cor.articleOf(address);
  if (article){
  	const articleFields=cor.meta.articleFields||[];
  	//,title:cor.getTitle(address)

    cor.getArticleTextTag( article.at, articleFields , (res)=>{
  	    cb({address,article,rawlines:res.text,fields:res.fields});
    });	
	}
}

class ReadText extends React.Component {
  constructor(props) {
  	super(props);
    this.state= {article:null}
  }
	componentWillMount(){
		const cor=openCorpus(this.props.activeCorpus);
		fetchArticle(cor,this.props.params.a,(states)=>{
			this.setState(states);
		})
	}
	updateArticleByAddress(address){
		const cor=openCorpus(this.props.activeCorpus);
		const addressH=cor.stringify(address);
		this.props.setA(addressH);
	}

	render(){
		if (!this.state.article) {
			return E("div",{},"loading");
		}
		return E(CorpusView,{address:this.props.params.a,
			decorators:{ptr,def,note,link},
			corpus:this.props.activeCorpus,
			article:this.state.article,
			rawlines:this.state.rawlines,
			copyText:quoteCopy,
			fields:this.state.fields,
			updateArticleByAddress:this.updateArticleByAddress.bind(this),
			showPageStart:true,
			theme:"ambiance"
		});
	}
}

module.exports=ReadText;