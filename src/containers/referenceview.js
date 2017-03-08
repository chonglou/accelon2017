const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;
const {CorpusView}=require("ksana-corpus-view");
const {fetchArticle}=require("../unit/article");
const quoteCopy=require("../unit/quotecopy");
const {notarget2address}=require("../unit/taisho");
const {getAnchorAddress}=require("../unit/anchor");
const decorators=require("../decorators");
const AuxMainmenu=require("./auxmainmenu");
const mode=require("../model/mode");
const address=require("../model/address");
const corpora=require("../model/corpora");
const {observer}=require("mobx-react");
const {autorun}=require("mobx");

const styles={
	abscontainer:{position:"relative",zIndex:200},
	nav:{position:"absolute",right:100},
	menu:{position:"absolute",left:10,top:10}
}

class ReferenceView extends React.Component {
	constructor (props) {
		super(props);
		this.state={article:null,message:"",cor:null};
	}
	/*
	shouldComponentUpdate(nextProps,nextState){
		const r= nextProps.params.r&&
		 (nextProps.params.r!==params.store.r || (this.state.article&&(this.state.article.at!=nextState.article.at)));
		 return !!r;
	}
	*/
	fetchAddress(cor,addr,markups){
		if (addr) this.setState({message:"loaaddrng "+addr});

		if ( parseInt(addr,10).toString(10)==addr) {
			addr=cor.stringify(addr);
		}
		fetchArticle(cor,addr,markups,function(states){
			const r=address.store.aux;
			this.setState(Object.assign({},states,{addr,cor,message:null,r}));
		}.bind(this));
	}
	componentDidMount(){
		autorun(()=>{
			console.log("aux",address.store.aux)
		})
		this.loadtext(this.props);
	}
	loadtext(props){
		props=props||this.props;
		if (!corpora.store.corpora)return;
		if (!address.store.aux)return ;
		const r=address.store.aux.split("@");
		const corpus=r[0].toLowerCase(); //Taisho ==> taisho
		var addr=r[1];
		const cor=props.corpora[corpus];
		if (!cor) {
			//this will cause not loading bilink for the first time
			//props.openCorpus(corpus);
			return;
		}
		if (parseInt(addr,10).toString(10)==addr) {
			addr=cor.stringify(addr);
		}
		const range=cor.parseRange(addr);
		const markups=props.corpusmarkups[corpus];

		if (!range.start) {
			const a=getAnchorAddress(cor,addr);
			if (a) this.fetchAddress(cor,a,markups);
		} else {
			if (corpus=="Taisho") { //not page number, sutra id with optional i
				notarget2address(cor,addr,newaddress=>{
					if (this.state.address!=newaddress) {
						this.fetchAddress(cor,newaddress,markups);
					}
				});
				return;
			}
			this.fetchAddress(cor,addr,markups);
		}
	}
	updateArticleByAddress(addr){
		const addressH=this.state.cor.stringify(addr);
		address.setMain(addressH);
	}	
	updateMainText(fulladdress){
		const r=fulladdress.split("@");
		const cor=corpora.store.corpora[r[0]];
		var a=r[1];
		if (cor) {
			const range=cor.parseRange(a);
			if (!range.start) a=cor.stringify(getAnchorAddress(cor,a));
		}
		corpora.setActive(r[0]);
		address.setMain(a);
	}
	render(){
		if (this.state.message || !this.state.article) {
			return E("div",{},this.state.message);
		}
		const menuprops=Object.assign({},this.props,{
			cor:this.state.cor,
			address:this.state.address});
		return E("div",{},
			E("div",{style:styles.abscontainer},
			 E("div",{style:styles.menu},E(AuxMainmenu,menuprops))
			)

			, E(CorpusView,{address:this.state.address,
			decorators,
			id:"aux",
			cor:this.state.cor,
			corpora:corpora.store.corpora,
			article:this.state.article,
			rawlines:this.state.rawlines,
			fields:this.props.displayField(this.state.fields),
			showNotePopup:this.props.showNotePopup,
			copyText:quoteCopy,
			showPageStart:true,
			updateArticleByAddress:this.updateArticleByAddress.bind(this),
			openLink:this.updateMainText.bind(this),
			aux:true//open Link will update main text
			})
		);
	}
}
module.exports=observer(ReferenceView);